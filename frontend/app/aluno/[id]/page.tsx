'use client';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface AlunoCompleto {
  id: number;
  nome: string;
  matricula: string;
  diagnostico: string;
  sugestao_manejo?: {
    tipo: string;
    gatilhos: string;
    passos_crise: string[];
    aprendizagem: string[];
  };
  // Caso você tenha metas vinculadas
  objetivos?: string; 
  metodologia?: string;
}

export default function ExibirPlanoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [aluno, setAluno] = useState<AlunoCompleto | null>(null);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // Busca Perfil do Professor e Dados do Aluno em paralelo
        const [resUser, resAluno] = await Promise.all([
          axios.get('http://localhost:8000/api/me/', config),
          axios.get(`http://localhost:8000/api/alunos/${id}/`, config)
        ]);

        setUsuario({ nome: resUser.data.nome, cargo: resUser.data.cargo });
        setAluno(resAluno.data);
      } catch (err) { 
        console.error("Erro ao carregar dados do aluno:", err); 
      } finally { 
        setLoading(false); 
      }
    };

    if (id) buscarDados();
  }, [id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Sincronizando Prontuário...</div>;
  if (!aluno) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Aluno não encontrado.</div>;

  const iniciais = usuario.nome !== "Carregando..." 
    ? usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) 
    : "??";

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Header Padronizado SPECTRA */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/home" className="text-2xl font-bold text-slate-800">🧠 SPECTRA</Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 shadow-sm">{iniciais}</div>
            <span className="hidden md:block text-slate-700 font-semibold text-sm">{usuario.nome}</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl px-4 pb-12">
        <div className="bg-white w-full rounded-[40px] shadow-sm border border-slate-200 overflow-hidden relative">
          
          {/* Botão Voltar */}
          <button 
            onClick={() => router.push('/planos-ativos')}
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest">Voltar</span>
          </button>

          {/* Header do Aluno */}
          <div className="p-10 flex flex-col items-center border-b border-slate-50 mt-4">
            <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-5xl shadow-sm border border-slate-100 mb-4">
              {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{aluno.nome}</h2>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-lg tracking-widest border border-indigo-100">
                {aluno.diagnostico || 'Perfil Geral'}
              </span>
              <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg tracking-widest border border-slate-100">
                Matrícula: {aluno.matricula}
              </span>
            </div>
          </div>

          <div className="px-10 pb-12 space-y-8 mt-8">
            
            {/* SEÇÃO 1: PROTOCOLO DE CRISE */}
            <section className="bg-red-50/40 p-8 rounded-[32px] border border-red-100">
              <h3 className="text-red-700 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                🚨 Protocolo de Manejo de Crise
              </h3>
              <div className="space-y-4">
                {aluno.sugestao_manejo?.passos_crise.map((passo, i) => (
                  <div key={i} className="flex gap-4 text-sm text-slate-700 font-semibold bg-white/60 p-3 rounded-2xl border border-red-50">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">{i+1}</span>
                    <p className="leading-relaxed">{passo}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SEÇÃO 2: AUXÍLIO DE APRENDIZAGEM */}
            <section className="bg-indigo-50/40 p-8 rounded-[32px] border border-indigo-100">
              <h3 className="text-indigo-800 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                📚 Estratégias de Aprendizagem
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aluno.sugestao_manejo?.aprendizagem.map((item, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-indigo-50 flex items-start gap-3 shadow-sm">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <p className="text-slate-600 text-xs font-bold leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SEÇÃO 3: METAS E OBJETIVOS (PEI) */}
            <section className="bg-slate-50 p-8 rounded-[32px] border border-slate-200">
              <h3 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] mb-4">
                🎯 Objetivos do Período
              </h3>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {aluno.objetivos || "Nenhum objetivo específico cadastrado para este aluno no momento."}
              </div>
            </section>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6 no-print">
              <button 
                onClick={() => window.print()} 
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95"
              >
                🖨️ Imprimir Prontuário
              </button>
              <Link 
                href="/planos-ativos" 
                className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-center hover:bg-slate-50 transition-all"
              >
                Voltar para Lista
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}