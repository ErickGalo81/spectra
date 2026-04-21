'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function CriarPlanoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nome: '',
    diagnostico: '',
    comunicacao: 50,
    humor: 50,
    social: 50,
    motor: 50
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('spectra_token');

    try {
      await axios.post('http://localhost:8000/api/alunos/', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/planos-ativos');
    } catch (err) {
      console.error(err);
      alert("Erro ao criar plano. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      {/* Cabeçalho Padronizado (Igual ao Planos Ativos) */}
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
              <Link href="/home" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium transition-all">Início</Link>
              <Link href="/cadastrar-aluno" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium transition-all">Cadastrar</Link>
              <Link href="/planos-ativos" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md font-medium transition-all">Planos</Link>
              <Link href="/sobre" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md font-medium transition-all">Sobre</Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border text-slate-600 font-medium italic">PM</div>
              <span className="hidden md:block text-slate-700 font-medium text-base">Prof. Marcos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white w-full rounded-[32px] px-8 py-10 flex flex-col shadow-sm border border-slate-200">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Criar Novo Plano</h1>
            <p className="text-slate-500 text-sm font-medium italic">Preencha os dados para gerar o protocolo SOS automático</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Campos de Texto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 font-semibold text-sm ml-1">Nome do Aluno</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Erick Daniel"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-700"
                  onChange={(e) => setForm({...form, nome: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 font-semibold text-sm ml-1">Diagnóstico Principal</label>
                <select 
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-700 appearance-none cursor-pointer"
                  onChange={(e) => setForm({...form, diagnostico: e.target.value})}
                >
                  <option value="">Selecione um diagnóstico...</option>
                  <option value="Autismo (TEA)">Autismo (TEA)</option>
                  <option value="TDAH">TDAH</option>
                  <option value="Autismo e TDAH">Autismo e TDAH</option>
                  <option value="Deficiência Intelectual">Deficiência Intelectual</option>
                  <option value="Geral">Geral / Outros</option>
                </select>
              </div>
            </div>

            {/* Sliders com as cores do gráfico original */}
            <div className="space-y-6">
              <h3 className="text-slate-800 font-semibold text-lg flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
                Níveis de Desenvolvimento Iniciais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-slate-50/50 p-8 rounded-[24px] border border-slate-100">
                {[
                  { id: 'comunicacao', label: 'Comunicação', color: 'accent-indigo-500' },
                  { id: 'humor', label: 'Humor', color: 'accent-teal-400' },
                  { id: 'social', label: 'Social', color: 'accent-violet-400' },
                  { id: 'motor', label: 'Motor', color: 'accent-amber-400' },
                ].map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <span>{item.label}</span>
                      <span className="text-indigo-600">{(form as any)[item.id]}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={(form as any)[item.id]}
                      className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${item.color}`}
                      onChange={(e) => setForm({...form, [item.id]: parseInt(e.target.value)})}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Botões - Cores do sistema original */}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
              >
                {loading ? 'Sincronizando...' : 'Gerar Plano PEI'}
              </button>
              
              <Link 
                href="/planos-ativos" 
                className="flex-1 text-center py-3.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}