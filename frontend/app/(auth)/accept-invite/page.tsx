'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { toast, Toaster } from 'sonner';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error('Token inválido ou ausente.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/accept-invite', {
        token,
        name,
        password,
      });

      toast.success('Conta criada e convite aceito!');
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao aceitar convite.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <div className="text-red-500 text-center">Token de convite não fornecido na URL.</div>;
  }

  return (
    <>
      <Toaster richColors position="top-center" />

      <div className="flex justify-center mb-6">
        <img 
          src="/assets/altaa_ai_logo.png" 
          alt="ALTAA" 
          className="h-8 w-auto object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Aceitar Convite</h1>
      <p className="text-center text-gray-500 mb-6 text-sm">Preencha seus dados para entrar na equipe.</p>
      
      <form onSubmit={handleAccept} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Seu Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 outline-none text-gray-900 bg-white"
            placeholder="Ex: Maria Silva"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Crie uma Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 outline-none text-gray-900 bg-white"
            placeholder="******"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Aceitar e Criar Conta'}
        </button>
      </form>
    </>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="text-center p-4">Carregando convite...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}