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

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdicao, setFormEdicao] = useState<any>({}); // Usando any para facilitar os campos dinâmicos do formulário

  useEffect(() => {
    const carregarTudo = async () => {
      const token = localStorage.getItem('spectra_token');
      if (!token) {
        router.push('/');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [resUser, resAlunos, resPeis] = await Promise.all([
          axios.get('http://localhost:8000/api/me/', config),
          axios.get('http://localhost:8000/api/alunos/', config),
          axios.get('http://localhost:8000/api/peis/', config).catch(() => ({ data: [] }))
        ]);

        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          cargo: resUser.data.cargo || "Professor" 
        });

        const alunosComSeusPlanos = resAlunos.data.map((aluno: any) => {
          const planosDoAluno = resPeis.data.filter((p: any) => p.aluno === aluno.id || p.aluno_id === aluno.id);
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

  const adicionarPasso = () => {
    const passosAtuais = formEdicao.protocolo_crise || [];
    setFormEdicao({ ...formEdicao, protocolo_crise: [...passosAtuais, ""] });
  };

  const atualizarPasso = (index: number, valor: string) => {
    const passos = [...(formEdicao.protocolo_crise || [])];
    passos[index] = valor;
    setFormEdicao({ ...formEdicao, protocolo_crise: passos });
  };

  const removerPasso = (index: number) => {
    const passos = (formEdicao.protocolo_crise || []).filter((_, i) => i !== index);
    setFormEdicao({ ...formEdicao, protocolo_crise: passos });
  };

  // ==========================================
  // SALVAR EDIÇÃO CORRIGIDO PARA O PEI
  // ==========================================
  const handleSalvarEdicao = async (alunoId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const alunoAtual = alunos.find(a => a.id === alunoId);
      const planoAtivo = alunoAtual?.peis && alunoAtual.peis.length > 0 ? alunoAtual.peis[0] : null;

      // Filtra os passos vazios para não salvar sujeira no banco
      const protocoloLimpo = (formEdicao.protocolo_crise || []).filter((p: string) => p.trim() !== "");

      const dadosPlano = {
        nome_plano: formEdicao.nome_plano,
        objetivos: formEdicao.objetivos,
        metodologia: formEdicao.metodologia,
        protocolo_crise: protocoloLimpo,
        comunicacao: formEdicao.comunicacao,
        humor: formEdicao.humor,
        social: formEdicao.social,
        motor: formEdicao.motor
      };

      // 1. Atualiza o Plano (PEI) no banco de dados
      if (planoAtivo && planoAtivo.id) {
        await axios.patch(`http://localhost:8000/api/peis/${planoAtivo.id}/`, dadosPlano, config);
      }

      // 2. Atualiza o Nome do Aluno no banco de dados (se tiver sido alterado)
      if (formEdicao.nome !== alunoAtual?.nome) {
        await axios.patch(`http://localhost:8000/api/alunos/${alunoId}/`, { nome: formEdicao.nome }, config);
      }

      // 3. Atualiza os dados instantaneamente na tela
      setAlunos(alunos.map(a => {
        if (a.id === alunoId) {
          const peisAtualizados = a.peis ? [...a.peis] : [];
          if (peisAtualizados.length > 0) {
            peisAtualizados[0] = { ...peisAtualizados[0], ...dadosPlano };
          }
          return { ...a, nome: formEdicao.nome || a.nome, peis: peisAtualizados };
        }
        return a;
      }));
      
      setEditandoId(null);
      alert("Plano atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar as alterações do plano.");
    }
  };

  const handleExcluirPlano = async (aluno: Aluno) => {
    if (confirm("Tem certeza que deseja excluir ESTE plano específico? Os outros planos do aluno não serão afetados.")) {
      try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (aluno.peis && aluno.peis.length > 0) {
          const planoAtivo = aluno.peis[0];
          await axios.delete(`http://localhost:8000/api/peis/${planoAtivo.id}/`, config);
          const peisRestantes = aluno.peis.filter(pei => pei.id !== planoAtivo.id);
          setAlunos(alunos.map(a => a.id === aluno.id ? { ...a, peis: peisRestantes } : a));
        }
        setEditandoId(null);
      } catch (err) {
        alert("Erro ao excluir o plano.");
        console.error(err);
      }
    }
  };

  // Filtra apenas alunos que possuem pelo menos 1 PEI
  const alunosComPlano = alunos.filter(a => a.peis && a.peis.length > 0);

  const alunosExibidos = editandoId 
    ? alunos.filter(a => a.id === editandoId) 
    : alunosComPlano.filter(a => a.nome?.toLowerCase().includes(busca.toLowerCase()));

  const iniciais = usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
              🧠 SPECTRA
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 shadow-sm">{iniciais}</div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-slate-700 font-bold text-sm leading-none">{usuario.nome}</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-wider">{usuario.cargo}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white rounded-[40px] px-8 py-10 shadow-sm border border-slate-200 relative">
          
          <button 
            onClick={() => editandoId ? setEditandoId(null) : router.push('/home')} 
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest">{editandoId ? "Voltar para Lista" : "Início"}</span>
          </button>

          <div className="flex flex-col items-center mb-10 mt-4">
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">
              {editandoId ? "Ajustando Plano" : "Planos Ativos"}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {editandoId ? "Personalize as diretrizes deste prontuário" : "Gestão de Prontuários e Intervenções em Tempo Real"}
            </p>
          </div>

          {!editandoId && (
            <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-center animate-in fade-in duration-500">
              <div className="relative w-full max-w-lg">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input type="text" placeholder="Pesquisar por nome do aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700 font-medium shadow-inner" />
              </div>
              <Link href="/planos" className="w-full md:w-auto px-8 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all font-bold text-sm shadow-xl active:scale-95">
                + Novo Plano
              </Link>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold uppercase tracking-tighter">Sincronizando Banco...</p>
            </div>
          ) : (
            alunosExibidos.length === 0 && !editandoId ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <span className="text-4xl mb-4">📭</span>
                <h3 className="text-lg font-bold text-slate-700">Nenhum plano ativo encontrado.</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-sm text-center mb-6">
                  Você ainda não possui planos detalhados ou a sua busca não encontrou resultados.
                </p>
                <Link href="/planos" className="px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-md transition-colors">
                  Criar Primeiro Plano
                </Link>
              </div>
            ) : (
              <div className={`${editandoId ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 gap-8'}`}>
                {alunosExibidos.map((aluno) => {
                  const planoAtivo = aluno.peis && aluno.peis.length > 0 ? aluno.peis[0] : null;

                  return (
                    <div key={aluno.id} className={`rounded-[32px] p-8 border transition-all duration-300 flex flex-col relative ${editandoId === aluno.id ? 'bg-white border-indigo-200 ring-4 ring-indigo-50 w-full max-w-2xl' : 'bg-slate-50 border-slate-100 hover:shadow-2xl hover:bg-white'}`}>
                      
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl shadow-sm">
                          {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
                        </div>
                        <div className="flex-1">
                          {editandoId === aluno.id ? (
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-indigo-400 uppercase">Nome do Aluno</label>
                              <input className="w-full font-bold text-lg bg-slate-50 border-2 border-indigo-100 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:bg-white" value={formEdicao.nome} onChange={(e) => setFormEdicao({...formEdicao, nome: e.target.value})} />
                              
                              <label className="text-[9px] font-black text-indigo-400 uppercase block mt-2">Título do Plano</label>
                              <input className="w-full font-medium text-sm bg-slate-50 border-2 border-indigo-100 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:bg-white" placeholder="Ex: Plano Semestral" value={formEdicao.nome_plano} onChange={(e) => setFormEdicao({...formEdicao, nome_plano: e.target.value})} />
                            </div>
                          ) : (
                            <>
                              <h2 className="text-slate-800 font-bold text-xl tracking-tight">{aluno.nome}</h2>
                              <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
                                {planoAtivo?.nome_plano || "Plano s/ título"}
                              </p>
                            </>
                          )}
                        </div>
                        
                        {editandoId === aluno.id && (
                          <button 
                            onClick={() => handleExcluirPlano(aluno)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            title="Excluir Plano"
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      <div className="space-y-4 mb-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        {[
                          { key: 'comunicacao', label: 'Comunicação', val: planoAtivo?.comunicacao ?? 50, col: 'bg-indigo-500' },
                          { key: 'social', label: 'Socialização', val: planoAtivo?.social ?? 50, col: 'bg-teal-500' },
                          { key: 'humor', label: 'Humor', val: planoAtivo?.humor ?? 50, col: 'bg-rose-500' },
                          { key: 'motor', label: 'Motor', val: planoAtivo?.motor ?? 50, col: 'bg-amber-500' },
                        ].map(item => (
                          <div key={item.key}>
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-1.5">
                              <span>{item.label}</span>
                              <span className={editandoId === aluno.id ? "text-indigo-600" : ""}>
                                {editandoId === aluno.id ? (formEdicao[item.key] as number) : item.val}%
                              </span>
                            </div>
                            {editandoId === aluno.id ? (
                              <input type="range" min="0" max="100" value={formEdicao[item.key]} onChange={(e) => setFormEdicao({...formEdicao, [item.key]: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                            ) : (
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full ${item.col} transition-all duration-700`} style={{ width: `${item.val}%` }}></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {editandoId === aluno.id && (
                        <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">🎯 Objetivos Estratégicos</label>
                            <textarea className="w-full text-sm p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 focus:bg-white min-h-[100px] resize-none" value={formEdicao.objetivos || ""} onChange={(e) => setFormEdicao({...formEdicao, objetivos: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">🛠️ Metodologia Aplicada</label>
                            <textarea className="w-full text-sm p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 focus:bg-white min-h-[100px] resize-none" value={formEdicao.metodologia || ""} onChange={(e) => setFormEdicao({...formEdicao, metodologia: e.target.value})} />
                          </div>

                          <div className="pt-6 border-t border-slate-100">
                            <label className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-4">🚨 Protocolo de Manejo de Crise</label>
                            <div className="space-y-3">
                              {(formEdicao.protocolo_crise || []).map((passo: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">{idx + 1}</div>
                                  <input className="flex-1 text-sm p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-red-400 shadow-sm" value={passo} onChange={(e) => atualizarPasso(idx, e.target.value)} />
                                  <button onClick={() => removerPasso(idx)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                                </div>
                              ))}
                              <button type="button" onClick={adicionarPasso} className="w-full py-4 border-2 border-dashed border-red-100 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-tighter hover:bg-red-50 hover:border-red-200 transition-all">
                                + Adicionar Passo ao Protocolo
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 mt-auto">
                        {editandoId === aluno.id ? (
                          <>
                            <button onClick={() => setEditandoId(null)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50">Cancelar</button>
                            <button onClick={() => handleSalvarEdicao(aluno.id)} className="flex-[2] py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">Salvar Alterações</button>
                          </>
                        ) : (
                          <>
                            <Link href={`/aluno/${aluno.id}`} className="flex-1 text-center py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all">Ver PEI</Link>
                            
                            {/* A MÁGICA ACONTECE AQUI: Preenche o form com os dados do PEI */}
                            <button 
                              onClick={() => { 
                                setEditandoId(aluno.id); 
                                setFormEdicao({
                                  nome: aluno.nome,
                                  nome_plano: planoAtivo?.nome_plano || "",
                                  objetivos: planoAtivo?.objetivos || "",
                                  metodologia: planoAtivo?.metodologia || "",
                                  protocolo_crise: planoAtivo?.protocolo_crise || [],
                                  comunicacao: planoAtivo?.comunicacao ?? 50,
                                  humor: planoAtivo?.humor ?? 50,
                                  social: planoAtivo?.social ?? 50,
                                  motor: planoAtivo?.motor ?? 50
                                });
                              }} 
                              className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
                            >
                              Ajustar Plano
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}