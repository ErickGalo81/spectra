'use client'; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function CadastroPage() {
  const router = useRouter();

  // Estados para capturar tudo que o usuário digita
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [instituicao, setInstituicao] = useState(''); // Opcional, por enquanto visual
  const [termosAceitos, setTermosAceitos] = useState(false);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleCadastro = async () => {
    setErro('');

    // 1. Validações Locais
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem. Digite novamente.");
      return;
    }

    if (!termosAceitos) {
      setErro("Você precisa aceitar os Termos de Uso para se cadastrar.");
      return;
    }

    setLoading(true);

    try {
      // 2. Envio para o Django
      // (Nota: Estamos enviando username, email, password e first_name conforme nosso Serializer)
      const resposta = await axios.post('http://localhost:8000/api/usuarios/registrar/', {
        username: email, 
        email: email,
        password: senha,
        first_name: nome
      });

      if (resposta.status === 201) {
        // Sucesso!
        alert("Cadastro realizado com sucesso! Faça seu login.");
        router.push('/'); 
      }
    } catch (err: any) {
      // 3. Tratamento de Erros do Servidor
      if (err.response && err.response.data) {
        // O Django devolve os erros em formato de objeto JSON, transformamos em string para exibir
        setErro(JSON.stringify(err.response.data)); 
      } else {
        setErro('Erro de conexão. Verifique se o servidor Django está rodando na porta 8000.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
      
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
          🧠 SPECTRA
        </span>
      </div>

      {/* Card Principal */}
      <div className="bg-slate-100 w-full max-w-4xl rounded-[40px] px-8 py-10 flex flex-col items-center shadow-sm">
        
        <h1 className="text-4xl font-medium text-slate-800 mb-3 text-center">
          Crie sua conta no Spectra!
        </h1>
        <p className="text-lg text-slate-600 mb-8 text-center">
          Preencha seus dados institucionais para acessar o sistema.
        </p>

        {/* Caixa de Erro (Só aparece se algo der errado) */}
        {erro && (
          <div className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium text-center shadow-sm">
            {erro}
          </div>
        )}

        <form className="w-full flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Nome Completo */}
            <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400 transition-all">
              <span className="text-gray-400 text-lg mr-3">👤</span>
              <input 
                type="text" 
                placeholder="Nome Completo" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500" 
              />
            </div>

            {/* E-mail */}
            <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400 transition-all">
              <span className="text-gray-400 text-lg mr-3">✉️</span>
              <input 
                type="email" 
                placeholder="E-mail Institucional" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500" 
              />
            </div>

            {/* Senha */}
            <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400 transition-all">
              <span className="text-gray-400 text-lg mr-3">🔒</span>
              <input 
                type="password" 
                placeholder="Senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500" 
              />
            </div>

            {/* Confirmar Senha */}
            <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-400 transition-all">
              <span className="text-gray-400 text-lg mr-3">🛡️</span>
              <input 
                type="password" 
                placeholder="Confirmar Senha" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500" 
              />
            </div>

            {/* Instituição de Ensino */}
            <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 shadow-sm md:col-span-1 focus-within:ring-2 focus-within:ring-slate-400 transition-all">
              <span className="text-gray-400 text-lg mr-3">🏢</span>
              <input 
                type="text" 
                placeholder="Instituição de Ensino" 
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500" 
              />
            </div>

            {/* Termos de Uso */}
            <div className="flex items-center gap-3 px-2 md:col-span-1">
              <input 
                type="checkbox" 
                checked={termosAceitos}
                onChange={(e) => setTermosAceitos(e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 accent-slate-800 cursor-pointer shrink-0" 
              />
              <label className="text-sm text-gray-700 leading-tight cursor-pointer" onClick={() => setTermosAceitos(!termosAceitos)}>
                Eu concordo com os Termos de Uso e Política de Privacidade
              </label>
            </div>

          </div>

          {/* Botão de Submeter */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleCadastro}
              disabled={loading}
              className={`font-bold text-lg py-4 px-16 rounded-full transition-all shadow-md w-full md:w-auto min-w-[300px] ${
                loading ? 'bg-slate-400 cursor-not-allowed text-slate-100' : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {loading ? 'Processando...' : 'Cadastre-Se'}
            </button>
          </div>

          {/* Link para Login */}
          <p className="mt-2 text-sm text-gray-600 text-center">
            Já tem uma conta?{' '}
            <Link href="/" className="text-slate-800 font-bold hover:underline">
              Faça login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}