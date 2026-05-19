"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

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

        alert(
          "Não foi possível carregar este plano. Ele pode ter sido excluído ou você não tem permissão."
        );

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

  const iniciais = usuario.nome
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#5d5fef] rounded-full animate-spin mb-4"></div>

        <p className="text-slate-500 font-bold uppercase tracking-tighter">
          Carregando Prontuário...
        </p>
      </div>
    );
  }

  if (!plano) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* HEADER */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tighter">
              🧠 SPECTRA
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5d5fef] flex items-center justify-center text-white font-bold shadow-md">
              {iniciais}
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-slate-900 font-bold text-sm leading-none">
                {usuario.nome}
              </span>

              <span className="text-[#5d5fef] text-[10px] font-black uppercase mt-1 tracking-wider">
                {usuario.cargo}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full max-w-4xl px-4 pb-12">
        
        <div className="bg-white rounded-[40px] px-8 md:px-12 py-10 shadow-sm border border-slate-200 relative print-container">
          
          {/* VOLTAR */}
          <button
            onClick={() => router.push("/planos-ativos")}
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-[#5d5fef] transition-colors group print:hidden"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">
              ←
            </span>

            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              Voltar
            </span>
          </button>

          {/* TÍTULO */}
          <div className="flex flex-col items-center mb-12 mt-6 text-center">
            
            <span className="bg-indigo-50 text-[#5d5fef] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              Visualização de Prontuário
            </span>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Plano Educacional Individualizado
            </h1>

            <p className="text-slate-500 font-medium text-sm">
              Documento Confidencial de Acompanhamento
            </p>
          </div>

          {/* ALUNO */}
          <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 mb-10 flex items-center gap-6">
            
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-4xl shadow-sm shrink-0">
              {(aluno?.id || 1) % 2 === 0 ? "👧🏼" : "👦🏻"}
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {aluno?.nome || "Aluno não identificado"}
              </h2>

              <p className="text-[#5d5fef] font-bold text-sm mt-1 uppercase tracking-wider">
                {plano.nome_plano || "Plano sem título"}
              </p>
            </div>
          </div>

          {/* MÉTRICAS */}
          <div className="mb-12">
            
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              📊 Métricas de Desenvolvimento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-inner">
              
              {[
                { key: "comunicacao", label: "Comunicação" },
                { key: "social", label: "Socialização" },
                { key: "humor", label: "Humor" },
                { key: "motor", label: "Motor" },
              ].map((item) => (
                
                <div key={item.key}>
                  
                  <div className="flex justify-between text-xs font-black text-slate-600 uppercase mb-3 tracking-wider">
                    <span>{item.label}</span>

                    <span className="text-[#5d5fef]">
                      {(plano as any)[item.key] || 0}%
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    
                    <div
                      className="h-full bg-gradient-to-r from-[#5d5fef] to-indigo-400 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(plano as any)[item.key] || 0}%`,
                      }}
                    ></div>

                  </div>
                </div>

              ))}
            </div>
          </div>

          {/* OBJETIVOS */}
          <div className="space-y-10">
            
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                🎯 Objetivos Estratégicos
              </h3>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {plano.objetivos ||
                  "Nenhum objetivo cadastrado para este plano."}
              </div>
            </div>

            {/* METODOLOGIA */}
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                🛠️ Metodologia Aplicada
              </h3>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {plano.metodologia ||
                  "Nenhuma metodologia descrita."}
              </div>
            </div>

            {/* PROTOCOLO */}
            <div>
              
              <h3 className="text-sm font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                🚨 Protocolo de Manejo de Crise
              </h3>

              {plano.protocolo_crise &&
              plano.protocolo_crise.length > 0 ? (

                <div className="space-y-3">
                  
                  {plano.protocolo_crise.map((passo, idx) => (
                    
                    <div
                      key={idx}
                      className="flex items-start gap-4 bg-red-50 p-5 rounded-2xl border border-red-100"
                    >
                      
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm mt-0.5">
                        {idx + 1}
                      </div>

                      <p className="text-red-900 font-medium leading-relaxed pt-1">
                        {passo}
                      </p>
                    </div>

                  ))}
                </div>

              ) : (

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-slate-500 font-medium italic">
                  Nenhum passo de manejo de crise cadastrado.
                </div>

              )}
            </div>
          </div>

          {/* BOTÕES */}
          <div className="mt-12 flex justify-center gap-4 print:hidden">
            
            <button
              onClick={handlePrint}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all hover:bg-slate-800"
            >
              🖨️ Imprimir / PDF
            </button>

            <button
              onClick={() => router.push("/planos-ativos")}
              className="px-10 py-4 bg-[#5d5fef] text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
            >
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