"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

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

  const handleExcluirAluno = () => {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a excluir ${aluno?.nome} permanentemente! Todos os planos e prontuários vinculados serão perdidos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#94a3b8',  
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      borderRadius: '24px'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('spectra_token');
          await axios.delete(`http://localhost:8000/api/alunos/${id}/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          
          Swal.fire({
            title: 'Excluído!',
            text: 'O aluno foi removido com sucesso.',
            icon: 'success',
            confirmButtonColor: '#2563eb', // Atualizado para o Azul Royal
            borderRadius: '24px'
          });
          
          router.push("/home");
        } catch (error) {
          console.error("Erro ao excluir:", error);
          Swal.fire('Erro!', 'Não foi possível excluir o aluno. Verifique se tem permissão.', 'error');
        }
      }
    });
  };

  // Função Sair padronizada com as outras telas
  const handleSair = () => {
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

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#2563eb] rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sincronizando Prontuário...</p>
    </div>
  );
  
  if (!aluno) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Aluno não encontrado.</div>;

  const todosPlanos = aluno.peis || [];
  const planosOrdenados = [...todosPlanos].sort((a, b) => a.id - b.id);
  const peiAtivo = planosOrdenados.length > 0 ? planosOrdenados[planosOrdenados.length - 1] : null; 

  const peiExibido = planoVisualizadoId 
    ? planosOrdenados.find(p => p.id === planoVisualizadoId) 
    : peiAtivo;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center pb-20 font-sans antialiased selection:bg-blue-100">
      
      {/* HEADER PROFISSIONAL SAAS */}
      <header className="w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 mb-8 no-print">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center h-20">
          
          <div className="flex items-center gap-6">
            <Link href="/home" className="flex items-center gap-2 group">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-950 tracking-tighter transition-all duration-300 group-hover:from-[#2563eb] group-hover:to-blue-500">
                🧠 SPECTRA
              </span>
            </Link>
            
            <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
            
            <button 
              onClick={() => router.push('/home')} 
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-[#2563eb] transition-colors group"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Painel Geral</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSair}
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
      </header>

      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 overflow-hidden mx-4">
        
        {/* CABEÇALHO DO ALUNO - DESIGN PREMIUM */}
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-sm">
              {aluno.id % 2 === 0 ? '👧🏼' : '👦🏻'}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{aluno.nome}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-[#2563eb] text-[10px] font-black uppercase rounded-lg tracking-widest shadow-sm">
                  {aluno.diagnostico || 'Perfil Geral'}
                </span>
                <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-lg tracking-widest shadow-sm">
                  Prontuário Ativo
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleExcluirAluno} 
            className="flex items-center gap-2 px-5 py-3 border border-slate-200 bg-white text-slate-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm no-print group shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-bounce"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Excluir Prontuário
          </button>
        </div>

        <div className="px-8 md:px-12 pb-12 space-y-10 mt-10">
          
          {peiExibido ? (
            <>
              {/* BOX PRINCIPAL DO PLANO */}
              <section className={`p-8 md:p-10 rounded-[28px] border relative overflow-hidden transition-colors ${peiExibido.id === peiAtivo?.id ? 'bg-[#2563eb]/5 border-[#2563eb]/20 shadow-inner' : 'bg-slate-50 border-slate-200'}`}>
                
                {/* Etiqueta dinâmica */}
                <div className={`absolute top-0 right-0 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-widest ${peiExibido.id === peiAtivo?.id ? 'bg-[#2563eb]' : 'bg-slate-400'}`}>
                  {peiExibido.id === peiAtivo?.id ? 'Plano Vigente' : 'Registro de Histórico'}
                </div>
                
                <h3 className={`${peiExibido.id === peiAtivo?.id ? 'text-[#2563eb]' : 'text-slate-700'} font-black mb-8 flex items-center gap-2 text-2xl mt-2 tracking-tight`}>
                  📊 {peiExibido.nome_plano || 'Plano de Desenvolvimento'}
                </h3>
                
                {/* MÉTRICAS (BENTO GRID STYLE) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  {[
                    { key: 'comunicacao', label: 'Comunicação e Expressão' },
                    { key: 'social', label: 'Socialização e Interação' },
                    { key: 'humor', label: 'Autorregulação / Humor' },
                    { key: 'motor', label: 'Desenvolvimento Motor' },
                  ].map(item => (
                    <div key={item.key} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-3 tracking-wider px-1">
                        <span>{item.label}</span>
                        <span className="text-[#2563eb] text-sm">{peiExibido[item.key] || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-[#2563eb] to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${peiExibido[item.key] || 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* OBJETIVOS E METODOLOGIA */}
                <div className="grid md:grid-cols-2 gap-5">
                   <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                      <h4 className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
                        <span className="text-base">🎯</span> Objetivos Estratégicos
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed flex-1">{peiExibido.objetivos || 'Nenhum objetivo definido neste plano.'}</p>
                   </div>
                   <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                      <h4 className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
                        <span className="text-base">🛠️</span> Metodologia Aplicada
                      </h4>
                      <p className="text-sm font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed flex-1">{peiExibido.metodologia || 'Nenhuma metodologia descrita.'}</p>
                   </div>
                </div>
              </section>

              {/* PROTOCOLO DE CRISE */}
              {peiExibido.protocolo_crise && peiExibido.protocolo_crise.length > 0 && (
                <section className="bg-red-50/40 p-8 md:p-10 rounded-[28px] border border-red-100/70 shadow-sm">
                  <h3 className="text-red-600 font-black mb-6 flex items-center gap-2 text-lg tracking-tight">
                    🚨 Protocolo de Manejo de Crise
                  </h3>
                  <div className="space-y-3">
                    {Array.isArray(peiExibido.protocolo_crise) ? (
                      peiExibido.protocolo_crise.map((passo: string, i: number) => (
                        <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-red-50 shadow-sm items-center hover:border-red-200 transition-colors">
                          <span className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-sm">{i+1}</span>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed">{passo}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 bg-white rounded-2xl border border-red-50 shadow-sm">
                        <p className="text-slate-700 text-sm font-semibold leading-relaxed whitespace-pre-wrap">{peiExibido.protocolo_crise}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-slate-500 font-bold tracking-tight">Nenhum plano ativo encontrado para este aluno.</p>
            </div>
          )}

          {/* HISTÓRICO DE PLANOS */}
          {planosOrdenados.length > 1 && (
            <div className="mt-16 mb-6 border-t border-slate-200 pt-12 no-print">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
                <span className="w-1.5 h-6 bg-[#2563eb] rounded-sm"></span>
                Histórico de Evolução
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...planosOrdenados].reverse().map((plano, index) => {
                  const isAtivo = index === 0; 
                  const isSelecionado = peiExibido?.id === plano.id;

                  return (
                    <div 
                      key={plano.id} 
                      onClick={() => setPlanoVisualizadoId(plano.id)}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                        isSelecionado 
                          ? 'border-[#2563eb] bg-[#2563eb]/5 shadow-md scale-[1.01]' 
                          : 'border-slate-100 bg-white hover:border-[#2563eb]/30 hover:bg-blue-50/30 hover:-translate-y-1 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-black text-slate-800 tracking-tight">
                          {plano.nome_plano || `Plano #${plano.id}`}
                        </h4>
                        {isAtivo ? (
                          <span className="px-2.5 py-1 bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-black uppercase rounded-lg tracking-widest shrink-0">
                            Atual
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg tracking-widest shrink-0">
                            Antigo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {plano.objetivos || "Sem objetivos descritos neste documento..."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BOTÕES DO RODAPÉ (IMPRESSÃO) */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100 no-print">
            <button 
              onClick={() => window.print()} 
              className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 shadow-lg hover:shadow-slate-500/20 active:scale-95 transition-all tracking-wide flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Imprimir Prontuário Oficial
            </button>
            <Link 
              href="/home" 
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-center hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-95 transition-all text-sm shadow-sm"
            >
              Voltar ao Início
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}