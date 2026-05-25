"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function CadastrarAlunoPage() {
  const router = useRouter();

  // Estados para o formulário
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); 
  const [diagnostico, setDiagnostico] = useState("");
  const [sufixoAleatorio, setSufixoAleatorio] = useState(""); 
  
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(false);
  
  const [notificacao, setNotificacao] = useState({ texto: "", tipo: "" });

  // 1. CARREGAMENTO INICIAL E PERFIL
  useEffect(() => {
    setSufixoAleatorio(Math.floor(100 + Math.random() * 900).toString());

    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("spectra_token");
        if (!token) {
          router.push("/");
          return;
        }
        const res = await axios.get("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuario({ 
          nome: res.data.nome || res.data.username, 
          cargo: res.data.cargo || "Professor Responsável"
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };
    carregarPerfil();
  }, [router]);

  // 2. INJEÇÃO DO WIDGET DE ACESSIBILIDADE VLIBRAS
  useEffect(() => {
    const scriptId = "vlibras-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.onload = () => {
        // @ts-ignore (Ignora o erro de tipagem do TS para a variável global do window)
        if (window.VLibras) {
          // @ts-ignore
          new window.VLibras.Widget("https://vlibras.gov.br/app");
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  // Aplica a máscara DD/MM/AAAA
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    setDataNascimento(value);
  };

  // LÓGICA DA MATRÍCULA AUTOMÁTICA
  let matriculaGerada = "";
  if (nome && dataNascimento.length === 10) {
    const ano = dataNascimento.split("/")[2]; 
    const hoje = new Date();
    const diaMes = String(hoje.getDate()).padStart(2, '0') + String(hoje.getMonth() + 1).padStart(2, '0'); 
    const inicial = nome.charAt(0).toUpperCase(); 
    
    matriculaGerada = `${ano}${diaMes}${inicial}-${sufixoAleatorio}`; 
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotificacao({ texto: "", tipo: "" });

    try {
      const token = localStorage.getItem("spectra_token");
      
      let dataFormatadaParaBanco = null;
      if (dataNascimento.length === 10) {
        const [dia, mes, ano] = dataNascimento.split("/");
        dataFormatadaParaBanco = `${ano}-${mes}-${dia}`;
      }
      
      const payload = {
        nome: nome,
        data_nascimento: dataFormatadaParaBanco,
        matricula: matriculaGerada, 
        diagnostico: diagnostico || "Pendente",
      };

      const res = await axios.post("http://localhost:8000/api/alunos/", payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.status === 201) {
        setNotificacao({ texto: "✅ Aluno cadastrado com sucesso!", tipo: "sucesso" });
        setTimeout(() => {
          router.push("/home");
        }, 1500);
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setNotificacao({ texto: "⚠️ Sua sessão expirou. Redirecionando para login...", tipo: "erro" });
        setTimeout(() => router.push("/"), 2000);
      } else {
        const erroBackend = err.response?.data ? JSON.stringify(err.response.data).toLowerCase() : "";
        
        if (erroBackend.includes("unique") || erroBackend.includes("já existe") || erroBackend.includes("matricula")) {
          setNotificacao({ texto: "⚠️ Já existe um aluno cadastrado com esta matrícula no SPECTRA.", tipo: "erro" });
        } else if (err.response?.status === 400) {
          setNotificacao({ texto: "⚠️ Preencha os dados corretamente. Verifique se a data está no formato DD/MM/AAAA.", tipo: "erro" });
        } else {
          setNotificacao({ texto: "⚠️ Ocorreu um erro de comunicação com o servidor ao salvar o aluno.", tipo: "erro" });
        }
      }
    } finally {
      setLoading(false);
    }
  };

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

  const iniciais = usuario.nome !== "Carregando..." 
    ? usuario.nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "V";

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col items-center pb-16 antialiased selection:bg-blue-100">
      
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
            <Link href="/sobre" className="text-slate-500 hover:text-slate-800 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Sobre</Link>
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

      <main className="w-full max-w-3xl px-6">
        <div className="bg-white w-full rounded-[32px] px-8 md:px-16 py-12 flex flex-col items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

          <button 
            onClick={() => router.back()} 
            className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-[#2563eb] transition-colors group z-10"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest">Voltar</span>
          </button>
          
          <div className="text-center mb-10 mt-8 sm:mt-0 relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Cadastrar Novo Aluno
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
              Insira os dados iniciais do estudante. As informações serão salvas de forma segura no prontuário digital.
            </p>
          </div>

          {notificacao.texto && (
            <div className={`w-full max-w-md p-4 mb-8 rounded-2xl text-sm font-bold text-center shadow-sm border transition-all relative z-10 ${
              notificacao.tipo === 'sucesso' 
                ? 'bg-teal-50 text-teal-700 border-teal-200' 
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {notificacao.texto}
            </div>
          )}

          <form onSubmit={handleCadastro} className="w-full max-w-md flex flex-col gap-5 relative z-10">
            
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <input 
                required
                type="text" 
                placeholder="Nome Completo do Aluno" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-bold shadow-sm placeholder-slate-400" 
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <input 
                required
                type="text" 
                placeholder="Data de Nascimento (DD/MM/AAAA)" 
                value={dataNascimento}
                onChange={handleDataChange}
                maxLength={10}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-bold shadow-sm placeholder-slate-400" 
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <input 
                readOnly
                type="text" 
                placeholder="A matrícula será gerada aqui..." 
                value={matriculaGerada}
                className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl pl-12 pr-16 py-4 outline-none text-slate-500 font-mono font-bold text-sm placeholder-slate-400 cursor-not-allowed shadow-inner" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] bg-slate-200/70 text-slate-500 px-2 py-1 rounded-md font-black tracking-widest border border-slate-300/50">
                AUTO
              </span>
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <input 
                type="text" 
                placeholder="Diagnóstico Principal (Ex: TEA, TDAH)" 
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-bold shadow-sm placeholder-slate-400" 
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold text-sm uppercase tracking-widest py-4.5 rounded-2xl transition-all shadow-lg flex justify-center items-center h-14 ${
                  loading 
                    ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#2563eb] hover:bg-[#1d4ed8] shadow-blue-500/25 active:scale-95'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Concluir Cadastro'
                )}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* RENDERIZAÇÃO DO WIDGET VLIBRAS */}
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      
    </div>
  );
}