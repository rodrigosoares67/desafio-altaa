'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { Plus, ArrowRight, Loader2, User, Shield, Image as ImageIcon } from 'lucide-react';

// 1. ATUALIZAÇÃO DA INTERFACE PARA O FORMATO REAL
interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  memberships: {
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }[];
}

export default function CompaniesPage() {
  const router = useRouter();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyLogo, setNewCompanyLogo] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function fetchCompanies(pageNumber = 1) {
    try {
      setLoading(true);
      const response = await api.get(`/companies?page=${pageNumber}&limit=6`);
      setCompanies(response.data.data);
      setTotalPages(response.data.meta.last_page);
      setPage(pageNumber);
    } catch (error) {
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function handleCreateCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    try {
      setIsCreating(true);
      await api.post('/company', { 
        name: newCompanyName,
        logoUrl: newCompanyLogo || undefined
      });
      toast.success('Empresa criada com sucesso!');
      setNewCompanyName('');
      setNewCompanyLogo('');
      fetchCompanies(1); 
    } catch (error) {
      toast.error('Erro ao criar empresa');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSelectCompany(id: string) {
    try {
      await api.post(`/company/${id}/select`);
      toast.success('Empresa selecionada!');
      router.push(`/company/${id}`);
    } catch (error) {
      toast.error('Erro ao selecionar empresa');
    }
  }

  return (
    <div>
      <Toaster richColors position="top-right" />
      
      {/* Seção de Criação */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          Nova Organização
        </h2>
        
        <form onSubmit={handleCreateCompany} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nome da Empresa</label>
            <input 
              type="text" 
              placeholder="Ex: Minha Startup" 
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">URL da Logo (Opcional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="url" 
                placeholder="https://..." 
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                value={newCompanyLogo}
                onChange={(e) => setNewCompanyLogo(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isCreating}
            className="w-full md:w-auto bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-50 h-[42px]"
          >
            {isCreating ? <Loader2 className="animate-spin h-4 w-4"/> : 'Criar'}
          </button>
        </form>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">Minhas Empresas</h3>
      
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-blue-500"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            // 2. EXTRAÇÃO DA ROLE DO ARRAY
            const userRole = company.memberships[0]?.role || 'MEMBER';

            return (
              <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {company.logoUrl ? (
                      <img 
                        src={company.logoUrl} 
                        alt={company.name} 
                        className="h-12 w-12 rounded-lg object-contain border border-gray-100 bg-gray-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-200">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      userRole === 'OWNER' ? 'bg-purple-100 text-purple-700' : 
                      userRole === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {userRole}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 truncate" title={company.name}>{company.name}</h4>
                  
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    {userRole === 'OWNER' ? <Shield className="h-3 w-3"/> : <User className="h-3 w-3"/>}
                    {userRole === 'OWNER' ? 'Você é o dono' : 'Membro da equipe'}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleSelectCompany(company.id)}
                  className="mt-6 w-full flex items-center justify-center gap-2 text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 py-2 rounded-md transition"
                >
                  Acessar Painel
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center mt-8 gap-2">
          <button 
            disabled={page === 1}
            onClick={() => fetchCompanies(page - 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 text-gray-700"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-600">Página {page} de {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => fetchCompanies(page + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 text-gray-700"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}