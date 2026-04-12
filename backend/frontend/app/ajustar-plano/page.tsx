import Image from "next/image";
import Link from "next/link";

export default function AjustarPlanoPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center pb-12">
      
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
      <main className="w-full max-w-4xl px-4">
        <div className="bg-white w-full rounded-[32px] px-8 py-10 flex flex-col shadow-sm border border-slate-200">
          
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight text-center mb-8">
            Ajustar Plano
          </h1>

          {/* Cabeçalho do Aluno */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-4xl shrink-0">
              👦🏻
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-2xl mb-2">Lucas Almeida</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-600 font-medium text-sm mr-2">8 anos</span>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                  TDAH
                </span>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                  Autismo
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* 1. Laudos */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-indigo-600">1.</span> Laudos Médicos
              </h3>
              
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                  <span className="text-sm text-slate-600 font-medium truncate pr-2">📄 laudo_neurologico.pdf</span>
                  <button className="text-slate-400 hover:text-red-500 transition-colors" title="Remover">✕</button>
                </div>
                <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                  <span className="text-sm text-slate-600 font-medium truncate pr-2">📄 relatorio_fono.doc</span>
                  <button className="text-slate-400 hover:text-red-500 transition-colors" title="Remover">✕</button>
                </div>
              </div>
              
              <button className="w-full py-3 bg-white border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-medium rounded-xl transition-all flex items-center justify-center gap-2 mt-auto">
                <span className="text-xl leading-none">+</span> Anexar documento
              </button>
            </div>

            {/* 2. Metas */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-indigo-600">2.</span> Metas Principais
              </h3>
              
              <div className="space-y-3 mb-4 flex-grow">
                <div className="flex gap-3 items-start bg-white border border-slate-200 p-3 rounded-xl shadow-sm group">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <p className="text-slate-700 text-sm font-medium w-full outline-none" contentEditable suppressContentEditableWarning>
                    Desenvolver habilidades de comunicação verbal iniciada pelo aluno.
                  </p>
                  <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">✕</button>
                </div>
                
                <div className="flex gap-3 items-start bg-white border border-slate-200 p-3 rounded-xl shadow-sm group">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <p className="text-slate-700 text-sm font-medium w-full outline-none" contentEditable suppressContentEditableWarning>
                    Melhorar a regulação emocional durante transições de ambiente.
                  </p>
                  <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">✕</button>
                </div>
              </div>

              <input 
                type="text" 
                className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all mt-auto" 
                placeholder="Adicionar nova meta..." 
              />
            </div>
          </div>

          {/* 3. Estratégias */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-indigo-600">3.</span> Estratégias Pedagógicas e de Manejo
            </h3>
            <textarea 
              className="w-full h-32 bg-white border border-slate-300 rounded-xl p-4 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y shadow-sm"
              defaultValue="Uso diário de cronograma visual colado na carteira do aluno. Permissão irrestrita para uso de abafador de ruídos em momentos de agitação ou barulho na sala. Antecipação verbal obrigatória de 5 minutos antes de qualquer mudança de atividade ou rotina."
            />
          </div>

          {/* Revisão */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
              Data da Próxima Revisão:
            </h3>
            <input 
              type="text" 
              defaultValue="10/12/2026" 
              className="bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 font-bold text-slate-700 w-full sm:w-auto outline-none transition-all shadow-sm text-center" 
            />
          </div>

          {/* Botões Finais */}
          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base py-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2">
              Salvar Alterações
            </button>
            <Link href="/planos-ativos" className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-base py-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2">
              Cancelar
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}