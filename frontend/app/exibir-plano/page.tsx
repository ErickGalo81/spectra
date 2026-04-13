import Image from "next/image";
import Link from "next/link";

export default function ExibirPlanoPage() {
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
            Plano de Ensino Individualizado (PEI)
          </h1>

          {/* Perfil do Aluno */}
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

          {/* 1. Laudos Médicos de Base */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
                <span className="text-indigo-600">1.</span> Laudos Médicos de Base
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium">
              <span className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors">
                📄 laudo_neurologico_2025.pdf
              </span>
              <span className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors">
                📄 relatorio_fonoaudiologia.doc
              </span>
            </div>
            
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Aluno com diagnóstico de Autismo Nível 1 e Transtorno do Déficit de Atenção com Hiperatividade (TDAH). Apresenta forte hipersensibilidade auditiva e certa rigidez cognitiva em mudanças de rotina não avisadas.
            </p>
          </div>

          {/* 2. Metas */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-5">
            <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-indigo-600">2.</span> Metas Principais
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">Desenvolver habilidades de comunicação verbal iniciada pelo próprio aluno.</p>
              </li>
              <li className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">Melhorar a regulação emocional durante transições de ambiente (ex: da sala de aula para o pátio).</p>
              </li>
              <li className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">Identificar e nomear 5 emoções básicas em si mesmo e nos colegas.</p>
              </li>
            </ul>
          </div>

          {/* 3. Estratégias Pedagógicas e de Manejo */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-5">
            <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-indigo-600">3.</span> Estratégias Pedagógicas e de Manejo
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Uso diário de cronograma visual colado na carteira do aluno. Permissão irrestrita para uso de abafador de ruídos em momentos de agitação ou barulho na sala. Antecipação verbal obrigatória de 5 minutos antes de qualquer mudança de atividade ou rotina. Oferecer pausas estruturadas no "cantinho da calma" sempre que o aluno demonstrar sinais iniciais de sobrecarga sensorial.
            </p>
          </div>

          {/* Próxima Revisão */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-center justify-between">
            <h3 className="text-amber-800 font-medium">
              Próxima Revisão Obrigatória:
            </h3>
            <span className="font-bold text-amber-900 bg-amber-100 px-4 py-1.5 rounded-lg">
              10 / DEZ / 2026
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8">
            <button className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium text-base py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Exportar para PDF
            </button>

            <Link 
              href="/planos-ativos" 
              className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-base py-4 rounded-xl transition-all flex justify-center items-center shadow-sm"
            >
              Voltar para Planos Ativos
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}