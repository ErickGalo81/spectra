"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
          // Ordena pelo ID para garantir que o último seja sempre o mais novo
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

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('spectra_token');
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const alunosComPlano = alunos.filter(a => a.peis && a.peis.length > 0);
  const alunosExibidos = alunosComPlano.filter(a => a.nome?.toLowerCase().includes(busca.toLowerCase()));

  const iniciais = usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Header com botão Sair */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tighter">
              🧠 SPECTRA
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5d5fef] flex items-center justify-center text-white font-bold shadow-md">{iniciais}</div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-slate-900 font-bold text-sm leading-none">{usuario.nome}</span>
              <span className="text-[#5d5fef] text-[10px] font-black uppercase mt-1 tracking-wider">{usuario.cargo}</span>
            </div>
            
            {/* Botão Sair */}
            <button 
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border border-transparent hover:border-red-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white rounded-[40px] px-8 py-10 shadow-sm border border-slate-200 relative">
          
          <button 
            onClick={() => router.push('/home')} 
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-[#5d5fef] transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Início</span>
          </button>

          <div className="flex flex-col items-center mb-10 mt-4 text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Planos Ativos
            </h1>
            <p className="text-slate-600 font-medium">Gestão de Prontuários e Intervenções em Tempo Real</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-center">
            <div className="relative w-full max-w-lg">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input type="text" placeholder="Pesquisar por nome do aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#5d5fef] transition-all text-slate-900 font-bold shadow-inner" />
            </div>
            <Link href="/planos" className="w-full md:w-auto px-10 py-4 bg-[#5d5fef] text-white rounded-2xl hover:brightness-110 transition-all font-black text-sm shadow-xl active:scale-95 text-center">
              + Novo Plano
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-[#5d5fef] rounded-full animate-spin"></div>
              <p className="text-slate-500 font-bold uppercase tracking-tighter">Sincronizando Banco...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {alunosExibidos.map((aluno) => {
                const planoAtivo = aluno.peis && aluno.peis.length > 0 ? aluno.peis[aluno.peis.length - 1] : null;

                return (
                  <div key={aluno.id} className="rounded-[32px] p-8 border transition-all duration-300 flex flex-col relative bg-slate-50 border-slate-200 hover:shadow-2xl hover:bg-white">
                    
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-3xl shadow-sm">
                        {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-slate-900 font-black text-xl tracking-tight leading-tight">{aluno.nome}</h2>
                        <p className="text-[#5d5fef] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                          {planoAtivo?.nome_plano || "Plano s/ título"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 bg-white p-6 rounded-[24px] border border-slate-100 shadow-inner">
                      {[
                        { key: 'comunicacao', label: 'Comunicação' },
                        { key: 'social', label: 'Socialização' },
                        { key: 'humor', label: 'Humor' },
                        { key: 'motor', label: 'Motor' },
                      ].map(item => (
                        <div key={item.key}>
                          <div className="flex justify-between text-[10px] font-black text-slate-800 uppercase mb-2 tracking-wider">
                            <span>{item.label}</span>
                            <span className="text-slate-900">{(planoAtivo as any)?.[item.key] || 0}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#5d5fef] transition-all duration-700" style={{ width: `${(planoAtivo as any)?.[item.key] || 0}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-auto pt-2">
                      <Link href={`/exibir-plano/${planoAtivo?.id}`} className="flex-1 text-center py-4 bg-white border-2 border-slate-300 text-slate-900 rounded-2xl font-black text-sm hover:border-[#5d5fef] hover:text-[#5d5fef] transition-all">
                        Ver PEI
                      </Link>
                      
                      <Link href={`/ajustar-plano/${planoAtivo?.id}`} className="flex-1 text-center py-4 bg-[#5d5fef] text-white rounded-2xl font-black text-sm hover:brightness-110 transition-all shadow-md">
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