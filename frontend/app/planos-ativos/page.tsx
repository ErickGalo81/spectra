'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

// Interface atualizada com a lógica de manejo vinda do Django
interface Aluno {
  id: number;
  nome: string; 
  idade: number | null;
  matricula: string;
  diagnostico?: string;
  escolaridade?: string;
  comunicacao: number;
  humor: number;
  social: number;
  motor: number;
  // Campo novo que criamos no Serializer do Django
  sugestao_manejo?: {
    tipo: string;
    gatilhos: string;
    acao_crise: string;
  };
}

export default function PlanosAtivosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  // Estados para gerenciar a edição e o NOVO Modal de SOS
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdicao, setFormEdicao] = useState<Partial<Aluno>>({});
  const [protocoloAberto, setProtocoloAberto] = useState<Aluno | null>(null);

  // 1. READ: Buscar alunos reais
  useEffect(() => {
    const buscarAlunos = async () => {
      const token = localStorage.getItem('spectra_token');
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const resposta = await axios.get('http://localhost:8000/api/alunos/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlunos(resposta.data);
      } catch (err) {
        console.error("Erro ao carregar alunos:", err);
      } finally {
        setLoading(false);
      }
    };
    buscarAlunos();
  }, [router]);

  // 2. DELETE: Excluir aluno
  const handleExcluir = async (id: number, nomeAluno: string) => {
    if (!window.confirm(`Deseja excluir permanentemente o plano de ${nomeAluno}?`)) return;

    try {
      const token = localStorage.getItem('spectra_token');
      await axios.delete(`http://localhost:8000/api/alunos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlunos(alunos.filter(a => a.id !== id));
    } catch (err) {
      alert("Erro ao excluir o registro.");
    }
  };

  // 3. UPDATE: Salvar alterações
  const handleSalvarEdicao = async (id: number) => {
    try {
      const token = localStorage.getItem('spectra_token');
      await axios.patch(`http://localhost:8000/api/alunos/${id}/`, formEdicao, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlunos(alunos.map(a => (a.id === id ? { ...a, ...formEdicao } : a)));
      setEditandoId(null);
    } catch (err) {
      alert("Erro ao atualizar os dados.");
    }
  };

  // Filtro de Busca
  const alunosFiltrados = alunos.filter(a => 
    a.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Cabeçalho */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/home" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
                  🧠 SPECTRA
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/home" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium transition-all">Início</Link>
              <Link href="/cadastrar-aluno" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium transition-all">Cadastrar</Link>
              <Link href="/planos-ativos" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md font-medium transition-all">Planos</Link>
              <Link href="/sobre" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium transition-all">Sobre</Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border text-slate-600 font-medium italic">PM</div>
              <span className="hidden md:block text-slate-700 font-medium text-base">Prof. Marcos</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white w-full rounded-[32px] px-8 py-10 flex flex-col shadow-sm border border-slate-200">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Planos Ativos</h1>
            <Link href="/planos" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm shadow-sm">
              <span className="text-lg leading-none">+</span> Criar Novo Plano
            </Link>
          </div>

          <div className="mb-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3 focus-within:border-indigo-500 focus-within:ring-1 transition-all max-w-md shadow-sm">
            <span className="text-slate-400 text-lg mr-3">🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisar aluno pelo nome..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" 
            />
          </div>

          {loading ? (
            <p className="text-center text-slate-500 py-10">Conectando ao banco de dados...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {alunosFiltrados.map((aluno) => (
                <div key={aluno.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col relative group overflow-hidden">
                  
                  {/* Botão de Excluir */}
                  <button onClick={() => handleExcluir(aluno.id, aluno.nome)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors" title="Excluir Aluno">🗑️</button>

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                        {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
                      </div>
                      <div>
                        {editandoId === aluno.id ? (
                          <input className="font-semibold text-xl text-slate-800 border-b border-indigo-400 bg-transparent outline-none" value={formEdicao.nome} onChange={(e) => setFormEdicao({...formEdicao, nome: e.target.value})} />
                        ) : (
                          <h2 className="text-slate-800 font-semibold text-xl">{aluno.nome}</h2>
                        )}
                        <p className="text-slate-500 text-sm font-medium">{aluno.idade || '0'} anos</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Ativo</span>
                  </div>
                  
                  {/* Botão SOS de Protocolo de Crise */}
                  <button 
                    onClick={() => setProtocoloAberto(aluno)}
                    className="w-full mb-4 py-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-black rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2 tracking-widest uppercase"
                  >
                    🚨 SOS: Protocolo de Crise
                  </button>

                  <div className="space-y-1.5 mb-6 border-b border-slate-200 pb-4">
                    <p className="text-slate-500 text-sm">
                      <strong className="text-slate-700">Diagnóstico:</strong> {editandoId === aluno.id ? (
                        <input className="border rounded px-1 ml-1" value={formEdicao.diagnostico} onChange={e => setFormEdicao({...formEdicao, diagnostico: e.target.value})}/>
                      ) : (aluno.diagnostico || 'Não informado')}
                    </p>
                  </div>

                  {/* Barras de Progresso */}
                  <div className="space-y-4 mb-8 flex-grow">
                    {[
                      {label: 'Comunicação', val: aluno.comunicacao, col: 'bg-indigo-500'},
                      {label: 'Humor', val: aluno.humor, col: 'bg-teal-400'},
                      {label: 'Social', val: aluno.social, col: 'bg-violet-400'},
                      {label: 'Motor', val: aluno.motor, col: 'bg-amber-400'},
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                          <span>{item.label}</span><span>{item.val}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.col} transition-all duration-500`} style={{width: `${item.val}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    {editandoId === aluno.id ? (
                      <>
                        <button onClick={() => handleSalvarEdicao(aluno.id)} className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700">Salvar</button>
                        <button onClick={() => setEditandoId(null)} className="flex-1 py-2.5 bg-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-400">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <Link href={`/aluno/${aluno.id}`} className="flex-1 text-center py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-all shadow-sm">Exibir Plano</Link>
                        <button onClick={() => {setEditandoId(aluno.id); setFormEdicao(aluno);}} className="flex-1 text-center py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-all shadow-sm">Ajustar Plano</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE PROTOCOLO DE CRISE (SOS) */}
      {protocoloAberto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-red-100 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-600 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-xl tracking-tight leading-tight">Plano de Crise</h3>
                  <p className="text-red-100 text-[10px] uppercase tracking-widest font-black mt-1">
                    Foco: {protocoloAberto.nome}
                  </p>
                </div>
              </div>
              <button onClick={() => setProtocoloAberto(null)} className="bg-white/20 hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all">&times;</button>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> Gatilhos Sugeridos
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                  "{protocoloAberto.sugestao_manejo?.gatilhos}"
                </p>
              </div>

              <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                <h4 className="text-emerald-700 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span> Ações de Manejo
                </h4>
                <p className="text-slate-800 text-sm leading-relaxed font-bold">
                  {protocoloAberto.sugestao_manejo?.acao_crise}
                </p>
              </div>

              <button 
                onClick={() => setProtocoloAberto(null)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                ENTENDI, VOU AGIR AGORA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}