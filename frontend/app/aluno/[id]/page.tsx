'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface AlunoCompleto {
  id: number;
  nome: string;
  diagnostico: string;
  sugestao_manejo?: {
    tipo: string;
    gatilhos: string;
    passos_crise: string[];
    aprendizagem: string[];
  };
  peis?: Array<{ objetivos: string; }>;
}

export default function ExibirPlanoPage() {
  const { id } = useParams();
  const [aluno, setAluno] = useState<AlunoCompleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      const token = localStorage.getItem('spectra_token');
      try {
        const res = await axios.get(`http://localhost:8000/api/alunos/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAluno(res.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (id) buscarDados();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Sincronizando Plano...</div>;
  if (!aluno) return <div className="min-h-screen flex items-center justify-center text-red-500">Aluno não encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header - SEM IDADE */}
        <div className="p-10 flex items-center gap-6 border-b border-slate-50">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl shadow-inner border border-slate-200">
            {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{aluno.nome}</h2>
            <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full tracking-wider">
              {aluno.diagnostico || 'Perfil Geral'}
            </span>
          </div>
        </div>

        <div className="px-10 pb-12 space-y-8 mt-8">
          
          {/* SEÇÃO 1: PROTOCOLO DE CRISE (PASSOS) */}
          <section className="bg-red-50/30 p-8 rounded-[32px] border border-red-100">
            <h3 className="text-red-700 font-bold mb-4 flex items-center gap-2">
              🚨 Protocolo de Manejo de Crise
            </h3>
            <div className="space-y-3">
              {aluno.sugestao_manejo?.passos_crise.map((passo, i) => (
                <div key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">{i+1}</span>
                  <p>{passo}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SEÇÃO 2: AUXÍLIO DE APRENDIZAGEM */}
          <section className="bg-indigo-50/30 p-8 rounded-[32px] border border-indigo-100">
            <h3 className="text-indigo-800 font-bold mb-4 flex items-center gap-2">
              📚 Auxílio e Estratégias de Aprendizagem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aluno.sugestao_manejo?.aprendizagem.map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-indigo-50 flex items-start gap-3 shadow-sm">
                  <span className="text-indigo-400">✔</span>
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Botões */}
          <div className="flex gap-4 pt-6 no-print">
            <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-lg">
              🖨️ Imprimir PEI
            </button>
            <Link href="/planos-ativos" className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-center">
              Voltar para Lista
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}