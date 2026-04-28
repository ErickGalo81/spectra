'use client'; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter(); 

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErro('');

    if (!email || !senha) {
      setErro('Por favor, preencha seu e-mail e senha.');
      return;
    }

    if (!termosAceitos) {
      setErro('Você precisa concordar com os Termos de Uso.');
      return;
    }

    setLoading(true);

    try {
      // Chamada para o SimpleJWT do Django
      const resposta = await axios.post('http://localhost:8000/api/token/', {
        username: email,
        password: senha
      });

      if (resposta.data.access) {
        // SALVANDO COM O NOME QUE A HOME PROCURA
        localStorage.setItem('access_token', resposta.data.access);
        
        if (resposta.data.refresh) {
            localStorage.setItem('refresh_token', resposta.data.refresh);
        }

        // Redireciona para a Home
        router.push('/home');
      }

    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setErro('E-mail ou senha incorretos.');
      } else {
        setErro('Erro de conexão. Verifique se o Django está rodando na porta 8000.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
          🧠 SPECTRA
        </span>
      </div>

      <div className="bg-slate-100 w-full max-w-3xl rounded-[40px] px-8 py-12 flex flex-col items-center text-center shadow-sm">
        <h1 className="text-4xl font-medium text-slate-800 mb-4">Faça seu login!</h1>
        <p className="text-xl text-slate-600 mb-10">Portal do Profissional - SPECTRA</p>

        {erro && (
          <div className="w-full max-w-md bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium shadow-sm">
            {erro}
          </div>
        )}

        <form className="w-full max-w-md flex flex-col gap-5">
          <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400">
            <span className="mr-3">✉️</span>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400">
            <span className="mr-3">🛡️</span>
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3 mt-2 text-sm text-gray-700 text-left">
            <input 
              type="checkbox" 
              checked={termosAceitos}
              onChange={(e) => setTermosAceitos(e.target.checked)}
              className="w-5 h-5 accent-slate-800 cursor-pointer" 
            />
            <label>Eu concordo com os termos de Uso</label>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className={`font-bold text-lg py-4 rounded-full mt-4 shadow-md ${
              loading ? 'bg-slate-400' : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            {loading ? 'Processando...' : 'Fazer login'}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-600">
          Não tem uma conta? <Link href="/cadastro" className="text-slate-800 font-bold hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}