"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function AjustarPlanoPage() {
  const router = useRouter();
  const params = useParams();
  
  // Estados para o Perfil e Dados do Banco
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(true);

  // 1. Carregar Identidade do Professor (Sincronizado com o seu Postgres)
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/");
          return;
        }

        const res = await axios.get("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const nomeReal = res.data.nome || res.data.username;
        setUsuario({ nome: nomeReal, cargo: res.data.cargo });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, [router]);

  // Iniciais dinâmicas (Ex: Erick Pereira -> EP)
  const iniciais = usuario.nome !== "Carregando..." 
    ? usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) 
    : "??";

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center pb-12">
      
      {/* Cabeçalho (Header) Dinâmico */}
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
              <Link href="/home" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium">Início</Link>
              <Link href="/cadastrar-aluno" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium">Cadastrar</Link>
              <Link href="/planos-ativos" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md font-medium">Planos</Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-slate-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm">
                {iniciais}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-slate-700 font-semibold text-sm leading-none">{usuario.nome}</span>
                <span className="text-slate-400 text-[10px] font-medium uppercase mt-1">{usuario.cargo}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="w-full max-w-4xl px-4">
        <div className="bg-white w-full rounded-[32px] px-8 py-10 flex flex-col shadow-sm border border-slate-200 relative">
          
          {/* BOTÃO DE VOLTAR (Igual ao da SobrePage) */}
          <button 
            onClick={() => router.push('/planos-ativos')}
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
          </button>

          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight text-center mb-8 mt-6">
            Ajustar Plano
          </h1>

          {/* Cabeçalho do Aluno (Exemplo Estático, pronto para virar dinâmico) */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-4xl shrink-0">
              👦🏻
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-2xl mb-2">Lucas Almeida</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold uppercase">TDAH</span>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold uppercase">Autismo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 1. Laudos */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-indigo-600">1.</span> Laudos Médicos
              </h3>
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                  <span className="text-sm text-slate-600 font-medium">📄 laudo_neurologico.pdf</span>
                  <button className="text-slate-400 hover:text-red-500">✕</button>
                </div>
              </div>
              <button className="w-full py-3 bg-white border border-dashed border-slate-300 hover:border-indigo-400 text-indigo-600 font-medium rounded-xl transition-all">
                + Anexar documento
              </button>
            </div>

            {/* 2. Metas */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-indigo-600">2.</span> Metas Principais
              </h3>
              <div className="space-y-3 mb-4 flex-grow">
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                  <p className="text-slate-700 text-sm font-medium outline-none" contentEditable suppressContentEditableWarning>
                    Melhorar a regulação emocional nas transições.
                  </p>
                </div>
              </div>
              <input type="text" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Adicionar nova meta..." />
            </div>
          </div>

          {/* 3. Estratégias */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-indigo-600">3.</span> Estratégias e Manejo
            </h3>
            <textarea 
              className="w-full h-32 bg-white border border-slate-300 rounded-xl p-4 text-sm font-medium text-slate-700 outline-none"
              defaultValue="Cronograma visual colado na carteira. Antecipação verbal de 5 min antes de mudanças."
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all">
              Salvar Alterações
            </button>
            <button onClick={() => router.back()} className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all">
              Cancelar
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}