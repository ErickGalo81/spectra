"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ExibirPlanoPage() {
  const params = useParams(); // Pega o ID da URL (ex: /planos/5)
  const router = useRouter();
  
  const [pei, setPei] = useState<any>(null);
  const [aluno, setAluno] = useState<any>(null);
  const [laudo, setLaudo] = useState<any>(null);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosCompletos = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        // 1. Carrega Perfil do Professor
        const resUser = await axios.get("http://localhost:8000/api/me/", config);
        setUsuario({ nome: resUser.data.nome, cargo: resUser.data.cargo });

        // 2. Carrega o PEI específico pelo ID da URL
        const resPei = await axios.get(`http://localhost:8000/api/peis/${params.id}/`, config);
        setPei(resPei.data);

        // 3. Com o ID do aluno que vem no PEI, buscamos os dados do aluno e o laudo
        const alunoId = resPei.data.aluno;
        const resAluno = await axios.get(`http://localhost:8000/api/alunos/${alunoId}/`, config);
        setAluno(resAluno.data);

        // 4. Busca o laudo vinculado a esse aluno
        // No seu model, LaudoMedico é OneToOne com Aluno
        const resLaudo = await axios.get(`http://localhost:8000/api/laudos/`, config);
        // Filtramos no front para simplificar, ou você pode criar um endpoint no Django
        const laudoFiltrado = resLaudo.data.find((l: any) => l.aluno === alunoId);
        setLaudo(laudoFiltrado);

      } catch (error) {
        console.error("Erro ao carregar PEI:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) carregarDadosCompletos();
  }, [params.id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando Plano...</div>;
  if (!pei || !aluno) return <div className="min-h-screen flex items-center justify-center">Plano não encontrado.</div>;

  const iniciais = usuario.nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center pb-12">
      
      {/* Header Padronizado */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Link href="/home" className="text-2xl font-bold text-slate-800">🧠 SPECTRA</Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-slate-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
              {iniciais}
            </div>
            <span className="hidden md:block text-slate-700 font-medium">{usuario.nome}</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl px-4">
        <div className="bg-white w-full rounded-[32px] px-8 py-10 flex flex-col shadow-sm border border-slate-200">
          
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight text-center mb-8">
            Plano de Ensino Individualizado (PEI)
          </h1>

          {/* Perfil do Aluno vindo do Banco */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-4xl shrink-0">
              👤
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-2xl mb-2">{aluno.nome}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold uppercase">
                  {aluno.diagnostico || "Diagnóstico não informado"}
                </span>
                <span className="text-slate-500 text-sm ml-2">Matrícula: {aluno.matricula}</span>
              </div>
            </div>
          </div>

          {/* 1. Laudos Médicos (Vindo da tabela LaudoMedico) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-5">
            <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-indigo-600">1.</span> Laudos Médicos e Base
            </h3>
            {laudo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 w-fit">
                  📄 CID: {laudo.cid}
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  {laudo.diagnostico}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">Nenhum laudo médico detalhado vinculado a este aluno.</p>
            )}
          </div>

          {/* 2. Metas (Objetivos no Banco) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-5">
            <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-indigo-600">2.</span> Objetivos e Metas
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-700 text-sm whitespace-pre-wrap">
              {pei.objetivos}
            </div>
          </div>

          {/* 3. Metodologia (Estratégias no Banco) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
            <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-indigo-600">3.</span> Estratégias e Metodologia
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              {pei.metodologia}
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8">
            <button className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-4 rounded-xl transition-all flex justify-center items-center gap-2">
              Exportar para PDF
            </button>
            <button 
              onClick={() => router.back()}
              className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-4 rounded-xl transition-all"
            >
              Voltar
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}