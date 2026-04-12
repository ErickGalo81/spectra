import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Cabeçalho (Header) Atualizado */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Lado Esquerdo: Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/home" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 hover:opacity-80 transition-opacity">
                  🧠 SPECTRA
                </span>
              </Link>
            </div>

            {/* Menu de Navegação */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/home" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Início
              </Link>
              <Link href="/cadastrar-aluno" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Cadastrar
              </Link>
              <Link href="/planos" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Planos
              </Link>
              <Link href="/sobre" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Sobre
              </Link>
            </nav>

            {/* Perfil e Notificações */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
                PM
              </div>
              <span className="text-slate-700 font-medium text-base">Prof. Marcos</span>
              <button className="text-slate-500 hover:text-slate-900 transition-colors ml-2 p-1 rounded-full hover:bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="p-8 max-w-6xl mx-auto mt-4">
        
        {/* Fundo Principal */}
        <div className="bg-white w-full rounded-[32px] p-10 shadow-sm border border-slate-200">
          
          <h1 className="text-3xl font-semibold text-slate-800 mb-8 text-center tracking-tight">
            Visão Geral
          </h1>

          {/* Grid dos Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Resumo dos Pacientes */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-slate-800 text-lg font-semibold">Resumo do Aluno</h2>
                <button className="w-8 h-8 rounded-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm">
                  <span className="font-medium text-lg leading-none">›</span>
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                   <span className="text-2xl">👦🏻</span>
                </div>
                <div>
                  <span className="block text-slate-800 font-semibold text-lg">Lucas</span>
                  <span className="block text-slate-500 text-sm">7 anos</span>
                </div>
              </div>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                <p className="text-slate-600 text-sm"><strong className="text-slate-800 font-medium">Diagnóstico:</strong> Autismo, TDAH</p>
                <p className="text-slate-600 text-sm"><strong className="text-slate-800 font-medium">Escolaridade:</strong> Ensino Fundamental I</p>
              </div>
            </div>

            {/* Card 2: Progresso Semanal */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h2 className="text-slate-800 text-lg font-semibold mb-6 text-center">Progresso Semanal</h2>
              
              <div className="flex items-end justify-around h-32 mt-4 px-4 border-b border-slate-200 pb-2">
                <div className="w-10 bg-slate-300 rounded-t-md h-[40%] hover:bg-slate-400 transition-colors"></div>
                <div className="w-10 bg-indigo-600 rounded-t-md h-[80%] hover:bg-indigo-700 transition-colors shadow-sm"></div>
                <div className="w-10 bg-indigo-300 rounded-t-md h-[60%] hover:bg-indigo-400 transition-colors"></div>
                <div className="w-10 bg-slate-700 rounded-t-md h-[95%] hover:bg-slate-800 transition-colors shadow-sm"></div>
              </div>
              <div className="flex justify-around text-xs text-slate-500 font-medium mt-3">
                <span>Comunicação</span>
                <span>Humor</span>
                <span>Social</span>
                <span>Motor</span>
              </div>
            </div>

            {/* Card 3: Dica do Dia */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 md:col-span-2 flex items-start gap-5 max-w-3xl mx-auto w-full">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h2 className="text-slate-800 text-lg font-semibold mb-2">Dica do Dia</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  <strong className="text-slate-800 font-medium">Criar Plano Personalizado de acordo com Laudo:</strong> Utilize os dados inseridos nas últimas sessões para ajustar as metas de comunicação do aluno no painel de intervenção.
                </p>
              </div>
            </div>

            {/* NOVO Card 4: Planos Ativos */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 md:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-slate-800 text-lg font-semibold">Planos Ativos</h2>
                <Link href="/planos-ativos" className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
                  Ver todos
                </Link>
              </div>

              {/* Lista de Planos */}
              <div className="space-y-4">
                
                {/* Plano 1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-300 transition-all shadow-sm group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-semibold text-base">Desenvolvimento Cognitivo e Social</h3>
                      <p className="text-slate-500 text-sm mt-0.5">Aluno: Lucas • Criado em: 10/10/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-wide">
                      Em andamento
                    </span>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors hidden sm:block">
                      <span className="text-2xl leading-none">›</span>
                    </button>
                  </div>
                </div>

                {/* Plano 2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-300 transition-all shadow-sm group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-semibold text-base">Aprimoramento Motor Fino</h3>
                      <p className="text-slate-500 text-sm mt-0.5">Aluno: Lucas • Criado em: 05/11/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold tracking-wide">
                      Revisão Pendente
                    </span>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors hidden sm:block">
                      <span className="text-2xl leading-none">›</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}