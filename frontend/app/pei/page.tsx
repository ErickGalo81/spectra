'use client';

import { useState, useEffect } from 'react';

export default function SpectraCRUD() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const fetchAlunos = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/alunos/');
      const data = await res.json();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao buscar alunos. O Django está rodando?", error);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { nome, diagnostico, observacoes_iniciais: observacoes };

    try {
      if (editandoId) {
        await fetch(`http://localhost:8000/api/alunos/${editandoId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setEditandoId(null);
      } else {
        await fetch('http://localhost:8000/api/alunos/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setNome('');
      setDiagnostico('');
      setObservacoes('');
      fetchAlunos();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir o perfil deste aluno?")) return;
    try {
      await fetch(`http://localhost:8000/api/alunos/${id}/`, {
        method: 'DELETE',
      });
      fetchAlunos();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const handleEdit = (aluno: any) => {
    setEditandoId(aluno.id);
    setNome(aluno.nome);
    setDiagnostico(aluno.diagnostico || '');
    setObservacoes(aluno.observacoes_iniciais || '');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome('');
    setDiagnostico('');
    setObservacoes('');
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-indigo-600">SPECTRA</h1>
        <p className="mb-4 text-gray-600">Gestão de Alunos e Acompanhamento Pedagógico (Sprint 03)</p>
        
        <div className="mb-8">
          <a href="/pei" className="inline-block bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-2 px-4 rounded transition duration-200">
            Ir para Gestão de PEIs →
          </a>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editandoId ? `Editando Aluno #${editandoId}` : 'Cadastrar Novo Aluno'}
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nome do Aluno</label>
            <input 
              type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Hipótese Diagnóstica (Opcional)</label>
            <input 
              type="text" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Ex: TEA, TDAH..."
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Observações Iniciais do Professor</label>
            <textarea 
              value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200">
              {editandoId ? 'Atualizar Dossiê' : 'Salvar Aluno'}
            </button>
            {editandoId && (
              <button type="button" onClick={cancelarEdicao} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200">
                Cancelar
              </button>
            )}
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-4">Alunos Acompanhados:</h2>
        <ul className="space-y-4">
          {alunos.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum aluno cadastrado no sistema ainda.</p>
          ) : (
            alunos.map((aluno) => (
              <li key={aluno.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{aluno.nome}</h3>
                  {aluno.diagnostico && <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mt-1 mb-2 font-medium">{aluno.diagnostico}</span>}
                  <p className="text-gray-600 mt-1 text-sm">{aluno.observacoes_iniciais || "Sem observações registradas."}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(aluno)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium py-1 px-2">Editar</button>
                  <button onClick={() => handleDelete(aluno.id)} className="text-red-500 hover:text-red-700 text-sm font-medium py-1 px-2">Excluir</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}