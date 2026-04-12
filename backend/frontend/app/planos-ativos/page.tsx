import Image from "next/image";
import Link from "next/link";

export default function PlanosAtivosPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Cabeçalho (Header) Padronizado */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
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
              <Link href="/planos-ativos" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Planos
              </Link>
              <Link href="/sobre" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Sobre
              </Link>
            </nav>

            {/* Perfil */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
                PM
              </div>
              <span className="hidden md:block text-slate-700 font-medium text-base">Prof. Marcos</span>
            </div>

          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white w-full rounded-[32px] px-8 py-10 flex flex-col shadow-sm border border-slate-200">
          
          {/* Cabeçalho da Seção */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
              Planos Ativos
            </h1>
            <Link 
              href="/planos"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm shadow-sm"
            >
              <span className="text-lg leading-none">+</span> Criar Novo Plano
            </Link>
          </div>

          {/* NOVO: Barra de Pesquisa */}
          <div className="mb-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm max-w-md">
            <span className="text-slate-400 text-lg mr-3">🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisar aluno pelo nome..." 
              className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" 
            />
          </div>

          {/* Grid de Cards dos Alunos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card Aluno 1: Lucas */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl">
                    👦🏻
                  </div>
                  <div>
                    <h2 className="text-slate-800 font-semibold text-xl">Lucas</h2>
                    <span className="text-slate-500 text-sm font-medium">8 anos</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Ativo</span>
              </div>
              
              <div className="space-y-1.5 mb-6 border-b border-slate-200 pb-4">
                <p className="text-slate-500 text-sm"><strong className="text-slate-700">Diagnóstico:</strong> Autismo, TDAH</p>
                <p className="text-slate-500 text-sm"><strong className="text-slate-700">Escolaridade:</strong> Ensino Fundamental I</p>
              </div>

              {/* Barras de Progresso - Cores mais suaves e profissionais */}
              <div className="space-y-4 mb-8 flex-grow">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Comunicação</span><span>60%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[60%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Humor</span><span>30%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full w-[30%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Social</span><span>50%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400 rounded-full w-[50%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Motor</span><span>30%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[30%]"></div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Linkados */}
              <div className="flex gap-3 mt-auto">
                <Link href="/exibir-plano" className="flex-1 text-center py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
                  Exibir Plano
                </Link>
                <Link href="/ajustar-plano" className="flex-1 text-center py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors shadow-sm">
                  Ajustar Plano
                </Link>
              </div>
            </div>

            {/* Card Aluno 2: Sofia */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl">
                    👧🏼
                  </div>
                  <div>
                    <h2 className="text-slate-800 font-semibold text-xl">Sofia</h2>
                    <span className="text-slate-500 text-sm font-medium">10 anos</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Ativo</span>
              </div>
              
              <div className="space-y-1.5 mb-6 border-b border-slate-200 pb-4">
                <p className="text-slate-500 text-sm"><strong className="text-slate-700">Diagnóstico:</strong> TDAH</p>
                <p className="text-slate-500 text-sm"><strong className="text-slate-700">Escolaridade:</strong> Ensino Fundamental II</p>
              </div>

              {/* Barras de Progresso */}
              <div className="space-y-4 mb-8 flex-grow">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Comunicação</span><span>80%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[80%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Humor</span><span>45%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full w-[45%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Social</span><span>70%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400 rounded-full w-[70%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Motor</span><span>90%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[90%]"></div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Linkados */}
              <div className="flex gap-3 mt-auto">
                <Link href="/exibir-plano" className="flex-1 text-center py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
                  Exibir Plano
                </Link>
                <Link href="/ajustar-plano" className="flex-1 text-center py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors shadow-sm">
                  Ajustar Plano
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}