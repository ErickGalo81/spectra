import Image from "next/image";
import Link from "next/link";

export default function CadastrarAlunoPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Cabeçalho (Header) Atualizado - Sem "Cadastrar" e "Planos", sem itálico */}
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

            {/* Menu de Navegação - Apenas Início e Sobre */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/home" 
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all"
              >
                Início
              </Link>
              <Link 
                href="/sobre" 
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all"
              >
                Sobre
              </Link>
            </nav>

            {/* Perfil Opcional (Mantido do padrão anterior para consistência) */}
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
      <main className="w-full max-w-4xl px-4 pb-12">
        {/* Fundo do Card - Substituído de Verde para Branco */}
        <div className="bg-white w-full rounded-[32px] px-8 py-12 flex flex-col items-center shadow-sm border border-slate-200">
          
          <h1 className="text-3xl font-semibold text-slate-800 mb-3 text-center tracking-tight">
            Cadastrar Novo Aluno
          </h1>
          <p className="text-base text-slate-600 mb-10 text-center max-w-2xl">
            Cadastre o Novo Aluno para obter recursos e planos personalizados.
          </p>

          {/* Formulário Centralizado */}
          <form className="w-full max-w-md flex flex-col gap-5">
            
            {/* Nome Completo do Aluno */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-lg mr-3">👤</span>
              <input 
                type="text" 
                placeholder="Nome Completo do Aluno" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm" 
              />
            </div>

            {/* E-mail Institucional */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-lg mr-3">✉️</span>
              <input 
                type="email" 
                placeholder="E-mail Institucional" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm" 
              />
            </div>

            {/* Senha */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-lg mr-3">🔒</span>
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm" 
              />
            </div>

            {/* Confirmar Senha */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-lg mr-3">🛡️</span>
              <input 
                type="password" 
                placeholder="Confirmar Senha" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm" 
              />
            </div>

            {/* Escola / Matrícula */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-lg mr-3">🏫</span>
              <input 
                type="text" 
                placeholder="Escola/Matrícula" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm" 
              />
            </div>

            {/* Botão de Cadastro */}
            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="bg-slate-800 hover:bg-slate-900 text-white font-medium text-base py-4 rounded-xl transition-all shadow-sm w-full"
              >
                Concluir Cadastro
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}