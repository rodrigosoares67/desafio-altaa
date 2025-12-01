'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', { name, email, password });
      toast.success('Conta criada com sucesso!');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (error: any) {
      toast.error('Erro ao criar conta. Tente outro email.');
    } finally {
      setLoading(false);
    }
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
      
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Crie sua conta</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 outline-none text-gray-900 bg-white"
            placeholder="Seu nome"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 outline-none text-gray-900 bg-white"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 outline-none text-gray-900 bg-white"
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? 'Criando...' : 'Cadastrar'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-900 bg-white">
        Já tem conta? <Link href="/login" className="text-blue-600 hover:underline">Entrar</Link>
      </div>
    </>
  );
}