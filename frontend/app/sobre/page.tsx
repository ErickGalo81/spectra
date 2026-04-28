"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SobrePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });

  // Busca o perfil do professor logado para o cabeçalho
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setUsuario({ nome: "Visitante", cargo: "Acesso Limitado" });
          return;
        }

        const res = await axios.get("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const nomeReal = res.data.nome || res.data.username;
        setUsuario({ nome: nomeReal, cargo: res.data.cargo });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };
    carregarPerfil();
  }, []);

  const iniciais = usuario.nome !== "Carregando..." 
    ? usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) 
    : "??";

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center pb-12">
      
      {/* Cabeçalho Sincronizado */}
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
              <Link href="/planos-ativos" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium">Planos</Link>
              <Link href="/sobre" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md font-medium">Sobre</Link>
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

      <main className="w-full max-w-4xl px-4">
        <div className="bg-white w-full rounded-[32px] px-8 py-12 flex flex-col shadow-sm border border-slate-200 relative">
          
          {/* Botão Voltar para Home */}
          <button 
            onClick={() => router.push('/home')}
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-bold uppercase tracking-wider">Início</span>
          </button>

          <div className="text-center mb-10 border-b border-slate-100 pb-8 mt-6">
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-4">Sobre o Spectra</h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto font-medium">
              O SPECTRA é um ecossistema digital desenvolvido para auxiliar professores e tutores no acompanhamento de alunos com necessidades educacionais específicas.
            </p>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6 px-2 flex items-center gap-2">
            <span className="text-indigo-600">●</span> Perguntas Frequentes (FAQ)
          </h2>

          <div className="flex flex-col gap-4 w-full">
            
            {/* FAQ 1 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all hover:border-indigo-200">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-slate-800 font-bold">
                <span>Quem pode usar o sistema?</span>
                <span className="bg-white p-1.5 rounded-full border group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 border-t pt-4">
                O Spectra foi criado principalmente para professores da educação básica, educadores especiais, tutores, psicopedagogos e coordenadores pedagógicos.
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all hover:border-indigo-200">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-slate-800 font-bold">
                <span>Como cadastrar um aluno?</span>
                <span className="bg-white p-1.5 rounded-full border group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 border-t pt-4">
                Navegue até a aba "Cadastrar" no menu superior. Preencha os dados de identificação (nome, matrícula). Após isso, você poderá associar laudos e criar planos específicos.
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all hover:border-indigo-200">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-slate-800 font-bold">
                <span>O que é um plano de acompanhamento?</span>
                <span className="bg-white p-1.5 rounded-full border group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 border-t pt-4">
                É o PEI (Plano de Ensino Individualizado), onde o professor estabelece metas de desenvolvimento cognitivo, motor e social adaptadas ao aluno.
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all hover:border-indigo-200">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-slate-800 font-bold">
                <span>Como funciona o registro de progresso?</span>
                <span className="bg-white p-1.5 rounded-full border group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 border-t pt-4">
                No Dashboard, você visualiza gráficos que representam o progresso em áreas como Humor e Comunicação, baseados nas observações e registros diários.
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all hover:border-indigo-200">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-slate-800 font-bold">
                <span>Os dados dos alunos estão seguros?</span>
                <span className="bg-white p-1.5 rounded-full border group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 border-t pt-4">
                Sim. Utilizamos autenticação JWT e banco de dados PostgreSQL criptografado, respeitando a LGPD e garantindo privacidade total.
              </div>
            </details>

          </div>
        </div>
      </main>
    </div>
  );
}