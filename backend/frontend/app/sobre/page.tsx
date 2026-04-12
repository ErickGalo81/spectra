import Image from "next/image";
import Link from "next/link";

export default function SobrePage() {
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

            {/* Menu de Navegação - "Sobre" destacado */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/home" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Início
              </Link>
              <Link href="/cadastrar-aluno" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Cadastrar
              </Link>
              <Link href="/planos-ativos" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">
                Planos
              </Link>
              <Link href="/sobre" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md text-base font-medium transition-all">
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
        <div className="bg-white w-full rounded-[32px] px-8 py-12 flex flex-col shadow-sm border border-slate-200">
          
          <div className="text-center mb-10 border-b border-slate-100 pb-8">
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight mb-4">
              Sobre o Spectra
            </h1>
            <p className="text-slate-600 text-base leading-relaxed max-w-3xl mx-auto">
              O SPECTRA é um sistema desenvolvido para auxiliar professores e tutores no acompanhamento de alunos com necessidades educacionais específicas, especialmente o Transtorno do Espectro Autista (TEA) e TDAH. Nossa missão é facilitar a criação de Planos de Ensino Individualizados (PEI) e o registro de progresso escolar.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mb-6 px-2">Perguntas Frequentes (FAQ)</h2>

          {/* Lista de Perguntas - Usando tags <details> nativas do HTML */}
          <div className="flex flex-col gap-4 w-full">
            
            {/* Pergunta 1 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl">
                <span>Quem pode usar o sistema?</span>
                <span className="shrink-0 rounded-full bg-white p-1.5 text-slate-500 border border-slate-200 group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4 mt-2">
                O Spectra foi criado principalmente para professores da educação básica, educadores especiais, tutores, psicopedagogos e coordenadores pedagógicos que precisam estruturar e acompanhar o desenvolvimento de alunos neurodivergentes de forma organizada.
              </div>
            </details>

            {/* Pergunta 2 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl">
                <span>Como cadastrar um aluno?</span>
                <span className="shrink-0 rounded-full bg-white p-1.5 text-slate-500 border border-slate-200 group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4 mt-2">
                Para cadastrar um novo aluno, navegue até a aba "Cadastrar" no menu superior. Preencha os dados básicos de identificação (nome, idade, matrícula institucional). Após o cadastro inicial, você poderá associar laudos e criar um plano de ensino específico para ele.
              </div>
            </details>

            {/* Pergunta 3 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl">
                <span>O que é um plano de acompanhamento?</span>
                <span className="shrink-0 rounded-full bg-white p-1.5 text-slate-500 border border-slate-200 group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4 mt-2">
                O plano de acompanhamento (conhecido na área como PEI - Plano de Ensino Individualizado) é um documento vivo onde o professor estabelece metas claras de desenvolvimento (cognitivo, motor, social e comunicativo) e define as estratégias pedagógicas adequadas às necessidades daquele aluno específico.
              </div>
            </details>

            {/* Pergunta 4 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl">
                <span>Como funciona o registro de progresso?</span>
                <span className="shrink-0 rounded-full bg-white p-1.5 text-slate-500 border border-slate-200 group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4 mt-2">
                Na visão geral do aluno (Dashboard), você visualiza gráficos de barras que representam o progresso em diferentes áreas (Humor, Comunicação, Social, Motor). Essas métricas devem ser atualizadas periodicamente pelo profissional com base na observação diária e na resposta do aluno às intervenções propostas no plano.
              </div>
            </details>

            {/* Pergunta 5 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl">
                <span>Meus dados e os dados dos alunos estão seguros?</span>
                <span className="shrink-0 rounded-full bg-white p-1.5 text-slate-500 border border-slate-200 group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4 mt-2">
                Sim. O Spectra trata com extrema seriedade as informações sensíveis de saúde e educação. Todos os dados são criptografados e acessíveis apenas pelo professor responsável pela conta ou pela instituição de ensino conveniada, respeitando as diretrizes da Lei Geral de Proteção de Dados (LGPD).
              </div>
            </details>

          </div>
        </div>
      </main>
    </div>
  );
}