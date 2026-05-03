"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CadastrarAlunoPage() {
  const router = useRouter();

  // Estados para o formulário
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); 
  const [diagnostico, setDiagnostico] = useState("");
  const [sufixoAleatorio, setSufixoAleatorio] = useState(""); // <-- NOVO: Guarda o número único
  
  const [usuario, setUsuario] = useState({ nome: "Carregando...", cargo: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Gera um sufixo de 3 números (ex: 492) assim que a tela carrega
    setSufixoAleatorio(Math.floor(100 + Math.random() * 900).toString());

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
        setUsuario({ 
          nome: res.data.nome || res.data.username, 
          cargo: res.data.cargo 
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };
    carregarPerfil();
  }, [router]);

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

  // 🧠 LÓGICA DA MATRÍCULA AUTOMÁTICA (Agora com o sufixo único)
  let matriculaGerada = "";
  if (nome && dataNascimento.length === 10) {
    const ano = dataNascimento.split("/")[2]; // Pega o ano de nascimento
    const hoje = new Date();
    const diaMes = String(hoje.getDate()).padStart(2, '0') + String(hoje.getMonth() + 1).padStart(2, '0'); // DDMM de hoje
    const inicial = nome.charAt(0).toUpperCase(); // Primeira letra do nome
    
    // Adiciona o sufixo no final para garantir exclusividade!
    matriculaGerada = `${ano}${diaMes}${inicial}-${sufixoAleatorio}`; 
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        alert("Aluno cadastrado com sucesso!");
        router.push("/home");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar aluno:", error);
      alert(error.response?.data?.error || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const iniciais = usuario.nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
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

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-slate-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                {iniciais}
              </div>
              <span className="hidden md:block text-slate-700 font-medium text-base">{usuario.nome}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl px-4 pb-12">
        <div className="bg-white w-full rounded-[32px] px-8 py-12 flex flex-col items-center shadow-sm border border-slate-200 relative">
          
          <button onClick={() => router.back()} className="absolute left-8 top-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors group">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          
          <h1 className="text-3xl font-semibold text-slate-800 mb-3 text-center tracking-tight">
            Cadastrar Novo Aluno
          </h1>
          <p className="text-base text-slate-600 mb-10 text-center max-w-2xl">
            As informações serão salvas no prontuário digital do aluno.
          </p>

          <form onSubmit={handleCadastro} className="w-full max-w-md flex flex-col gap-5">
            
            {/* Nome */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <span className="text-slate-400 mr-3 text-lg">👤</span>
              <input 
                required
                type="text" 
                placeholder="Nome Completo do Aluno" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 text-sm placeholder:text-slate-400" 
              />
            </div>

            {/* Data de Nascimento */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <span className="text-slate-400 mr-3 text-lg">📅</span>
              <input 
                required
                type="text" 
                placeholder="Data de Nascimento (DD/MM/AAAA)" 
                value={dataNascimento}
                onChange={handleDataChange}
                maxLength={10}
                className="w-full bg-transparent outline-none text-slate-700 text-sm placeholder:text-slate-400" 
              />
            </div>

            {/* Matrícula Automática */}
            <div className="bg-slate-100/70 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 transition-all">
              <span className="text-slate-400 mr-3 text-lg">🏷️</span>
              <div className="w-full flex justify-between items-center gap-2">
                <input 
                  readOnly
                  type="text" 
                  placeholder="A matrícula será gerada aqui..." 
                  value={matriculaGerada}
                  className="w-full bg-transparent outline-none text-slate-600 font-mono text-sm placeholder:text-slate-400 cursor-not-allowed" 
                />
                <span className="text-[10px] bg-slate-200 text-slate-500 px-2.5 py-1 rounded-md font-bold tracking-wider">
                  AUTO
                </span>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-3.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <span className="text-slate-400 mr-3 text-lg">📋</span>
              <input 
                type="text" 
                placeholder="Diagnóstico Principal (Ex: TEA, TDAH)" 
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 text-sm placeholder:text-slate-400" 
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`text-white font-medium text-base py-4 rounded-xl transition-all shadow-md w-full active:scale-[0.98] ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                {loading ? 'Salvando no Banco...' : 'Concluir Cadastro'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}