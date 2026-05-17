"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function AjustarPlanoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; 

  const [usuario, setUsuario] = useState({ nome: "Carregando...", iniciais: ".." });
  const [alunoNome, setAlunoNome] = useState("Carregando...");
  const [alunoMatricula, setAlunoMatricula] = useState("...");
  
  // Campos do PEI
  const [nomePlano, setNomePlano] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [metodologia, setMetodologia] = useState("");
  const [comunicacao, setComunicacao] = useState(50);
  const [social, setSocial] = useState(50);
  const [humor, setHumor] = useState(50);
  const [motor, setMotor] = useState(50);
  const [protocolos, setProtocolos] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        const token = localStorage.getItem("spectra_token");
        if (!token) {
          router.push("/");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Carrega dados do usuário para o Header
        const resUser = await axios.get("http://localhost:8000/api/me/", config);
        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          iniciais: (resUser.data.nome || "User").split(" ").map((n:any) => n[0]).join("").toUpperCase().slice(0, 2)
        });

        // 2. Busca o PEI específico
        const resPei = await axios.get(`http://localhost:8000/api/peis/${id}/`, config);
        const plano = resPei.data;
        
        setNomePlano(plano.nome_plano || "");
        setDiagnostico(plano.diagnostico || "");
        setObjetivos(plano.objetivos || "");
        setMetodologia(plano.metodologia || "");
        setComunicacao(plano.comunicacao);
        setSocial(plano.social);
        setHumor(plano.humor);
        setMotor(plano.motor);
        setProtocolos(plano.protocolo_crise || []);

        // 3. Busca dados do Aluno
        const resAluno = await axios.get(`http://localhost:8000/api/alunos/${plano.aluno}/`, config);
        setAlunoNome(resAluno.data.nome);
        setAlunoMatricula(resAluno.data.matricula);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) carregarTudo();
  }, [id, router]);

  const atualizarPasso = (index: number, valor: string) => {
    const novos = [...protocolos];
    novos[index] = valor;
    setProtocolos(novos);
  };

  const handleConfirmarAjustes = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("spectra_token");
      const payload = {
        nome_plano: nomePlano,
        diagnostico,
        objetivos,
        metodologia,
        comunicacao,
        social,
        humor,
        motor,
        protocolo_crise: protocolos.filter(p => p.trim() !== "")
      };

      await axios.patch(`http://localhost:8000/api/peis/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Plano atualizado com sucesso!");
      router.push("/planos-ativos"); 
    } catch (error) {
      alert("Erro ao salvar ajustes.");
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirPlano = async () => {
    if (window.confirm("⚠️ Excluir este plano permanentemente?")) {
      try {
        const token = localStorage.getItem("spectra_token");
        await axios.delete(`http://localhost:8000/api/peis/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        router.push("/planos-ativos");
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">Sincronizando SPECTRA...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Header Padronizado */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
              🧠 SPECTRA
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
              {usuario.iniciais}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-slate-800 font-bold text-sm leading-none">{usuario.nome}</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-wider">Professor</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl px-4 pb-12">
        <div className="bg-white rounded-[40px] px-10 py-12 shadow-md border border-slate-200 relative">
          
          <button onClick={() => router.back()} className="absolute left-10 top-10 flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors group">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase text-slate-500">Voltar</span>
          </button>

          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2 text-center">Ajustar Plano</h1>
            <p className="text-slate-600 text-sm font-medium">Personalize as diretrizes deste prontuário</p>
          </div>

          <div className="space-y-10">
            
            {/* IDENTIFICAÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[32px] border border-slate-200 shadow-inner relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl border border-slate-200 shadow-sm hidden md:flex">
                👦🏼
              </div>
              
              <div className="space-y-2 md:ml-10">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Nome do Aluno</label>
                <div className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-300 rounded-2xl text-slate-400 shadow-sm">
                  {alunoNome}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Título do Plano</label>
                <input 
                  type="text" 
                  className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-300 rounded-2xl outline-none focus:border-slate-800 transition-all text-slate-800"
                  value={nomePlano}
                  onChange={(e) => setNomePlano(e.target.value)}
                />
              </div>
            </div>

            {/* EVOLUÇÃO (SLIDERS) */}
            <div className="bg-white p-8 rounded-[32px] border-2 border-slate-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { label: "Comunicação", val: comunicacao, set: setComunicacao },
                  { label: "Socialização", val: social, set: setSocial },
                  { label: "Humor", val: humor, set: setHumor },
                  { label: "Motor", val: motor, set: setMotor }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{item.label}</span>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{item.val}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={item.val} onChange={(e) => item.set(Number(e.target.value))} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800 border border-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* DIRETRIZES */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">🎯 Objetivos Estratégicos</label>
                <textarea className="w-full text-sm p-6 bg-slate-50 border-2 border-slate-300 rounded-[30px] outline-none focus:border-slate-800 focus:bg-white min-h-[120px] text-slate-800" value={objetivos} onChange={(e) => setObjetivos(e.target.value)} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">🛠️ Metodologia Aplicada</label>
                <textarea className="w-full text-sm p-6 bg-slate-50 border-2 border-slate-300 rounded-[30px] outline-none focus:border-slate-800 focus:bg-white min-h-[120px] text-slate-800" value={metodologia} onChange={(e) => setMetodologia(e.target.value)} />
              </div>
            </div>

            {/* MANEJO DE CRISE */}
            <div className="pt-8 border-t border-slate-200">
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-6 ml-4">🚨 Protocolo de Manejo de Crise</label>
              <div className="space-y-4 bg-slate-50 p-8 rounded-[40px] border-2 border-slate-200">
                {protocolos.map((passo, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">{index + 1}</div>
                    <input className="flex-1 p-5 bg-white border-2 border-slate-300 rounded-2xl text-sm font-bold text-slate-800" value={passo} onChange={(e) => atualizarPasso(index, e.target.value)} />
                  </div>
                ))}
                <button type="button" onClick={() => setProtocolos([...protocolos, ""])} className="w-full py-5 border-2 border-dashed border-slate-400 rounded-2xl text-slate-600 text-[10px] font-black uppercase hover:bg-slate-200 bg-white">+ Adicionar Passo ao Protocolo</button>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex gap-4 pt-6">
              <button onClick={() => router.back()} className="flex-1 py-6 bg-white border-2 border-slate-200 text-slate-500 font-black text-sm uppercase rounded-[24px] hover:bg-slate-50 transition-all">Cancelar</button>
              <button onClick={handleConfirmarAjustes} disabled={saving} className="flex-[2] py-6 bg-slate-900 text-white font-black text-sm uppercase rounded-[24px] hover:bg-black shadow-xl transition-all">
                {saving ? 'Processando...' : 'Salvar Alterações'}
              </button>
              <button onClick={handleExcluirPlano} className="px-8 py-6 border-2 border-red-200 text-red-500 rounded-[24px] hover:bg-red-50 transition-all">🗑️</button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}