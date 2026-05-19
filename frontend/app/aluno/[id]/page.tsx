"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface AlunoCompleto {
  id: number;
  nome: string;
  diagnostico: string;
  peis?: any[];
}

export default function ExibirPlanoPage() {
  const router = useRouter(); 
  const { id } = useParams();
  const [aluno, setAluno] = useState<AlunoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NOVO: Estado para controlar qual plano o usuário clicou para ver
  const [planoVisualizadoId, setPlanoVisualizadoId] = useState<number | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      const token = localStorage.getItem('spectra_token');
      try {
        const res = await axios.get(`http://localhost:8000/api/alunos/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAluno(res.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (id) buscarDados();
  }, [id]);

  const handleExcluirAluno = async () => {
    if (confirm(`⚠️ Tem certeza de que deseja excluir ${aluno?.nome} permanentemente? Todos os planos e prontuários vinculados serão perdidos!`)) {
      try {
        const token = localStorage.getItem('spectra_token');
        await axios.delete(`http://localhost:8000/api/alunos/${id}/`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        alert("Aluno excluído com sucesso.");
        router.push("/home");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o aluno.");
      }
    }
  };

  const handleSair = () => {
    localStorage.removeItem('spectra_token');
    router.push('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Sincronizando Plano...</div>;
  if (!aluno) return <div className="min-h-screen flex items-center justify-center text-red-500">Aluno não encontrado.</div>;

  const todosPlanos = aluno.peis || [];
  const planosOrdenados = [...todosPlanos].sort((a, b) => a.id - b.id);
  const peiAtivo = planosOrdenados.length > 0 ? planosOrdenados[planosOrdenados.length - 1] : null; 

  // LÓGICA NOVA: Define qual plano será renderizado na tela
  // Se o usuário clicou em algum no histórico, exibe ele. Se não, exibe o ativo.
  const peiExibido = planoVisualizadoId 
    ? planosOrdenados.find(p => p.id === planoVisualizadoId) 
    : peiAtivo;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-12 font-sans">
      
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8 no-print">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-20">
          
          <button 
            onClick={() => router.push('/home')} 
            className="flex items-center gap-2 text-slate-400 hover:text-[#5d5fef] transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-[#5d5fef]">Home</span>
          </button>
          
          <button 
            onClick={handleSair}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-[11px] font-black uppercase tracking-wider shadow-sm"
          >
            Sair 👋
          </button>
        </div>
      </header>

      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden mx-4">
        
        {/* Cabeçalho do Aluno (Mantido igual) */}
        <div className="p-10 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-4xl shadow-sm">
              {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{aluno.nome}</h2>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#5d5fef] text-[10px] font-black uppercase rounded-lg tracking-wider">
                {aluno.diagnostico || 'Perfil Geral'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleExcluirAluno} 
            className="flex items-center gap-2 px-5 py-3 border border-slate-200 bg-white text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm no-print group"
          >
            <span className="text-sm group-hover:animate-bounce">🗑️</span> Excluir
          </button>
        </div>

        <div className="px-10 pb-12 space-y-8 mt-8">
          
          {peiExibido ? (
            <>
              {/* Box Principal de Dados - Agora puxa as infos do peiExibido */}
              <section className={`p-8 rounded-[32px] border relative overflow-hidden transition-colors ${peiExibido.id === peiAtivo?.id ? 'bg-[#5d5fef]/5 border-[#5d5fef]/20' : 'bg-slate-50 border-slate-200'}`}>
                
                {/* Etiqueta dinâmica: Mostra se é o plano atual ou do histórico */}
                <div className={`absolute top-0 right-0 text-white text-[10px] font-black uppercase px-4 py-2 rounded-bl-2xl tracking-widest ${peiExibido.id === peiAtivo?.id ? 'bg-[#5d5fef]' : 'bg-slate-400'}`}>
                  {peiExibido.id === peiAtivo?.id ? 'Plano Ativo' : 'Plano Antigo (Histórico)'}
                </div>
                
                <h3 className={`${peiExibido.id === peiAtivo?.id ? 'text-[#5d5fef]' : 'text-slate-700'} font-black mb-6 flex items-center gap-2 text-xl mt-2 tracking-tight`}>
                  📊 {peiExibido.nome_plano || 'Plano de Desenvolvimento'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { key: 'comunicacao', label: 'Comunicação' },
                    { key: 'social', label: 'Socialização' },
                    { key: 'humor', label: 'Humor' },
                    { key: 'motor', label: 'Motor' },
                  ].map(item => (
                    <div key={item.key} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase mb-2 tracking-wider px-1">
                        <span>{item.label}</span>
                        <span className="text-[#5d5fef]">{peiExibido[item.key] || 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#5d5fef] rounded-full transition-all duration-700" style={{ width: `${peiExibido[item.key] || 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                   <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">🎯 Objetivos Estratégicos</h4>
                      <p className="text-sm font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed">{peiExibido.objetivos || 'Não definido.'}</p>
                   </div>
                   <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">🛠️ Metodologia</h4>
                      <p className="text-sm font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed">{peiExibido.metodologia || 'Não definida.'}</p>
                   </div>
                </div>
              </section>

              {peiExibido.protocolo_crise && peiExibido.protocolo_crise.length > 0 && (
                <section className="bg-red-50/50 p-8 rounded-[32px] border border-red-100">
                  <h3 className="text-red-700 font-black mb-6 flex items-center gap-2 text-lg tracking-tight">
                    🚨 Protocolo de Manejo de Crise
                  </h3>
                  <div className="space-y-3">
                    {Array.isArray(peiExibido.protocolo_crise) ? (
                      peiExibido.protocolo_crise.map((passo: string, i: number) => (
                        <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-red-50 shadow-sm items-center">
                          <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">{i+1}</span>
                          <p className="text-sm font-semibold text-slate-700">{passo}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-5 bg-white rounded-2xl border border-red-50 shadow-sm">
                        <p className="text-slate-700 text-sm font-semibold leading-relaxed whitespace-pre-wrap">{peiExibido.protocolo_crise}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-bold tracking-tight">Nenhum plano ativo encontrado para este aluno.</p>
            </div>
          )}

          {/* NOVA SEÇÃO: Histórico de Planos (Só aparece se tiver mais de 1 plano) */}
          {planosOrdenados.length > 1 && (
            <div className="mt-12 mb-6 border-t border-slate-100 pt-10 no-print">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-6">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                Histórico de Planos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* .reverse() para mostrar do mais novo pro mais velho na lista */}
                {[...planosOrdenados].reverse().map((plano, index) => {
                  const isAtivo = index === 0; // O primeiro da lista invertida sempre é o mais recente
                  const isSelecionado = peiExibido?.id === plano.id;

                  return (
                    <div 
                      key={plano.id} 
                      onClick={() => setPlanoVisualizadoId(plano.id)}
                      className={`cursor-pointer p-6 rounded-[24px] border-2 transition-all ${
                        isSelecionado 
                          ? 'border-[#5d5fef] bg-[#5d5fef]/5 shadow-sm' 
                          : 'border-slate-100 bg-white hover:border-[#5d5fef]/30 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">
                          {plano.nome_plano || `Plano #${plano.id}`}
                        </h4>
                        {isAtivo ? (
                          <span className="px-2 py-1 bg-indigo-100 text-[#5d5fef] text-[10px] font-black uppercase rounded-md tracking-widest">
                            Atual
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-md tracking-widest">
                            Antigo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">
                        {plano.objetivos || "Sem objetivos descritos..."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botões do Rodapé */}
          <div className="flex gap-4 pt-6 no-print">
            <button onClick={() => window.print()} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 shadow-xl active:scale-95 transition-all tracking-wide text-sm">
              🖨️ Imprimir Prontuário
            </button>
            <Link href="/home" className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-center hover:bg-slate-50 hover:border-slate-300 transition-all text-sm">
              Voltar para Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}