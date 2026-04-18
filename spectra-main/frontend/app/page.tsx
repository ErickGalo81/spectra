'use client'; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter(); 

  // Estados para capturar a digitação e cliques
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);
  
  // Estados de controle da tela
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Função que será chamada ao clicar no botão
  const handleLogin = async () => {
    setErro(''); // Limpa erros antigos

    // 1. Validações Locais
    if (!email || !senha) {
      setErro('Por favor, preencha seu e-mail e senha.');
      return;
    }

    if (!termosAceitos) {
      setErro('Você precisa concordar com os Termos de Uso para fazer login.');
      return;
    }

    setLoading(true);

    try {
      // 2. Fazendo a chamada para o Django (SimpleJWT)
      // O Django espera 'username', então passamos o e-mail nesse campo
      const resposta = await axios.post('http://localhost:8000/api/token/', {
        username: email,
        password: senha
      });

      // 3. Se deu certo, guarda os tokens de segurança no navegador
      if (resposta.data.access) {
        localStorage.setItem('spectra_token', resposta.data.access);
        
        // Salva o token de renovação também (opcional, mas recomendado)
        if (resposta.data.refresh) {
            localStorage.setItem('spectra_refresh', resposta.data.refresh);
        }

        // Redireciona o usuário para a pasta app/home
        router.push('/home');
      }

    } catch (err: any) {
      // 4. Tratamento de Erros
      if (err.response && err.response.status === 401) {
        setErro('E-mail ou senha incorretos.');
      } else {
        setErro('Erro de conexão. Verifique se o servidor Django está rodando na porta 8000.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
      
      {/* Logo Simulada - Gradiente mais sóbrio */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
          🧠 SPECTRA
        </span>
      </div>

      {/* Card Principal - Fundo cinza claro */}
      <div className="bg-slate-100 w-full max-w-3xl rounded-[40px] px-8 py-12 flex flex-col items-center text-center shadow-sm">
        
        {/* Título */}
        <h1 className="text-4xl font-medium text-slate-800 mb-4">
          Faça seu login!
        </h1>
        <p className="text-xl text-slate-600 mb-10">
          Portal do Profissional - SPECTRA
        </p>

        {/* Caixa de Erro Visível (Só aparece se algo der errado) */}
        {erro && (
          <div className="w-full max-w-md bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium text-center shadow-sm">
            {erro}
          </div>
        )}

        <form className="w-full max-w-md flex flex-col gap-5">
          
          {/* Input de E-mail */}
          <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400 transition-all">
            <span className="text-gray-400 text-lg mr-3">✉️</span>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Input de Senha */}
          <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400 transition-all">
            <span className="text-gray-400 text-lg mr-3">🛡️</span>
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Termos de Uso */}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-700 text-left px-1">
            <input 
              type="checkbox" 
              checked={termosAceitos}
              onChange={(e) => setTermosAceitos(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 accent-slate-800 cursor-pointer shrink-0" 
            />
            <label className="leading-tight cursor-pointer" onClick={() => setTermosAceitos(!termosAceitos)}>
              Eu concordo com os termos de Uso e Política de Privacidade
            </label>
          </div>

          {/* Botão de Login */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className={`font-bold text-lg py-4 rounded-full mt-4 transition-all shadow-md ${
              loading ? 'bg-slate-400 cursor-not-allowed text-slate-100' : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            {loading ? 'Processando...' : 'Fazer login'}
          </button>
        </form>

        {/* Link de Cadastro */}
        <p className="mt-8 text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="text-slate-800 font-bold hover:underline">
            Cadastre-se
          </Link>
        </p>
        
      </div>
    </div>
  );
}