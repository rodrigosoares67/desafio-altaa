import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Users, Building2, Zap, Layout, Github } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/altaa_ai_logo.png" 
              alt="ALTAA" 
              className="h-8 w-auto object-contain"
            />
            <div className="h-5 w-px bg-gray-300 hidden sm:block"></div>
            <span className="text-sm font-medium text-gray-500 hidden sm:block">Desafio Técnico</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Entrar
            </Link>
            <Link 
              href="/signup" 
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Mini plataforma <br className="hidden sm:block" />
            <span className="text-blue-600">Multi-tenant</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed">
            Gestão de múltiplas empresas e usuários, convites de membros via e-mail e autenticação segura com JWT.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              Acessar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="https://github.com/rodrigosoares67/desafio-altaa" 
              target="_blank"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Ver Repositório
              <Github className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-30">
           <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
           <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Funcionalidades Principais</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desenvolvido focando em escalabilidade e segurança
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${feature.bg}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
            Stack Tecnológica Moderna
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-xl font-bold text-gray-800">Next.js 16</span>
             <span className="text-xl font-bold text-gray-800">NestJS 11</span>
             <span className="text-xl font-bold text-gray-800">Prisma ORM 5</span>
             <span className="text-xl font-bold text-gray-800">PostgreSQL 15</span>
             <span className="text-xl font-bold text-gray-800">Docker</span>
             <span className="text-xl font-bold text-gray-800">TailwindCSS 4</span>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <span className="font-bold text-gray-900">Desafio Técnico ALTAA</span>
             <span className="text-gray-400">|</span>
             <span className="text-sm text-gray-500">Desenvolvido por Rodrigo Soares</span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Arquitetura Multi-tenant',
    description: 'Isolamento lógico de dados por empresa. Um usuário pode pertencer a múltiplas organizações com papéis distintos.',
    icon: Building2,
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    title: 'Autenticação Robusta',
    description: 'Implementação segura usando JWT armazenado em Cookies HTTP-Only.',
    icon: Shield,
    bg: 'bg-purple-50',
    color: 'text-purple-600',
  },
  {
    title: 'Convites & E-mails',
    description: 'Sistema de convites por e-mail com expiração automática.',
    icon: MailIcon,
    bg: 'bg-green-50',
    color: 'text-green-600',
  },
  {
    title: 'Controle de Acesso (RBAC)',
    description: 'Hierarquia de permissões com Dono (Owner), Administrador e Membro. Proteção contra remoção do último dono.',
    icon: Users,
    bg: 'bg-orange-50',
    color: 'text-orange-600',
  },
  {
    title: 'Frontend Moderno',
    description: 'Interface construída com Next.js, utilizando TailwindCSS para estilização.',
    icon: Layout,
    bg: 'bg-pink-50',
    color: 'text-pink-600',
  },
  {
    title: 'Infraestrutura Docker',
    description: 'Ambiente totalmente containerizado com Docker (Banco de dados, SMTP, API e Frontend).',
    icon: Zap,
    bg: 'bg-yellow-50',
    color: 'text-yellow-600',
  },
];

// Ícone customizado para evitar conflito de importação
function MailIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}