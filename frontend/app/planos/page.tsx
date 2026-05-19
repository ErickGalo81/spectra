"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CriarPlanoPage() {
  const router = useRouter();
  
  const [alunos, setAlunos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState({ nome: "Carregando...", iniciais: ".." });
  
  // Campos do Formulário
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [nomePlano, setNomePlano] = useState(""); 
  const [diagnostico, setDiagnostico] = useState(""); 
  const [objetivos, setObjetivos] = useState("");
  const [metodologia, setMetodologia] = useState("");
  const [comunicacao, setComunicacao] = useState(50);
  const [humor, setHumor] = useState(50);
  const [social, setSocial] = useState(50);
  const [motor, setMotor] = useState(50);
  
  const [protocolos, setProtocolos] = useState<string[]>([]);

  // Estados de Controle, Inteligência e Notificação
  const [loading, setLoading] = useState(false);
  const [notificacao, setNotificacao] = useState({ texto: "", tipo: "" });
  
  const [ultimaMetodologiaSugerida, setUltimaMetodologiaSugerida] = useState("");
  const [ultimoDiagnosticoDetectado, setUltimoDiagnosticoDetectado] = useState("");

  // 1. EFEITO PARA CARREGAR DADOS INICIAIS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("spectra_token");
        if (!token) {
          router.push('/');
          return;
        }
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const resUser = await axios.get("http://localhost:8000/api/me/", config);
        setUsuario({ 
          nome: resUser.data.nome || resUser.data.username, 
          iniciais: (resUser.data.nome || "User").split(" ").map((n:any) => n[0]).join("").toUpperCase().slice(0, 2)
        });

        const resAlunos = await axios.get("http://localhost:8000/api/alunos/", config);
        setAlunos(resAlunos.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    fetchData();
  }, [router]);

  // 2. EFEITO QUANDO O PROFESSOR TROCA DE ALUNO
  useEffect(() => {
    if (alunoSelecionadoId && alunos.length > 0) {
      const aluno = alunos.find(a => a.id.toString() === alunoSelecionadoId.toString());

      if (aluno) {
        setObjetivos("");
        setMetodologia("");
        setProtocolos([]);
        setUltimaMetodologiaSugerida("");
        setUltimoDiagnosticoDetectado("");

        if (aluno.diagnostico && aluno.diagnostico !== "Pendente") {
          setDiagnostico(aluno.diagnostico);
        } else {
          setDiagnostico("");
        }
      }
    }
  }, [alunoSelecionadoId, alunos]); 

  // 3. 🌟 MOTOR INTELIGENTE SPECTRA (Com Passo a Passo Integrado)
  useEffect(() => {
    if (!diagnostico) return;

    const diagLower = diagnostico.toLowerCase();
    let sugestao = null;

    if (diagLower.includes("tea") || diagLower.includes("autismo")) {
      sugestao = {
        tipo: "TEA",
        met: "🔹 DIRETRIZES GERAIS:\n• Uso de apoio visual (rotinas em imagens, PECS).\n• Instruções curtas, diretas e literais.\n• Tempo estendido para atividades e pareamento de interesses.\n\n👣 PASSO A PASSO PARA O PROFESSOR:\n1. Acolhimento: Ao iniciar a aula, mostre visualmente (no quadro ou em cartão) qual será a rotina do dia.\n2. Antecipação: Avise com 5 a 10 minutos de antecedência antes de mudar de atividade (ex: 'Daqui a pouco vamos guardar os cadernos').\n3. Execução: Divida a atividade principal em pequenas partes. Entregue uma parte por vez para não sobrecarregar visualmente.\n4. Engajamento: Intercale uma tarefa de baixo interesse com uma do hiperfoco/interesse do aluno.\n5. Conclusão: Valide o esforço de forma visual e concreta (ex: marcar um 'X' na tarefa concluída, colocar na pasta de 'feitos').",
        prot: [
          "Reduzir imediatamente estímulos sensoriais (luzes fortes, barulho) e oferecer abafador de ruídos.",
          "Evitar toques físicos não antecipados e não exigir contato visual durante a desregulação.",
          "Utilizar comunicação alternativa (cartões, gestos simples) caso o aluno perca a capacidade de fala na crise.",
          "Conduzir o aluno de forma calma para um espaço de regulação ou canto do silêncio preestabelecido."
        ]
      };
    } else if (diagLower.includes("tdah") || diagLower.includes("déficit de atenção")) {
      sugestao = {
        tipo: "TDAH",
        met: "🔹 DIRETRIZES GERAIS:\n• Segmentação de tarefas longas em etapas menores (Chunking).\n• Uso de material lúdico e interativo.\n• Assento próximo ao professor e longe de distrações (janelas/portas).\n\n👣 PASSO A PASSO PARA O PROFESSOR:\n1. Posicionamento: Certifique-se de que o aluno está prestando atenção em você (contato visual) antes de dar a instrução global.\n2. Instrução: Fale de forma clara, dê uma instrução por vez e peça para ele repetir o que deve ser feito para checar o entendimento.\n3. Ação: Entregue a atividade dividida em blocos curtos (ex: 'Faça apenas as questões 1 e 2 agora e me mostre').\n4. Respiro: A cada 15-20 minutos, crie uma 'pausa com propósito' (ex: pedir para ele apagar o quadro, distribuir cadernos ou buscar água).\n5. Reforço: Elogie o processo e a concentração imediatamente após ele terminar um bloco de tarefas, mantendo-o motivado.",
        prot: [
          "Fazer uma pausa estratégica imediata (time-out positivo) sem conotação de castigo.",
          "Propor uma atividade motora leve (ex: pedir ajuda para buscar água, apagar o quadro, levar um recado).",
          "Falar com tom de voz baixo, neutro e usar frases muito curtas e objetivas.",
          "Redirecionar a atenção do aluno utilizando algo do interesse pessoal dele."
        ]
      };
    } else if (diagLower.includes("tod") || diagLower.includes("opositor")) {
      sugestao = {
        tipo: "TOD",
        met: "🔹 DIRETRIZES GERAIS:\n• Foco em reforço positivo contínuo para comportamentos adequados.\n• Contratos pedagógicos claros com recompensas e consequências combinadas previamente.\n• Evitar advertências, embates verbais ou confrontos diretos em público.\n\n👣 PASSO A PASSO PARA O PROFESSOR:\n1. Conexão Inicial: Cumprimente o aluno de forma positiva e receptiva antes de exigir qualquer tarefa do dia.\n2. Oferta de Escolha: Ao invés de mandar fazer algo, dê opções limitadas que levem ao mesmo resultado (ex: 'Você quer começar lendo o texto ou respondendo a primeira questão?').\n3. Instrução Neutra: Dê as diretrizes da atividade de forma calma, sem tom de desafio, e saia de perto para dar espaço e tempo de processamento.\n4. Validação: Assim que ele começar a executar corretamente, reforce positivamente com um elogio discreto e específico.\n5. Correção: Se houver recusa, aplique a consequência combinada no contrato pedagógico de forma impessoal e zero emocional ('Como combinamos antes, isso significa que...').",
        prot: [
          "Manter postura neutra, não reagir emocionalmente e evitar embates verbais durante o pico da crise.",
          "Garantir a segurança física do aluno e afastar os colegas ao redor se houver risco.",
          "Oferecer duas escolhas fechadas para devolver a sensação de controle.",
          "Validar o sentimento de frustração do aluno, mas manter o limite comportamental estabelecido com firmeza e calma."
        ]
      };
    } else if (diagLower.includes("dislexia") || diagLower.includes("aprendizagem")) {
      sugestao = {
        tipo: "Dislexia / T.A.",
        met: "🔹 DIRETRIZES GERAIS:\n• Avaliação oral como alternativa ou complemento essencial à escrita.\n• Uso de fontes ampliadas (ex: Arial, OpenDyslexic), espaçadas e textos justificados à esquerda.\n• Evitar sob qualquer hipótese pedir leitura em voz alta não planejada na frente da turma.\n\n👣 PASSO A PASSO PARA O PROFESSOR:\n1. Apresentação: Introduza o novo assunto usando recursos visuais, vídeos ou mapas mentais antes de ir diretamente para o texto escrito.\n2. Adaptação do Material: Entregue a atividade impressa com fonte maior, espaçamento duplo e destaque (negrito) nas palavras-chave mais importantes.\n3. Apoio na Leitura: Se houver enunciados longos ou complexos, leia em voz alta para ele ou coloque-o em dupla com um colega facilitador.\n4. Checagem de Entendimento: Peça para ele explicar oralmente o que entendeu sobre o assunto antes de começar a escrever as respostas.\n5. Avaliação Flexível: Na correção, foque em avaliar o conteúdo do que ele sabe, relevando erros ortográficos de inversão de letras ou omissões.",
        prot: [
          "Acolhimento imediato frente à frustração evidente por dificuldade em tarefas de leitura/escrita.",
          "Suspensão temporária da tarefa causadora do estresse cognitivo excessivo.",
          "Redirecionar para uma atividade onde o aluno tenha sucesso garantido para recuperar a autoestima e a regulação.",
          "Oferecer ajuda individualizada de forma discreta, sem expor a dificuldade aos colegas."
        ]
      };
    }

    if (sugestao) {
      const podeSobrescrever = metodologia === "" || metodologia === ultimaMetodologiaSugerida;

      if (podeSobrescrever && ultimoDiagnosticoDetectado !== sugestao.tipo) {
        setMetodologia(sugestao.met);
        setProtocolos(sugestao.prot);
        
        setUltimaMetodologiaSugerida(sugestao.met);
        setUltimoDiagnosticoDetectado(sugestao.tipo);

        setNotificacao({ 
          texto: `✨ O SPECTRA adaptou o Passo a Passo e os Protocolos para ${sugestao.tipo}!`, 
          tipo: "sucesso" 
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnostico, metodologia, ultimaMetodologiaSugerida, ultimoDiagnosticoDetectado]); 

  // Funções de controle do Protocolo de Crise
  const adicionarPasso = () => setProtocolos([...protocolos, ""]);
  const atualizarPasso = (index: number, valor: string) => {
    const novos = [...protocolos];
    novos[index] = valor;
    setProtocolos(novos);
  };
  const removerPasso = (index: number) => setProtocolos(protocolos.filter((_, i) => i !== index));

  const handleSalvarPlano = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotificacao({ texto: "", tipo: "" }); 

    try {
      const token = localStorage.getItem("spectra_token");
      const payload = {
        aluno: alunoSelecionadoId,
        nome_plano: nomePlano,
        diagnostico: diagnostico,
        objetivos,
        metodologia,
        comunicacao,
        humor,
        social,
        motor,
        protocolo_crise: protocolos.filter(p => p.trim() !== "") 
      };
      await axios.post("http://localhost:8000/api/peis/", payload, { headers: { Authorization: `Bearer ${token}` } });
      
      setNotificacao({ texto: "✅ Plano e Protocolo salvos com sucesso!", tipo: "sucesso" });
      setTimeout(() => {
        router.push("/planos-ativos");
      }, 1500);

    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setNotificacao({ texto: "⚠️ Sua sessão expirou. Redirecionando para login...", tipo: "erro" });
        setTimeout(() => router.push("/"), 2000);
      } else if (err.response?.status === 400) {
        setNotificacao({ texto: "⚠️ Os dados informados são inválidos. Revise o preenchimento.", tipo: "erro" });
      } else {
        setNotificacao({ texto: "⚠️ Erro de comunicação com o servidor ao tentar salvar o PEI. Tente novamente.", tipo: "erro" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center">
      
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tighter">
              🧠 SPECTRA
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5d5fef] flex items-center justify-center text-white font-bold shadow-md border border-[#4a4be0]">
              {usuario.iniciais}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-slate-900 font-bold text-sm leading-none">{usuario.nome}</span>
              <span className="text-[#5d5fef] text-[10px] font-black uppercase mt-1 tracking-wider">Professor</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-4 pb-12">
        <div className="bg-white rounded-[40px] px-10 py-12 shadow-md border border-slate-200 relative">
          
          <button 
            onClick={() => router.push('/planos-ativos')}
            className="absolute left-10 top-10 flex items-center gap-2 text-slate-400 hover:text-[#5d5fef] transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Voltar</span>
          </button>

          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Novo Plano</h1>
            <p className="text-slate-600 text-sm font-medium">Configure as diretrizes do PEI e o Manejo de Crise</p>
          </div>

          {notificacao.texto && (
            <div className={`w-full p-4 mb-8 rounded-xl text-sm font-bold text-center shadow-sm border transition-all ${
              notificacao.tipo === 'sucesso' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {notificacao.texto}
            </div>
          )}

          <form onSubmit={handleSalvarPlano} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[32px] border border-slate-200 shadow-inner">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Selecionar Aluno</label>
                <select 
                  className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-[#5d5fef] transition-all shadow-sm text-slate-900"
                  value={alunoSelecionadoId}
                  onChange={(e) => setAlunoSelecionadoId(e.target.value)}
                  required
                >
                  <option value="">Escolha um aluno...</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Título do Plano</label>
                <input 
                  type="text" 
                  placeholder="Ex: Plano Semestral"
                  className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-[#5d5fef] transition-all shadow-sm text-slate-900 placeholder-slate-400"
                  value={nomePlano}
                  onChange={(e) => setNomePlano(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Diagnóstico</label>
                <input 
                  type="text" 
                  placeholder="Ex: TEA, TDAH, TOD..."
                  className="w-full font-bold text-sm p-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-[#5d5fef] transition-all shadow-sm text-slate-900 placeholder-slate-400"
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border-2 border-slate-200 shadow-lg">
              <h2 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-[0.2em] text-center">Evolução do Aluno</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { label: "Comunicação", val: comunicacao, set: setComunicacao },
                  { label: "Humor", val: humor, set: setHumor },
                  { label: "Socialização", val: social, set: setSocial },
                  { label: "Motor", val: motor, set: setMotor }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{item.label}</span>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{item.val}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100"
                      value={item.val} 
                      onChange={(e) => item.set(Number(e.target.value))} 
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5d5fef] border border-slate-300" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">
                  🎯 Objetivos a alcançar
                </label>
                <textarea 
                  className="w-full text-sm p-6 bg-slate-50 border-2 border-slate-200 rounded-[30px] outline-none focus:border-[#5d5fef] focus:bg-white min-h-[120px] resize-none shadow-sm transition-all text-slate-900 font-bold"
                  placeholder="Quais as metas pedagógicas?"
                  value={objetivos}
                  onChange={(e) => setObjetivos(e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">
                  🛠️ Metodologia Aplicada & Passo a Passo
                </label>
                
                {metodologia === ultimaMetodologiaSugerida && ultimaMetodologiaSugerida !== "" && (
                   <p className="text-[11px] text-[#5d5fef] font-bold mb-2 ml-4">
                     ✨ Plano de ação estruturado pelo SPECTRA. Sinta-se à vontade para editar.
                   </p>
                )}

                {/* 🌟 AUMENTEI O MIN-H PARA 250PX PARA ACOMODAR O PASSO A PASSO COM CONFORTO */}
                <textarea 
                  className="w-full text-sm p-6 bg-slate-50 border-2 border-slate-200 rounded-[30px] outline-none focus:border-[#5d5fef] focus:bg-white min-h-[280px] resize-none shadow-sm transition-all text-slate-900 font-bold leading-relaxed whitespace-pre-line"
                  placeholder="Como o conteúdo será adaptado e executado em sala?"
                  value={metodologia}
                  onChange={(e) => setMetodologia(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] block mb-6 ml-4">
                🚨 Protocolo de Manejo de Crise
              </label>
              
              {ultimoDiagnosticoDetectado && protocolos.length > 0 && (
                 <p className="text-[11px] text-[#5d5fef] font-bold mb-4 ml-4">
                   ✨ Protocolos sugeridos para {ultimoDiagnosticoDetectado}. Adicione, edite ou remova passos.
                 </p>
              )}

              <div className="space-y-4 bg-slate-50 p-8 rounded-[40px] border-2 border-slate-200 shadow-sm">
                {protocolos.map((passo, index) => (
                  <div key={index} className="flex gap-4 items-center group animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#5d5fef] text-white shadow-md flex items-center justify-center font-bold text-sm shrink-0 border border-[#4a4be0]">
                      {index + 1}
                    </div>
                    <textarea
                      value={passo}
                      onChange={(e) => atualizarPasso(index, e.target.value)}
                      placeholder="Passo de intervenção..."
                      className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm outline-none focus:border-[#5d5fef] transition-all shadow-sm font-bold text-slate-900 resize-none min-h-[60px]"
                    />
                    <button 
                      type="button" 
                      onClick={() => removerPasso(index)}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={adicionarPasso}
                  className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-[#5d5fef] hover:border-[#5d5fef] transition-all bg-white"
                >
                  + ADICIONAR PASSO AO PROTOCOLO
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-6 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[24px] transition-all shadow-xl ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#5d5fef] hover:brightness-110 active:scale-95'
              }`}
            >
              {loading ? 'Salvando no Banco...' : 'Finalizar e Salvar PEI'}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}