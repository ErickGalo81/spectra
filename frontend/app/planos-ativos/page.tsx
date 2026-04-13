'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

// Interface ajustada para o campo 'nome' do seu models.py
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
}

export default function PlanosAtivosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  // Estados para gerenciar a edição (CRUD - Update)
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdicao, setFormEdicao] = useState<Partial<Aluno>>({});

  // 1. READ: Buscar alunos reais assim que a página carrega
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

  // 2. DELETE: Função para excluir o aluno do banco
  const handleExcluir = async (id: number, nomeAluno: string) => {
    if (!window.confirm(`Deseja excluir permanentemente o plano de ${nomeAluno}?`)) return;

    try {
      const token = localStorage.getItem('spectra_token');
      await axios.delete(`http://localhost:8000/api/alunos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove da lista na tela instantaneamente (Reatividade)
      setAlunos(alunos.filter(a => a.id !== id));
    } catch (err) {
      alert("Erro ao excluir o registro.");
    }
  };

  // 3. UPDATE: Salvar alterações feitas no card
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

  // Lógica da Barra de Pesquisa (Filtro em tempo real) com trava de segurança (?.)
  const alunosFiltrados = alunos.filter(a => 
    a.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Cabeçalho (Header) Padronizado */}
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
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border text-slate-600 font-medium">PM</div>
              <span className="hidden md:block text-slate-700 font-medium text-base">Prof. Marcos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white w-full rounded-[32px] px-8 py-10 flex flex-col shadow-sm border border-slate-200">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Planos Ativos</h1>
            <Link 
              href="/planos" 
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm shadow-sm"
            >
              <span className="text-lg leading-none">+</span> Criar Novo Plano
            </Link>
          </div>

          {/* Barra de Pesquisa Reativa */}
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
                <div key={aluno.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col relative group">
                  
                  {/* Botão de Excluir */}
                  <button 
                    onClick={() => handleExcluir(aluno.id, aluno.nome)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                    title="Excluir Aluno"
                  >
                    🗑️
                  </button>

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                        {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
                      </div>
                      <div>
                        {editandoId === aluno.id ? (
                          <input 
                            className="font-semibold text-xl text-slate-800 border-b border-indigo-400 bg-transparent outline-none"
                            value={formEdicao.nome}
                            onChange={(e) => setFormEdicao({...formEdicao, nome: e.target.value})}
                          />
                        ) : (
                          <h2 className="text-slate-800 font-semibold text-xl">{aluno.nome}</h2>
                        )}
                        <p className="text-slate-500 text-sm font-medium">{aluno.idade || '0'} anos</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Ativo</span>
                  </div>
                  
                  <div className="space-y-1.5 mb-6 border-b border-slate-200 pb-4">
                    <p className="text-slate-500 text-sm">
                      <strong className="text-slate-700">Diagnóstico:</strong> {editandoId === aluno.id ? (
                        <input className="border rounded px-1 ml-1" value={formEdicao.diagnostico} onChange={e => setFormEdicao({...formEdicao, diagnostico: e.target.value})}/>
                      ) : (aluno.diagnostico || 'Autismo, TDAH')}
                    </p>
                    <p className="text-slate-500 text-sm">
                      <strong className="text-slate-700">Escolaridade:</strong> {editandoId === aluno.id ? (
                        <input className="border rounded px-1 ml-1" value={formEdicao.escolaridade} onChange={e => setFormEdicao({...formEdicao, escolaridade: e.target.value})}/>
                      ) : (aluno.escolaridade || 'Ensino Fundamental I')}
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
                          <span>{item.label}</span><span>{item.val || '50'}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.col} transition-all duration-500`} style={{width: `${item.val || 50}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ações do Card */}
                  <div className="flex gap-3 mt-auto">
                    {editandoId === aluno.id ? (
                      <>
                        <button onClick={() => handleSalvarEdicao(aluno.id)} className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-all">Salvar</button>
                        <button onClick={() => setEditandoId(null)} className="flex-1 py-2.5 bg-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-400 transition-all">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <Link href={`/aluno/${aluno.id}`} className="flex-1 text-center py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-all shadow-sm">
                          Exibir Plano
                        </Link>
                        <button 
                          onClick={() => {setEditandoId(aluno.id); setFormEdicao(aluno);}} 
                          className="flex-1 text-center py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-all shadow-sm"
                        >
                          Ajustar Plano
                        </button>
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