"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PlanosAtivosPage() {
  const router = useRouter();
  
  // Estados de dados e interface
  const [alunos, setAlunos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", iniciais: ".." });
  
  // Campos do Formulário
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [nomePlano, setNomePlano] = useState(""); 
  const [objetivos, setObjetivos] = useState("");
  const [metodologia, setMetodologia] = useState("");
  const [comunicacao, setComunicacao] = useState(50);
  const [humor, setHumor] = useState(50);
  const [social, setSocial] = useState(50);
  const [motor, setMotor] = useState(50);
  
  // Protocolo de Crise Dinâmico (conforme image_3d94c2.png)
  const [protocolos, setProtocolos] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const resUser = await axios.get("http://localhost:8000/api/me/", { headers: { Authorization: `Bearer ${token}` } });
        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          iniciais: (resUser.data.nome || "User").split(" ").map((n:any) => n[0]).join("").toUpperCase().slice(0, 2)
        });

        const resAlunos = await axios.get("http://localhost:8000/api/alunos/", { headers: { Authorization: `Bearer ${token}` } });
        setAlunos(resAlunos.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    fetchData();
  }, []);

  const adicionarPasso = () => setProtocolos([...protocolos, ""]);
  const atualizarPasso = (index: number, valor: string) => {
    const novos = [...protocolos];
    novos[index] = valor;
    setProtocolos(novos);
  };
  const removerPasso = (index: number) => setProtocolos(protocolos.filter((_, i) => i !== index));

  const handleSalvarPlano = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        aluno: alunoSelecionadoId,
        nome_plano: nomePlano,
        objetivos,
        metodologia,
        comunicacao,
        humor,
        social,
        motor,
        protocolo_crise: protocolos.filter(p => p.trim() !== "") 
      };
      await axios.post("http://localhost:8000/api/peis/", payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("Plano e Protocolo salvos!");
      router.push("/home");
    } catch (error) {
      alert("Erro ao salvar.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header SPECTRA conforme image_3d8998.png */}
      <header className="w-full bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800 tracking-tight">💬 SPECTRA</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{usuario.nome}</p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Professor</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200">
            {usuario.iniciais}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-10">
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800">Gestão de Planos</h1>
            <p className="text-slate-400 text-sm italic">Configure o PEI e o Manejo de Crise abaixo</p>
          </div>

          <form onSubmit={handleSalvarPlano} className="space-y-10">
            
            {/* IDENTIFICAÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selecionar Aluno</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  value={alunoSelecionadoId}
                  onChange={(e) => setAlunoSelecionadoId(e.target.value)}
                  required
                >
                  <option value="">Escolha um aluno...</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Plano (Manual)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Plano de Intervenção Comportamental"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  value={nomePlano}
                  onChange={(e) => setNomePlano(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* NÍVEIS DE DESENVOLVIMENTO conforme image_3d86b4.png */}
            <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
              <h2 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-widest">Níveis de Desenvolvimento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { label: "Comunicação", val: comunicacao, set: setComunicacao, color: "bg-indigo-500" },
                  { label: "Humor", val: humor, set: setHumor, color: "bg-teal-500" },
                  { label: "Socialização", val: social, set: setSocial, color: "bg-purple-500" },
                  { label: "Motor", val: motor, set: setMotor, color: "bg-amber-500" }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-500 uppercase">{item.label}</span>
                      <span className="text-xs font-bold text-slate-800">{item.val}%</span>
                    </div>
                    <input 
                      type="range" 
                      value={item.val} 
                      onChange={(e) => item.set(Number(e.target.value))} 
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DIRETRIZES PEI conforme image_3cbec6.png */}
            <div className="space-y-6">
              <div className="p-1 bg-white border border-slate-200 rounded-[24px] focus-within:ring-2 focus-within:ring-indigo-500">
                <div className="p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-2">🎯 Objetivos a alcançar</label>
                  <textarea 
                    className="w-full bg-transparent outline-none text-sm min-h-[80px] resize-none"
                    placeholder="Descreva as metas principais..."
                    value={objetivos}
                    onChange={(e) => setObjetivos(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-1 bg-white border border-slate-200 rounded-[24px] focus-within:ring-2 focus-within:ring-indigo-500">
                <div className="p-4 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-2">🛠️ Metodologia e Ações</label>
                  <textarea 
                    className="w-full bg-transparent outline-none text-sm min-h-[80px] resize-none"
                    placeholder="Como será trabalhado?"
                    value={metodologia}
                    onChange={(e) => setMetodologia(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* PROTOCOLO DE MANEJO DE CRISE (Visual da Segunda Imagem) */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  🚨 Protocolo de Manejo de Crise
                </h3>
              </div>
              
              <div className="space-y-4 bg-red-50/30 p-6 rounded-[32px] border border-red-100/50">
                {protocolos.map((passo, index) => (
                  <div key={index} className="flex gap-4 items-center group animate-in fade-in slide-in-from-bottom-2">
                    {/* Bolinha Vermelha Numerada conforme image_3d94c2.png */}
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={passo}
                      onChange={(e) => atualizarPasso(index, e.target.value)}
                      placeholder="Descreva a ação de manejo..."
                      className="flex-1 p-4 bg-white border border-slate-200 rounded-[20px] text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 transition-all shadow-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => removerPasso(index)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={adicionarPasso}
                  className="w-full py-4 border-2 border-dashed border-red-200 rounded-[20px] text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-300 transition-all"
                >
                  + ADICIONAR PASSO AO PROTOCOLO
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
            >
              Gerar Plano e Protocolo
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}