'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { toast, Toaster } from 'sonner';
import { Trash2, Mail, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface Member {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CompanyDetails {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export default function CompanyDashboard() {
  const params = useParams();
  const companyId = params.id as string;
  const router = useRouter();

  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviting, setInviting] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      
      const [companyRes, membersRes, userRes] = await Promise.all([
        api.get(`/company/${companyId}`),
        api.get(`/company/${companyId}/members`),
        api.get('/auth/me')
      ]);

      setCompany(companyRes.data);
      setMembers(membersRes.data);
      
      const myId = userRes.data.userId;
      setCurrentUserId(myId);

      const myMembership = membersRes.data.find((m: Member) => m.user.id === myId);
      if (myMembership) {
        setCurrentUserRole(myMembership.role);
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao carregar dados da empresa.');
      if (error.response?.status === 403) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [companyId]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setInviting(true);
      await api.post(`/company/${companyId}/invite`, {
        email: inviteEmail,
        role: inviteRole,
      });
      toast.success(`Convite enviado para ${inviteEmail}!`);
      setInviteEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar convite');
    } finally {
      setInviting(false);
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm('Tem certeza que deseja remover este usuário da empresa?')) return;

    try {
      await api.delete(`/company/${companyId}/members/${userId}`);
      toast.success('Membro removido com sucesso.');
      
      const response = await api.get(`/company/${companyId}/members`);
      setMembers(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao remover membro');
    }
  }

  if (loading && !company) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>;
  }

  const canInvite = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  return (
    <div>
      <Toaster richColors position="top-right" />

      <div className="bg-white border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-8 flex items-center gap-6">
        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
            <ArrowLeft className="h-6 w-6" />
        </Link>
        
        {company && (
          <div className="flex items-center gap-4">
            {company.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={company.name} 
                className="h-16 w-16 rounded-lg object-contain border border-gray-200 bg-gray-50"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-3xl shadow-sm">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                Painel de Controle
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={canInvite ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Membros da Equipe</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{members.length} ativos</span>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((membership) => (
                  <tr key={membership.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                          {membership.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{membership.user.name}</div>
                          <div className="text-sm text-gray-500">{membership.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${membership.role === 'OWNER' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                          membership.role === 'ADMIN' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                          'bg-green-100 text-green-800 border border-green-200'}`}>
                        {membership.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canInvite && membership.role !== 'OWNER' && membership.user.id !== currentUserId && (
                        <button 
                          onClick={() => handleRemoveMember(membership.user.id)}
                          className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
                          title="Remover membro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {canInvite && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Convidar Membro
              </h2>
              <p className="text-sm text-gray-500 mb-6">Envie um e-mail para adicionar novos colaboradores ao time.</p>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="colaborador@email.com"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissão</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                  >
                    <option value="MEMBER">Membro</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-70 transition font-medium"
                >
                  {inviting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Enviar Convite'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}