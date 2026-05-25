"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
// IMPORTANDO O SWEETALERT2
import Swal from "sweetalert2";

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  diagnostico: string;
  peis?: any[]; 
}

export default function HomePage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem("spectra_token");
      if (!token) {
        router.push("/");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [resUser, resAlunos, resPeis] = await Promise.all([
          axios.get("http://localhost:8000/api/me/", config),
          axios.get("http://localhost:8000/api/alunos/", config),
          axios.get("http://localhost:8000/api/peis/", config).catch(() => ({ data: [] }))
        ]);
        
        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          cargo: resUser.data.cargo || "Professor Responsável" 
        });

        const alunosComSeusPlanos = resAlunos.data.map((aluno: any) => {
          const planosDoAluno = resPeis.data
            .filter((p: any) => p.aluno === aluno.id || p.aluno_id === aluno.id)
            .sort((a: any, b: any) => a.id - b.id);

          return {
            ...aluno,
            peis: planosDoAluno
          };
        });

        setAlunos(alunosComSeusPlanos);
      } catch (error) {
        console.error("Erro na Home:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [router]);

  // 👇 FUNÇÃO DE LOGOUT ATUALIZADA COM O MODAL SWEETALERT2 👇
  const handleLogout = () => {
    Swal.fire({
      title: 'Sair do Sistema?',
      text: "Tem certeza de que deseja encerrar a sua sessão no SPECTRA?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', // Azul Royal
      cancelButtonColor: '#94a3b8',  // Cinza claro
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

  const iniciais = usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Cálculos para o Dashboard Bento Grid
  const alunosAtivos = alunos.filter(a => a.peis && a.peis.length > 0).length;
  const somaEvolucao = alunos.reduce((acc, aluno) => {
    const peiAtivo = aluno.peis && aluno.peis.length > 0 ? aluno.peis[aluno.peis.length - 1] : null;
    return peiAtivo ? acc + ((peiAtivo.comunicacao + peiAtivo.social + peiAtivo.humor + peiAtivo.motor) / 4) : acc;
  }, 0);
  const mediaGeralTurma = alunosAtivos > 0 ? (somaEvolucao / alunosAtivos).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 antialiased selection:bg-blue-100 pb-20">
      
      {/* HEADER ULTRA CLEAN */}
      <header className="w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="flex items-center gap-2 group">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-950 tracking-tighter transition-all duration-300 group-hover:from-[#2563eb] group-hover:to-blue-500">
                🧠 SPECTRA
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50 shadow-inner">
            <Link href="/home" className="text-[#2563eb] bg-white px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm border border-slate-100 transition-all">Painel</Link>
            <Link href="/planos-ativos" className="text-slate-500 hover:text-slate-800 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Planos</Link>
            <Link href="/sobre" className="text-slate-500 hover:text-slate-800 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Sobre</Link>
          </nav>

          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block border-r border-slate-200 pr-5">
              <p className="text-sm font-extrabold text-slate-900 leading-none">{usuario.nome}</p>
              <p className="text-[10px] font-black text-[#2563eb] uppercase mt-1 tracking-widest">{usuario.cargo}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200 ring-2 ring-white">
                {iniciais}
              </div>
              
              {/* BOTAO DE SAIR CHAMANDO O HANDLELOGOUT */}
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

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* BENTO GRID HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Main Welcome Card */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#2563eb 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                Olá, <span className="text-[#2563eb]">{usuario.nome.split(" ")[0]}</span>. <br />
                Bem Vindo(a).
              </h1>
              <p className="text-slate-500 font-medium text-sm md:text-base tracking-wide max-w-md mb-10">
                Acompanhe o desenvolvimento e a jornada educacional de todos os alunos sob sua responsabilidade em um só lugar.
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <Link 
                href="/cadastrar-aluno" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563eb] text-white rounded-2xl font-bold text-sm hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-500/25 active:scale-95 group"
              >
                <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                Cadastrar Novo Aluno
              </Link>
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="flex flex-col gap-6">
            
            {/* Stat Card 1: Evolution */}
            <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] rounded-[32px] p-8 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden flex-1 flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                 <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-2 relative z-10">Média de Evolução</p>
              <div className="flex items-end gap-2 relative z-10">
                <h2 className="text-6xl font-black tracking-tighter">{mediaGeralTurma}%</h2>
              </div>
              <p className="text-blue-200 text-xs font-medium mt-3 relative z-10">Baseado nos {alunosAtivos} planos ativos</p>
            </div>

            {/* Stat Card 2: Students */}
            <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 flex-1 flex items-center justify-between">
               <div>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total de Alunos</p>
                 <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{alunos.length}</h2>
               </div>
               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-2xl shadow-inner">
                 📚
               </div>
            </div>

          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#2563eb] rounded-sm"></span>
            Alunos Recentes
          </h2>
        </div>

        {/* ALUNOS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-slate-200/60 shadow-sm">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2563eb] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sincronizando banco de dados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alunos.map((aluno) => {
              const peiAtivo = aluno.peis && aluno.peis.length > 0 ? aluno.peis[aluno.peis.length - 1] : null;
              const evolucaoMedia = peiAtivo ? (peiAtivo.comunicacao + peiAtivo.social + peiAtivo.humor + peiAtivo.motor) / 4 : 0;

              return (
                <Link href={`/aluno/${aluno.id}`} key={aluno.id} className="group outline-none">
                  <div className="bg-white p-7 rounded-[28px] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-xl hover:shadow-blue-500/10 hover:border-[#2563eb]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                    
                    {/* Linha Topo */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Top Section */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 shadow-sm group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-300">
                          {aluno.id % 2 === 0 ? "👧🏼" : "👦🏻"}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 group-hover:text-[#2563eb] transition-colors tracking-tight line-clamp-1">{aluno.nome}</h3>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">MAT: {aluno.matricula}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className={`px-2.5 py-1 border ${peiAtivo ? 'bg-teal-50 border-teal-100 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-500'} text-[9px] font-black uppercase rounded-lg tracking-widest shadow-sm`}>
                        {peiAtivo ? 'Plano Vigente' : 'Pendente'}
                      </span>
                      <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase rounded-lg tracking-widest shadow-sm truncate max-w-[120px]">
                        {aluno.diagnostico || 'Geral'}
                      </span>
                    </div>

                    {/* Progress Section */}
                    <div className="mt-auto pt-5 border-t border-dashed border-slate-200">
                      <div className="flex justify-between items-end text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2.5">
                        <span>Índice de Evolução</span>
                        <span className="text-slate-700 text-sm leading-none font-black">{evolucaoMedia.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-[#2563eb] rounded-full transition-all duration-1000 ease-out relative group-hover:bg-gradient-to-r group-hover:from-[#2563eb] group-hover:to-blue-400" 
                          style={{ width: `${evolucaoMedia}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}