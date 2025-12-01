'use client';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
      router.push('/');
    } catch (error) {
      console.error('Erro ao sair', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/altaa_ai_logo.png" 
              alt="ALTAA" 
              className="h-8 w-auto object-contain"
            />
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <span className="font-medium text-gray-600 text-sm sm:text-base">
              Desafio Técnico
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <span className="text-sm font-medium">Sair</span>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}