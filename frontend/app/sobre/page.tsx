"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function SobrePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("spectra_token");
        
        if (!token) {
          setUsuario({ nome: "Visitante", cargo: "Acesso Limitado" });
          return;
        }

        const res = await axios.get("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const nomeReal = res.data.nome || res.data.username;
        setUsuario({ nome: nomeReal, cargo: res.data.cargo || "Professor Responsável" });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setUsuario({ nome: "Visitante", cargo: "Acesso Limitado" });
      }
    };
    carregarPerfil();
  }, []);

  const handleLogout = () => {
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

  const iniciais = usuario.nome !== "Carregando..." && usuario.nome !== "Visitante"
    ? usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) 
    : "V";

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col items-center pb-16 antialiased selection:bg-blue-100">
      
      {/* HEADER PROFISSIONAL SAAS */}
      <header className="w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="flex items-center gap-2 group">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-950 tracking-tighter transition-all duration-300 group-hover:from-[#2563eb] group-hover:to-blue-500">
                🧠 SPECTRA
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50 shadow-inner">
            <Link href="/home" className="text-slate-500 hover:text-slate-800 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Painel</Link>
            <Link href="/planos-ativos" className="text-slate-500 hover:text-slate-800 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Planos</Link>
            <Link href="/sobre" className="text-[#2563eb] bg-white px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm border border-slate-100 transition-all">Sobre</Link>
          </nav>

          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block border-r border-slate-200 pr-5">
              <p className="text-sm font-extrabold text-slate-900 leading-none">{usuario.nome}</p>
              <p className="text-[10px] font-black text-[#2563eb] uppercase mt-1 tracking-widest">{usuario.cargo}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200 ring-2 ring-white">
                {iniciais}
              </div>
              
              <button 
                onClick={handleLogout}
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
        </div>
      </header>

      <main className="w-full max-w-4xl px-6">
        <div className="bg-white w-full rounded-[32px] px-8 md:px-12 py-12 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-30 pointer-events-none"></div>

          <button 
            onClick={() => router.push('/home')}
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-[#2563eb] transition-colors group z-10"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Painel</span>
          </button>

          <div className="text-center mb-12 border-b border-slate-100 pb-10 mt-8 sm:mt-0 relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Sobre o <span className="text-[#2563eb]">SPECTRA</span></h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-2xl mx-auto font-medium">
              Um ecossistema digital inteligente, projetado para auxiliar educadores na gestão e acompanhamento de alunos com neurodiversidades.
            </p>
          </div>

          <h2 className="text-lg font-black text-slate-900 mb-6 px-2 flex items-center gap-3 relative z-10">
            <span className="w-1.5 h-5 bg-[#2563eb] rounded-sm"></span>
            Perguntas Frequentes (FAQ)
          </h2>

          {/* LISTA DE FAQs COM HOVER E ANIMAÇÃO SUAVE */}
          <div className="flex flex-col gap-4 w-full relative z-10">
            
            {/* FAQ 1 */}
            <div className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-[#2563eb]/40 hover:shadow-md hover:bg-white overflow-hidden cursor-default">
              <div className="flex items-center justify-between p-6 text-slate-800 font-bold select-none relative z-10 bg-inherit">
                <span>Quem pode usar o sistema?</span>
                <span className="bg-white text-slate-400 p-1.5 rounded-full border border-slate-200 group-hover:rotate-180 group-hover:text-[#2563eb] group-hover:border-blue-200 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
              {/* Box que abre magicamente no hover */}
              <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out bg-white">
                <div className="px-6 pb-6 text-sm text-slate-500 font-medium border-t border-slate-100 pt-5 leading-relaxed">
                  O Spectra foi criado principalmente para professores da educação básica, educadores especiais, tutores, psicopedagogos e coordenadores pedagógicos.
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-[#2563eb]/40 hover:shadow-md hover:bg-white overflow-hidden cursor-default">
              <div className="flex items-center justify-between p-6 text-slate-800 font-bold select-none relative z-10 bg-inherit">
                <span>Como cadastrar um aluno?</span>
                <span className="bg-white text-slate-400 p-1.5 rounded-full border border-slate-200 group-hover:rotate-180 group-hover:text-[#2563eb] group-hover:border-blue-200 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
              <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out bg-white">
                <div className="px-6 pb-6 text-sm text-slate-500 font-medium border-t border-slate-100 pt-5 leading-relaxed">
                  Navegue até o "Painel" e clique no botão "Cadastrar Novo Aluno". Preencha os dados de identificação (nome, matrícula). Após isso, você poderá associar laudos e criar planos específicos.
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-[#2563eb]/40 hover:shadow-md hover:bg-white overflow-hidden cursor-default">
              <div className="flex items-center justify-between p-6 text-slate-800 font-bold select-none relative z-10 bg-inherit">
                <span>O que é um plano de acompanhamento?</span>
                <span className="bg-white text-slate-400 p-1.5 rounded-full border border-slate-200 group-hover:rotate-180 group-hover:text-[#2563eb] group-hover:border-blue-200 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
              <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out bg-white">
                <div className="px-6 pb-6 text-sm text-slate-500 font-medium border-t border-slate-100 pt-5 leading-relaxed">
                  É o PEI (Plano Educacional Individualizado), onde o professor estabelece metas de desenvolvimento cognitivo, motor e social adaptadas às necessidades do aluno.
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-[#2563eb]/40 hover:shadow-md hover:bg-white overflow-hidden cursor-default">
              <div className="flex items-center justify-between p-6 text-slate-800 font-bold select-none relative z-10 bg-inherit">
                <span>Como funciona o registro de progresso?</span>
                <span className="bg-white text-slate-400 p-1.5 rounded-full border border-slate-200 group-hover:rotate-180 group-hover:text-[#2563eb] group-hover:border-blue-200 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
              <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out bg-white">
                <div className="px-6 pb-6 text-sm text-slate-500 font-medium border-t border-slate-100 pt-5 leading-relaxed">
                  No Dashboard Principal e na tela de Planos Ativos, você visualiza barras de progresso contínuas que representam a evolução média em áreas como Comunicação e Humor.
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-[#2563eb]/40 hover:shadow-md hover:bg-white overflow-hidden cursor-default">
              <div className="flex items-center justify-between p-6 text-slate-800 font-bold select-none relative z-10 bg-inherit">
                <span>Os dados dos alunos estão seguros?</span>
                <span className="bg-white text-slate-400 p-1.5 rounded-full border border-slate-200 group-hover:rotate-180 group-hover:text-[#2563eb] group-hover:border-blue-200 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
              <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out bg-white">
                <div className="px-6 pb-6 text-sm text-slate-500 font-medium border-t border-slate-100 pt-5 leading-relaxed">
                  Absolutamente. Utilizamos tokens JWT para autenticação e as informações ficam armazenadas de forma segura, respeitando totalmente a LGPD e garantindo privacidade total.
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}