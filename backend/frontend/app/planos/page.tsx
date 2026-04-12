import Image from "next/image";
import Link from "next/link";

export default function CriacaoPlanoPage() {
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

            {/* Menu de Navegação - Limpo e Profissional */}
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
      <main className="w-full max-w-4xl px-4 pb-12">
        {/* Card Principal - Fundo Branco com borda sutil */}
        <div className="bg-white w-full rounded-[32px] px-8 py-12 flex flex-col items-center shadow-sm border border-slate-200">
          
          <h1 className="text-3xl font-semibold text-slate-800 mb-3 text-center tracking-tight">
            Criação de Plano
          </h1>
          <p className="text-base text-slate-600 mb-10 text-center max-w-2xl">
            Informe as necessidades do aluno para receber um guia e plano de ensino personalizado.
          </p>

          {/* Formulário Centralizado */}
          <form className="w-full max-w-2xl flex flex-col gap-5">
            
            {/* Nome do Aluno */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">👤</span>
              <input 
                type="text" 
                placeholder="Nome Completo do Aluno" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" 
              />
            </div>

            {/* Necessidades Específicas */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">👁️</span>
              <input 
                type="text" 
                placeholder="Necessidades Específicas (ex: Autismo, TDAH...)" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" 
              />
            </div>

            {/* Observações */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">📈</span>
              <input 
                type="text" 
                placeholder="Observações de Comportamento e Aprendizagem" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" 
              />
            </div>

            {/* Nível de Suporte */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">✔️</span>
              <select 
                defaultValue="" 
                className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium cursor-pointer"
              >
                <option value="" disabled hidden className="text-slate-400">
                  Nível de Suporte Necessário (1, 2 ou 3) com base no laudo
                </option>
                <option value="1" className="text-slate-700">Nível 1 - Suporte Leve</option>
                <option value="2" className="text-slate-700">Nível 2 - Suporte Moderado</option>
                <option value="3" className="text-slate-700">Nível 3 - Suporte Substancial</option>
              </select>
            </div>

            {/* Autorização */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-4 shadow-sm">
              <span className="text-slate-400 text-xl mr-4">🛡️</span>
              <div className="flex items-center gap-3 w-full">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                />
                <label className="text-slate-700 text-sm font-medium cursor-pointer">
                  Confirmo a Autorização e o Consentimento dos dados informados
                </label>
              </div>
            </div>

            {/* Botão */}
            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="bg-slate-800 hover:bg-slate-900 text-white font-medium text-base py-4 px-24 rounded-xl transition-all shadow-sm w-full md:w-auto min-w-[250px]"
              >
                Gerar Plano
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}