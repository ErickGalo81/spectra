"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  diagnostico: string;
  comunicacao: number;
  social: number;
}

export default function HomePage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [resUser, resAlunos] = await Promise.all([
          axios.get("http://localhost:8000/api/me/", config),
          axios.get("http://localhost:8000/api/alunos/", config)
        ]);
        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          cargo: resUser.data.cargo || "Professor Responsável" 
        });
        setAlunos(resAlunos.data);
      } catch (error) {
        console.error("Erro na Home:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [router]);

  const iniciais = usuario.nome.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Cabeçalho Mantido (Estilo que você gosta) */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
                🧠 SPECTRA
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/home" className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl font-bold text-sm transition-all">Início</Link>
            <Link href="/planos-ativos" className="text-slate-500 hover:text-slate-900 px-4 py-2 font-bold text-sm transition-all">Planos</Link>
            <Link href="/sobre" className="text-slate-500 hover:text-slate-900 px-4 py-2 font-bold text-sm transition-all">Sobre</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{usuario.nome}</p>
              <p className="text-[10px] font-black text-indigo-600 uppercase mt-1 tracking-widest">{usuario.cargo}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 shadow-sm">
              {iniciais}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Banner de Boas-vindas com Alto Contraste */}
        <div className="bg-slate-900 rounded-[32px] p-10 mb-10 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Bem-vindo, {usuario.nome.split(" ")[0]}!</h1>
            <p className="text-slate-400 font-medium text-lg">Você tem <span className="text-white font-bold">{alunos.length} alunos</span> ativos no sistema.</p>
          </div>
          <Link href="/cadastrar-aluno" className="mt-6 md:mt-0 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg active:scale-95 relative z-10">
            + Cadastrar Aluno
          </Link>
        </div>

        {/* Grade de Alunos com Melhor Visibilidade */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Prontuários Recentes
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alunos.map((aluno) => (
              <Link href={`/aluno/${aluno.id}`} key={aluno.id} className="group">
                <div className="bg-white p-8 rounded-[32px] border-2 border-transparent shadow-sm group-hover:shadow-2xl group-hover:border-indigo-100 transition-all duration-300 flex flex-col h-full border-slate-100">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors border border-slate-100">
                      {aluno.id % 2 === 0 ? "👧🏼" : "👦🏻"}
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg tracking-widest">Ativo</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{aluno.nome}</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Matrícula: {aluno.matricula}</p>

                  <div className="space-y-5 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Evolução</span>
                      <span className="text-indigo-600">{(aluno.comunicacao + aluno.social) / 2}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(79,70,229,0.3)]" 
                        style={{ width: `${(aluno.comunicacao + aluno.social) / 2}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}