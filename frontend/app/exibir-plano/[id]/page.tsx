"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2"; // Adicionado para notificações e logout

interface Plano {
  id: number;
  nome_plano?: string;
  objetivos?: string;
  metodologia?: string;
  protocolo_crise?: string[];
  estrategias_aprendizagem?: string;
  comunicacao: number;
  humor: number;
  social: number;
  motor: number;
  aluno?: number;
}

interface Aluno {
  id: number;
  nome: string;
}

export default function ExibirPlanoPage() {
  const { id } = useParams();
  const router = useRouter();

  const [plano, setPlano] = useState<Plano | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);

  const [usuario, setUsuario] = useState({
    nome: "Carregando...",
    cargo: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPlano = async () => {
      const token =
        localStorage.getItem("spectra_token") ||
        localStorage.getItem("access_token");

      if (!token) {
        router.push("/");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        // Busca usuário
        axios
          .get("http://localhost:8000/api/me/", config)
          .then((res) =>
            setUsuario({
              nome: res.data.nome || res.data.username || "Professor",
              cargo: res.data.cargo || "Docente",
            })
          )
          .catch(() =>
            setUsuario({
              nome: "Professor",
              cargo: "Docente",
            })
          );

        // Busca PEI
        const resPei = await axios.get(
          `http://localhost:8000/api/peis/${id}/`,
          config
        );

        setPlano(resPei.data);

        // Busca aluno
        if (resPei.data.aluno || resPei.data.aluno_id) {
          const alunoId = resPei.data.aluno || resPei.data.aluno_id;

          const resAluno = await axios.get(
            `http://localhost:8000/api/alunos/${alunoId}/`,
            config
          );

          setAluno(resAluno.data);
        }
      } catch (err) {
        console.error("Erro ao carregar o plano:", err);

        // Modal de Erro com SweetAlert2 em vez de alert()
        Swal.fire({
          title: 'Ops! Plano não encontrado.',
          text: 'Não foi possível carregar este plano. Ele pode ter sido excluído ou você não tem permissão.',
          icon: 'error',
          confirmButtonColor: '#2563eb', 
          confirmButtonText: 'Entendido',
          borderRadius: '24px'
        });

        router.push("/planos-ativos");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarPlano();
    }
  }, [id, router]);

  // IMPRIMIR PDF
  const handlePrint = () => {
    window.print();
  };

  // Função Sair padronizada
  const handleLogout = () => {
    Swal.fire({
      title: 'Sair do Sistema?',
      text: "Tem certeza de que deseja encerrar a sua sessão no SPECTRA?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', 
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      borderRadius: '24px'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("spectra_token");
        localStorage.removeItem("refresh_token");
        router.push("/");
      }
    });
  };

  const iniciais = usuario.nome
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#2563eb] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Carregando Prontuário...
        </p>
      </div>
    );
  }

  if (!plano) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col items-center antialiased selection:bg-blue-100">
      
      {/* HEADER PROFISSIONAL SAAS */}
      <header className="w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 mb-8 print:hidden">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center h-20">
          
          <div className="flex items-center gap-6">
            <Link href="/home" className="flex items-center gap-2 group">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-950 tracking-tighter transition-all duration-300 group-hover:from-[#2563eb] group-hover:to-blue-500">
                🧠 SPECTRA
              </span>
            </Link>
            
            <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
            
            <button 
              onClick={() => router.push('/planos-ativos')} 
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-[#2563eb] transition-colors group"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Planos Ativos</span>
            </button>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block border-r border-slate-200 pr-5">
              <p className="text-sm font-extrabold text-slate-900 leading-none">{usuario.nome}</p>
              <p className="text-[10px] font-black text-[#2563eb] uppercase mt-1 tracking-widest">{usuario.cargo}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200 ring-2 ring-white">
                {iniciais}
              </div>
              
              <button 
                onClick={handleLogout}
                className="group p-2.5 bg-white hover:bg-red-50 text-slate-400 rounded-xl transition-all border border-slate-200 shadow-sm hover:border-red-200 hover:text-red-500"
                title="Sair do Sistema"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full max-w-4xl px-4 pb-16">
        
        <div className="bg-white rounded-[32px] px-8 md:px-12 py-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 relative print-container">
          
          {/* VOLTAR (MOBILE) */}
          <button
            onClick={() => router.push("/planos-ativos")}
            className="sm:hidden absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-[#2563eb] transition-colors group print:hidden"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Voltar</span>
          </button>

          {/* TÍTULO OFICIAL */}
          <div className="flex flex-col items-center mb-12 mt-6 sm:mt-0 text-center">
            <span className="bg-blue-50 text-[#2563eb] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
              Visualização de Plano do Aluno
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Plano Educacional Individualizado
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Documento Confidencial de Acompanhamento Escolar
            </p>
          </div>

          {/* ALUNO HEADER */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-[28px] p-8 border border-slate-200 mb-12 flex items-center gap-6 shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-4xl shadow-sm shrink-0">
              {(aluno?.id || 1) % 2 === 0 ? "👧🏼" : "👦🏻"}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {aluno?.nome || "Aluno não identificado"}
              </h2>
              <p className="text-[#2563eb] font-bold text-xs mt-2 uppercase tracking-widest">
                {plano.nome_plano || "Plano sem título"}
              </p>
            </div>
          </div>

          {/* MÉTRICAS */}
          <div className="mb-12">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              📊 Indicadores de Evolução
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[28px] border border-slate-100">
              {[
                { key: "comunicacao", label: "Comunicação e Expressão" },
                { key: "social", label: "Socialização" },
                { key: "humor", label: "Autorregulação / Humor" },
                { key: "motor", label: "Desenvolvimento Motor" },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-2.5 tracking-wider px-1">
                    <span>{item.label}</span>
                    <span className="text-slate-800 font-black text-sm">
                      {(plano as any)[item.key] || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#2563eb] to-blue-400 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(plano as any)[item.key] || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTEÚDO TEXTUAL: OBJETIVOS E METODOLOGIA */}
          <div className="space-y-12">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                🎯 Objetivos Estratégicos
              </h3>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {plano.objetivos || "Nenhum objetivo cadastrado para este plano."}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                🛠️ Metodologia Aplicada
              </h3>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {plano.metodologia || "Nenhuma metodologia descrita."}
              </div>
            </div>

            {/* PROTOCOLO */}
            <div>
              <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-red-50 pb-3">
                🚨 Protocolo de Manejo de Crise
              </h3>

              {plano.protocolo_crise && plano.protocolo_crise.length > 0 ? (
                <div className="space-y-3 p-6 md:p-8 bg-red-50/30 rounded-[28px] border border-red-100">
                  {plano.protocolo_crise.map((passo, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-red-100 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-800 font-semibold leading-relaxed pt-1">
                        {passo}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-400 font-medium italic text-center">
                  Nenhum passo de manejo de crise cadastrado.
                </div>
              )}
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 max-w-sm px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-slate-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Imprimir / PDF
            </button>

            <button
              onClick={() => router.push("/planos-ativos")}
              className="flex-1 max-w-sm px-8 py-4 bg-[#2563eb] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Concluir Leitura
            </button>
          </div>
        </div>
      </main>

      {/* ESTILOS DE IMPRESSÃO */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .print-container {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }

          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>
    </div>
  );
}