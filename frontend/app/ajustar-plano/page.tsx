"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function AjustarPlanoPage() {
  const router = useRouter();
  const params = useParams();
  
  // Se você usa a rota como /ajustar-plano/[id], pegamos o ID assim:
  const id = params?.id; 

  const [alunoNome, setAlunoNome] = useState("Carregando...");
  const [alunoMatricula, setAlunoMatricula] = useState("...");
  
  // Estados dos Sliders
  const [comunicacao, setComunicacao] = useState(50);
  const [social, setSocial] = useState(50);
  const [humor, setHumor] = useState(50);
  const [motor, setMotor] = useState(50);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega os dados do PEI existente
  useEffect(() => {
    const carregarPlano = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/");
          return;
        }

        // Busca o PEI específico no backend
        const res = await axios.get(`http://localhost:8000/api/peis/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const plano = res.data;
        
        setComunicacao(plano.comunicacao);
        setSocial(plano.social);
        setHumor(plano.humor);
        setMotor(plano.motor);

        // Como o PEI retorna apenas o ID do aluno, precisamos buscar o nome e matrícula (opcional, mas recomendado)
        const resAluno = await axios.get(`http://localhost:8000/api/alunos/${plano.aluno}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAlunoNome(resAluno.data.nome);
        setAlunoMatricula(resAluno.data.matricula);

      } catch (error) {
        console.error("Erro ao carregar o plano:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) carregarPlano();
  }, [id, router]);

  // ==========================================
  // SALVAR AJUSTES (PUT)
  // ==========================================
  const handleConfirmarAjustes = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      
      const payload = {
        comunicacao,
        social,
        humor,
        motor
      };

      // Usamos PATCH ou PUT para atualizar o plano
      await axios.patch(`http://localhost:8000/api/peis/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Plano atualizado com sucesso!");
      router.push("/planos-ativos"); 
    } catch (error) {
      console.error("Erro ao atualizar o plano:", error);
      alert("Erro ao salvar ajustes.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EXCLUIR PLANO (DELETE)
  // ==========================================
  const handleExcluirPlano = async () => {
    const confirmacao = window.confirm(
      "⚠️ TEM CERTEZA?\n\nVocê está prestes a excluir este plano (PEI). O aluno não será excluído, apenas este plano. Esta ação não pode ser desfeita."
    );

    if (confirmacao) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://localhost:8000/api/peis/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Plano excluído com sucesso!");
        router.push("/planos-ativos");
      } catch (error) {
        console.error("Erro ao excluir o plano:", error);
        alert("Erro ao excluir o plano. Tente novamente.");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Carregando plano...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-12">
      
      <main className="w-full max-w-2xl px-4">
        <div className="bg-white w-full rounded-[32px] p-8 shadow-sm border border-slate-200">
          
          {/* CABEÇALHO COM AVATAR E NOME */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl border border-slate-200">
              👦🏼
            </div>
            <div>
              <div className="bg-indigo-50/50 border border-indigo-100 text-slate-800 font-bold text-xl px-4 py-2 rounded-xl mb-1 inline-block">
                {alunoNome}
              </div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                Matrícula: {alunoMatricula}
              </p>
            </div>
          </div>

          {/* SLIDERS */}
          <div className="flex flex-col gap-8 mb-12">
            
            {/* Comunicação */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 tracking-wider">COMUNICAÇÃO</span>
                <span className="text-xs font-bold text-indigo-600">{comunicacao}%</span>
              </div>
              <input type="range" min="0" max="100" value={comunicacao} onChange={(e) => setComunicacao(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
            </div>

            {/* Socialização */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 tracking-wider">SOCIALIZAÇÃO</span>
                <span className="text-xs font-bold text-indigo-600">{social}%</span>
              </div>
              <input type="range" min="0" max="100" value={social} onChange={(e) => setSocial(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
            </div>

            {/* Humor */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 tracking-wider">HUMOR</span>
                <span className="text-xs font-bold text-indigo-600">{humor}%</span>
              </div>
              <input type="range" min="0" max="100" value={humor} onChange={(e) => setHumor(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
            </div>

            {/* Motor */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 tracking-wider">MOTOR</span>
                <span className="text-xs font-bold text-indigo-600">{motor}%</span>
              </div>
              <input type="range" min="0" max="100" value={motor} onChange={(e) => setMotor(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
            </div>

          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmarAjustes}
              disabled={saving}
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98]"
            >
              {saving ? 'Salvando...' : 'Confirmar Ajustes'}
            </button>

            <button
              onClick={() => router.back()}
              className="px-6 py-4 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
            >
              Sair
            </button>
            
            {/* NOVO BOTÃO: EXCLUIR PLANO */}
            <button
              onClick={handleExcluirPlano}
              title="Excluir este plano"
              className="px-5 py-4 border border-red-200 text-red-500 font-bold text-lg rounded-xl hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center"
            >
              🗑️
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}