"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CriarPlanoPage() {
  const router = useRouter();
  
  const [alunos, setAlunos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", iniciais: ".." });
  
  // Campos do Formulário
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [nomePlano, setNomePlano] = useState(""); 
  const [diagnostico, setDiagnostico] = useState(""); 
  const [objetivos, setObjetivos] = useState("");
  const [metodologia, setMetodologia] = useState("");
  const [comunicacao, setComunicacao] = useState(50);
  const [humor, setHumor] = useState(50);
  const [social, setSocial] = useState(50);
  const [motor, setMotor] = useState(50);
  
  const [protocolos, setProtocolos] = useState<string[]>([]);

  // Estados de Controle e Notificação
  const [loading, setLoading] = useState(false);
  const [notificacao, setNotificacao] = useState({ texto: "", tipo: "" });

  // 1. EFEITO PARA CARREGAR DADOS INICIAIS (Usuário e Alunos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("spectra_token");
        if (!token) {
          router.push('/');
          return;
        }
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const resUser = await axios.get("http://localhost:8000/api/me/", config);
        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          iniciais: (resUser.data.nome || "User").split(" ").map((n:any) => n[0]).join("").toUpperCase().slice(0, 2)
        });

        const resAlunos = await axios.get("http://localhost:8000/api/alunos/", config);
        setAlunos(resAlunos.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    fetchData();
  }, [router]);

  // 🌟 NOVO: EFEITO DE PREENCHIMENTO AUTOMÁTICO (Apenas Diagnóstico)
  useEffect(() => {
    if (alunoSelecionadoId && alunos.length > 0) {
      // Encontra o objeto completo do aluno que foi selecionado
      const aluno = alunos.find(a => a.id.toString() === alunoSelecionadoId.toString());

      if (aluno) {
        // Preenche o Diagnóstico que já veio do cadastro dele
        if (aluno.diagnostico && aluno.diagnostico !== "Pendente") {
          setDiagnostico(aluno.diagnostico);
          
          // Dá um feedback visual super legal pro professor
          setNotificacao({ 
            texto: `✨ Diagnóstico preenchido automaticamente com os dados do aluno!`, 
            tipo: "sucesso" 
          });
        }
      }
    }
  }, [alunoSelecionadoId, alunos]); 

  // Funções de controle do Protocolo de Crise
  const adicionarPasso = () => setProtocolos([...protocolos, ""]);
  const atualizarPasso = (index: number, valor: string) => {
    const novos = [...protocolos];
    novos[index] = valor;
    setProtocolos(novos);
  };
  const removerPasso = (index: number) => setProtocolos(protocolos.filter((_, i) => i !== index));

  const handleSalvarPlano = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotificacao({ texto: "", tipo: "" }); 

    try {
      const token = localStorage.getItem("spectra_token");
      const payload = {
        aluno: alunoSelecionadoId,
        nome_plano: nomePlano,
        diagnostico: diagnostico,
        objetivos,
        metodologia,
        comunicacao,
        humor,
        social,
        motor,
        protocolo_crise: protocolos.filter(p => p.trim() !== "") 
      };
      await axios.post("http://localhost:8000/api/peis/", payload, { headers: { Authorization: `Bearer ${token}` } });
      
      setNotificacao({ texto: "✅ Plano e Protocolo salvos com sucesso!", tipo: "sucesso" });
      setTimeout(() => {
        router.push("/planos-ativos");
      }, 1500);

    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setNotificacao({ texto: "⚠️ Sua sessão expirou. Redirecionando para login...", tipo: "erro" });
        setTimeout(() => router.push("/"), 2000);
      } else if (err.response?.status === 400) {
        setNotificacao({ texto: "⚠️ Os dados informados são inválidos. Revise o preenchimento.", tipo: "erro" });
      } else {
        setNotificacao({ texto: "⚠️ Erro de comunicação com o servidor ao tentar salvar o PEI. Tente novamente.", tipo: "erro" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Header com Indigo Vibrante (#5d5fef) */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tighter">
              🧠 SPECTRA
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5d5fef] flex items-center justify-center text-white font-bold shadow-md border border-[#4a4be0]">
              {usuario.iniciais}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-slate-900 font-bold text-sm leading-none">{usuario.nome}</span>
              <span className="text-[#5d5fef] text-[10px] font-black uppercase mt-1 tracking-wider">Professor</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white rounded-[40px] px-10 py-12 shadow-md border border-slate-200 relative">
          
          <button 
            onClick={() => router.push('/planos-ativos')}
            className="absolute left-10 top-10 flex items-center gap-2 text-slate-400 hover:text-[#5d5fef] transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Voltar</span>
          </button>

          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Novo Plano</h1>
            <p className="text-slate-600 text-sm font-medium">Configure as diretrizes do PEI e o Manejo de Crise</p>
          </div>

          {/* 🌟 BLOCO DE NOTIFICAÇÃO DA INTERFACE */}
          {notificacao.texto && (
            <div className={`w-full p-4 mb-8 rounded-xl text-sm font-bold text-center shadow-sm border transition-all ${
              notificacao.tipo === 'sucesso' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {notificacao.texto}
            </div>
          )}

          <form onSubmit={handleSalvarPlano} className="space-y-10">
            
            {/* IDENTIFICAÇÃO - Inputs com foco no Indigo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[32px] border border-slate-200 shadow-inner">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Selecionar Aluno</label>
                <select 
                  className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-[#5d5fef] transition-all shadow-sm text-slate-900"
                  value={alunoSelecionadoId}
                  onChange={(e) => setAlunoSelecionadoId(e.target.value)}
                  required
                >
                  <option value="">Escolha um aluno...</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Título do Plano</label>
                <input 
                  type="text" 
                  placeholder="Ex: Plano Semestral"
                  className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-[#5d5fef] transition-all shadow-sm text-slate-900 placeholder-slate-400"
                  value={nomePlano}
                  onChange={(e) => setNomePlano(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Diagnóstico (TEA, TDAH...)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Autismo nível 1"
                  className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-[#5d5fef] transition-all shadow-sm text-slate-900 placeholder-slate-400"
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  required
                />
              </div>

            </div>

            {/* EVOLUÇÃO DO ALUNO - Sliders com cor vibrante */}
            <div className="bg-white p-8 rounded-[32px] border-2 border-slate-200 shadow-lg">
              <h2 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-[0.2em] text-center">Evolução do Aluno</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { label: "Comunicação", val: comunicacao, set: setComunicacao },
                  { label: "Humor", val: humor, set: setHumor },
                  { label: "Socialização", val: social, set: setSocial },
                  { label: "Motor", val: motor, set: setMotor }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{item.label}</span>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{item.val}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100"
                      value={item.val} 
                      onChange={(e) => item.set(Number(e.target.value))} 
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5d5fef] border border-slate-300" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DIRETRIZES - Textareas com foco no Indigo */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">
                  🎯 Objetivos a alcançar
                </label>
                <textarea 
                  className="w-full text-sm p-6 bg-slate-50 border-2 border-slate-200 rounded-[30px] outline-none focus:border-[#5d5fef] focus:bg-white min-h-[120px] resize-none shadow-sm transition-all text-slate-900 font-bold"
                  placeholder="Quais as metas pedagógicas?"
                  value={objetivos}
                  onChange={(e) => setObjetivos(e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">
                  🛠️ Metodologia Aplicada
                </label>
                <textarea 
                  className="w-full text-sm p-6 bg-slate-50 border-2 border-slate-200 rounded-[30px] outline-none focus:border-[#5d5fef] focus:bg-white min-h-[120px] resize-none shadow-sm transition-all text-slate-900 font-bold"
                  placeholder="Como o conteúdo será adaptado?"
                  value={metodologia}
                  onChange={(e) => setMetodologia(e.target.value)}
                />
              </div>
            </div>

            {/* PROTOCOLO DE MANEJO - Passos com fundo Indigo (#5d5fef) */}
            <div className="pt-8 border-t border-slate-200">
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] block mb-6 ml-4">
                🚨 Protocolo de Manejo de Crise
              </label>
              <div className="space-y-4 bg-slate-50 p-8 rounded-[40px] border-2 border-slate-200 shadow-sm">
                {protocolos.map((passo, index) => (
                  <div key={index} className="flex gap-4 items-center group animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#5d5fef] text-white shadow-md flex items-center justify-center font-bold text-sm shrink-0 border border-[#4a4be0]">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={passo}
                      onChange={(e) => atualizarPasso(index, e.target.value)}
                      placeholder="Passo de intervenção..."
                      className="flex-1 p-5 bg-white border-2 border-slate-200 rounded-2xl text-sm outline-none focus:border-[#5d5fef] transition-all shadow-sm font-bold text-slate-900"
                    />
                    <button 
                      type="button" 
                      onClick={() => removerPasso(index)}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={adicionarPasso}
                  className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-[#5d5fef] hover:border-[#5d5fef] transition-all bg-white"
                >
                  + ADICIONAR PASSO AO PROTOCOLO
                </button>
              </div>
            </div>

            {/* BOTÃO FINAL - Atualizado com estado loading */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-6 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[24px] transition-all shadow-xl ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#5d5fef] hover:brightness-110 active:scale-95'
              }`}
            >
              {loading ? 'Salvando no Banco...' : 'Finalizar e Salvar PEI'}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}