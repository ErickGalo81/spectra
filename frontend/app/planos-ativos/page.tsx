"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

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
}

interface Aluno {
  id: number;
  nome: string; 
  matricula: string;
  diagnostico?: string;
  peis?: Plano[]; 
}

export default function PlanosAtivosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const carregarTudo = async () => {
      const token = localStorage.getItem('spectra_token') || localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [resUser, resAlunos, resPeis] = await Promise.all([
          axios.get('http://localhost:8000/api/me/', config).catch(() => ({ data: { nome: "Professor", cargo: "Docente" } })),
          axios.get('http://localhost:8000/api/alunos/', config),
          axios.get('http://localhost:8000/api/peis/', config).catch(() => ({ data: [] }))
        ]);

        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username || "Professor", 
          cargo: resUser.data.cargo || "Docente" 
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
      } catch (err) {
        console.error("Erro na integração:", err);
      } finally {
        setLoading(false);
      }
    };
    carregarTudo();
  }, [router]);

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

  const alunosComPlano = alunos.filter(a => a.peis && a.peis.length > 0);
  const alunosExibidos = alunosComPlano.filter(a => a.nome?.toLowerCase().includes(busca.toLowerCase()));

  const iniciais = usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 antialiased selection:bg-blue-100 pb-16">
      
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
            <Link href="/home" className="text-slate-500 hover:text-slate-800 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Painel</Link>
            <Link href="/planos-ativos" className="text-[#2563eb] bg-white px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm border border-slate-100 transition-all">Planos</Link>
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

      <main className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[32px] px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 relative">
          
          <button 
            onClick={() => router.push('/home')} 
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-[#2563eb] transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest">Painel</span>
          </button>

          <div className="flex flex-col items-center mb-10 mt-6 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Planos Educacionais Ativos
            </h1>
            <p className="text-slate-500 font-medium text-sm">Acompanhamento de Prontuários e Intervenções em Tempo Real</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-slate-50/50 p-4 rounded-[24px] border border-slate-100">
            <div className="relative w-full md:w-2/3">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Pesquisar por nome do aluno..." 
                value={busca} 
                onChange={(e) => setBusca(e.target.value)} 
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium shadow-sm placeholder-slate-400" 
              />
            </div>
            
            {/* 👇 LINK CORRIGIDO PARA /planos 👇 */}
            <Link 
              href="/planos" 
              className="w-full md:w-auto px-8 py-3.5 bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-all font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 text-center flex items-center justify-center gap-2 group"
            >
              <span className="text-lg font-light group-hover:rotate-90 transition-transform">+</span> 
              Novo Plano
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2563eb] rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sincronizando Banco de Dados...</p>
            </div>
          ) : alunosExibidos.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">Nenhum plano ativo encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {alunosExibidos.map((aluno) => {
                const planoAtivo = aluno.peis && aluno.peis.length > 0 ? aluno.peis[aluno.peis.length - 1] : null;

                return (
                  <div key={aluno.id} className="rounded-[28px] p-7 border transition-all duration-300 flex flex-col relative bg-white border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-50 hover:border-[#2563eb]/30 group hover:-translate-y-1">
                    
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-sm group-hover:bg-blue-50 group-hover:scale-105 transition-all duration-300">
                        {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h2 className="text-slate-900 font-black text-xl tracking-tight leading-tight line-clamp-1">{aluno.nome}</h2>
                          <span className="px-2.5 py-1 bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-black uppercase rounded-lg tracking-widest shadow-sm shrink-0">
                            Ativo
                          </span>
                        </div>
                        <p className="text-[#2563eb] text-[10px] font-bold uppercase tracking-widest mt-1.5 truncate">
                          {planoAtivo?.nome_plano || "Plano s/ título"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                      {[
                        { key: 'comunicacao', label: 'Comunicação' },
                        { key: 'social', label: 'Socialização' },
                        { key: 'humor', label: 'Humor' },
                        { key: 'motor', label: 'Motor' },
                      ].map(item => (
                        <div key={item.key}>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider px-1">
                            <span>{item.label}</span>
                            <span className="text-slate-800 font-black">{(planoAtivo as any)?.[item.key] || 0}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-[#2563eb] transition-all duration-1000 group-hover:bg-gradient-to-r group-hover:from-[#2563eb] group-hover:to-blue-400" 
                              style={{ width: `${(planoAtivo as any)?.[item.key] || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <Link 
                        href={`/exibir-plano/${planoAtivo?.id}`} 
                        className="flex-1 text-center py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:border-[#2563eb] hover:text-[#2563eb] transition-all shadow-sm"
                      >
                        Visualizar PEI
                      </Link>
                      
                      <Link 
                        href={`/ajustar-plano/${planoAtivo?.id}`} 
                        className="flex-1 text-center py-3.5 bg-[#2563eb] text-white rounded-xl font-bold text-xs hover:bg-[#1d4ed8] transition-all shadow-md shadow-blue-500/20 active:scale-95"
                      >
                        Ajustar Plano
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}