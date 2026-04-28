"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Aluno {
  id: number;
  nome: string; 
  matricula: string;
  diagnostico?: string;
  comunicacao: number;
  humor: number;
  social: number;
  motor: number;
  sugestao_manejo?: {
    tipo: string;
    gatilhos: string;
    passos_crise: string[];
    aprendizagem: string[];
  };
}

export default function PlanosAtivosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdicao, setFormEdicao] = useState<Partial<Aluno>>({});

  useEffect(() => {
    const carregarTudo = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [resUser, resAlunos] = await Promise.all([
          axios.get('http://localhost:8000/api/me/', config),
          axios.get('http://localhost:8000/api/alunos/', config)
        ]);
        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          cargo: resUser.data.cargo || "Professor" 
        });
        setAlunos(resAlunos.data);
      } catch (err) {
        console.error("Erro na integração:", err);
      } finally {
        setLoading(false);
      }
    };
    carregarTudo();
  }, [router]);

  const handleSalvarEdicao = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`http://localhost:8000/api/alunos/${id}/`, formEdicao, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlunos(alunos.map(a => (a.id === id ? { ...a, ...formEdicao } : a)));
      setEditandoId(null);
    } catch (err) {
      alert("Erro ao atualizar os dados.");
    }
  };

  const alunosFiltrados = alunos.filter(a => a.nome?.toLowerCase().includes(busca.toLowerCase()));
  const iniciais = usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Header com a Logo Original Restaurada */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
              🧠 SPECTRA
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 shadow-sm">
              {iniciais}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-slate-700 font-bold text-sm leading-none">{usuario.nome}</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-wider">
                {usuario.cargo}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white rounded-[40px] px-8 py-10 shadow-sm border border-slate-200 relative">
          
          <button 
            onClick={() => router.push('/home')}
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest">Início</span>
          </button>

          <div className="flex flex-col items-center mb-10 mt-4">
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">Planos Ativos</h1>
            <p className="text-slate-500 text-sm font-medium">Gestão de Prontuários e Intervenções em Tempo Real</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-center">
            <div className="relative w-full max-w-lg">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Pesquisar por nome do aluno..." 
                value={busca} 
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700 font-medium shadow-inner" 
              />
            </div>
            <Link href="/planos" className="w-full md:w-auto px-8 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all font-bold text-sm shadow-xl active:scale-95">
              + Novo Plano
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold uppercase tracking-tighter">Sincronizando Banco...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {alunosFiltrados.map((aluno) => (
                <div key={aluno.id} className={`rounded-[32px] p-8 border transition-all duration-300 flex flex-col relative ${editandoId === aluno.id ? 'bg-indigo-50/30 border-indigo-200 ring-2 ring-indigo-100' : 'bg-slate-50 border-slate-100 hover:shadow-2xl hover:bg-white'}`}>
                  
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl shadow-sm">
                      {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
                    </div>
                    <div className="flex-1">
                      {editandoId === aluno.id ? (
                        <input 
                          className="w-full font-bold text-xl bg-white border-2 border-indigo-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500" 
                          value={formEdicao.nome} 
                          onChange={(e) => setFormEdicao({...formEdicao, nome: e.target.value})} 
                        />
                      ) : (
                        <h2 className="text-slate-800 font-bold text-xl tracking-tight">{aluno.nome}</h2>
                      )}
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Matrícula: {aluno.matricula}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 bg-white/50 p-4 rounded-2xl border border-slate-100">
                    {[
                      { key: 'comunicacao', label: 'Comunicação', val: aluno.comunicacao, col: 'bg-indigo-500' },
                      { key: 'social', label: 'Socialização', val: aluno.social, col: 'bg-teal-500' },
                      { key: 'humor', label: 'Humor', val: aluno.humor, col: 'bg-rose-500' },
                      { key: 'motor', label: 'Motor', val: aluno.motor, col: 'bg-amber-500' },
                    ].map(item => (
                      <div key={item.key}>
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-1.5">
                          <span>{item.label}</span>
                          <span className={editandoId === aluno.id ? "text-indigo-600" : ""}>
                            {editandoId === aluno.id ? (formEdicao[item.key as keyof Aluno] as number) : item.val}%
                          </span>
                        </div>
                        {editandoId === aluno.id ? (
                          <input 
                            type="range" min="0" max="100" 
                            value={formEdicao[item.key as keyof Aluno] as number}
                            onChange={(e) => setFormEdicao({...formEdicao, [item.key]: parseInt(e.target.value)})}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        ) : (
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full ${item.col} transition-all duration-700`} style={{ width: `${item.val}%` }}></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    {editandoId === aluno.id ? (
                      <>
                        <button onClick={() => handleSalvarEdicao(aluno.id)} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all">Confirmar Ajustes</button>
                        <button onClick={() => setEditandoId(null)} className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50">Sair</button>
                      </>
                    ) : (
                      <>
                        <Link href={`/aluno/${aluno.id}`} className="flex-1 text-center py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all">Ver PEI</Link>
                        <button onClick={() => { setEditandoId(aluno.id); setFormEdicao(aluno); }} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-slate-200">Ajustar Plano</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}