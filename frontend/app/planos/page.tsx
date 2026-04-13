
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CriacaoPlanoPage() {
  const router = useRouter();

  // 1. Estados capturando os dados exatamente como o usuário digita
  const [nome, setNome] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [suporte, setSuporte] = useState('');
  const [autorizado, setAutorizado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!autorizado) {
      alert("Por favor, confirme a autorização dos dados.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('spectra_token');

    try {
      // 2. ENVIANDO OS DADOS - AJUSTADO PARA O SEU MODELS.PY
      await axios.post('http://localhost:8000/api/alunos/', {
        nome: nome, // Mudei de nome_completo para 'nome' para bater com seu Model
        diagnostico: diagnostico,
        data_nascimento: "2015-01-01", // Campo obrigatório no seu Model (estou enviando um padrão)
        matricula: "MAT-" + Math.floor(Math.random() * 10000), // Gerando uma matrícula temporária
        
        // Se você adicionou os campos de progresso no Model como sugerido:
        comunicacao: 50,
        humor: 50,
        social: 50,
        motor: 50
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Plano gerado e salvo com sucesso!");
      router.push('/planos-ativos'); // Te joga direto para a lista
      
    } catch (err: any) {
      console.error("ERRO DO DJANGO:", err.response?.data);
      alert("Erro ao salvar. Verifique se o servidor Django está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Cabeçalho (Header) Padronizado */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/home" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 hover:opacity-80 transition-opacity">
                  🧠 SPECTRA
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/home" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">Início</Link>
              <Link href="/sobre" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-md text-base font-medium transition-all">Sobre</Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">PM</div>
              <span className="hidden md:block text-slate-700 font-medium text-base">Prof. Marcos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="w-full max-w-4xl px-4 pb-12">
        <div className="bg-white w-full rounded-[32px] px-8 py-12 flex flex-col items-center shadow-sm border border-slate-200">
          
          <h1 className="text-3xl font-semibold text-slate-800 mb-3 text-center tracking-tight">
            Criação de Plano
          </h1>
          <p className="text-base text-slate-600 mb-10 text-center max-w-2xl">
            Informe as necessidades do aluno para receber um guia e plano de ensino personalizado.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-5">
            
            {/* Nome do Aluno */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">👤</span>
              <input 
                type="text" required placeholder="Nome Completo do Aluno" 
                className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium" 
                value={nome} onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* Necessidades Específicas */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">👁️</span>
              <input 
                type="text" placeholder="Necessidades Específicas (ex: Autismo, TDAH...)" 
                className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium" 
                value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)}
              />
            </div>

            {/* Observações */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">📈</span>
              <input 
                type="text" placeholder="Observações de Comportamento e Aprendizagem" 
                className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium" 
                value={observacoes} onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            {/* Nível de Suporte */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 transition-all shadow-sm">
              <span className="text-slate-400 text-xl mr-4">✔️</span>
              <select 
                required className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium cursor-pointer"
                value={suporte} onChange={(e) => setSuporte(e.target.value)}
              >
                <option value="" disabled hidden>Nível de Suporte Necessário</option>
                <option value="1">Nível 1 - Suporte Leve</option>
                <option value="2">Nível 2 - Suporte Moderado</option>
                <option value="3">Nível 3 - Suporte Substancial</option>
              </select>
            </div>

            {/* Autorização */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-4 shadow-sm">
              <span className="text-slate-400 text-xl mr-4">🛡️</span>
              <div className="flex items-center gap-3 w-full">
                <input 
                  type="checkbox" checked={autorizado} onChange={(e) => setAutorizado(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 cursor-pointer" 
                />
                <label className="text-slate-700 text-sm font-medium cursor-pointer">
                  Confirmo a Autorização e o Consentimento dos dados informados
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-900 text-white font-medium text-base py-4 px-24 rounded-xl transition-all shadow-sm w-full md:w-auto min-w-[250px] disabled:opacity-50"
              >
                {loading ? "Gerando..." : "Gerar Plano"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}