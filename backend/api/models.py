from django.db import models
from django.contrib.auth.models import User

class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    instituicao = models.CharField(max_length=255)
    especialidade = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.instituicao}"


class Aluno(models.Model):
    # O aluno não pertence a um professor específico. Ele é global na instituição.
    nome = models.CharField(max_length=255)
    data_nascimento = models.DateField(null=True, blank=True) 
    matricula = models.CharField(max_length=50, unique=True, blank=True, null=True)
    diagnostico = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nome

    @property
    def sugestao_manejo(self):
        diag = self.diagnostico.upper() if self.diagnostico else ""
        
        if "AUTISMO" in diag or "TEA" in diag:
            return {
                "tipo": "TEA",
                "gatilhos": "Sobrecarga sensorial (barulho, luz), quebra de rotina, comandos verbais muito longos.",
                "passos_crise": [
                    "Reduzir estímulos sensoriais imediatamente (apagar luzes, silenciar o ambiente).",
                    "Usar comunicação direta: frases curtas ou apenas pistas visuais.",
                    "Oferecer um objeto de autorregulação ou o 'cantinho da calma'.",
                    "Evitar toque físico forçado ou contato visual direto durante a desregulação."
                ],
                "aprendizagem": [
                    "Utilizar antecipação visual (cronograma com imagens das tarefas do dia).",
                    "Fragmentar instruções complexas em passos simples e sequenciais.",
                    "Trabalhar com suporte de interesses restritos para aumentar o engajamento.",
                    "Oferecer tempo extra para o processamento da informação verbal."
                ]
            }
        elif "TDAH" in diag:
            return {
                "tipo": "TDAH",
                "gatilhos": "Tarefas repetitivas ou longas, tédio, frustração com erros, excesso de ruídos.",
                "passos_crise": [
                    "Propor uma 'pausa ativa': uma caminhada curta ou uma tarefa motora simples.",
                    "Validar o sentimento: 'Percebo que você está frustrado, vamos tentar de outro jeito'.",
                    "Remover distrações visuais imediatas da mesa do aluno.",
                    "Restabelecer o contato com comandos claros e proximidade física gentil."
                ],
                "aprendizagem": [
                    "Implementar o uso de temporizadores visuais para gerir o tempo das tarefas.",
                    "Permitir que o aluno se movimente ou use objetos de toque (fidgets) durante a explicação.",
                    "Alternar atividades de alto esforço mental com momentos de relaxamento.",
                    "Utilizar checklists para que o aluno sinta o progresso das suas entregas."
                ]
            }
        
        return {
            "tipo": "Geral",
            "gatilhos": "Observar mudanças bruscas no comportamento ou ambiente.",
            "passos_crise": [
                "Manter a calma e garantir a segurança física de todos.",
                "Remover objetos perigosos do entorno.",
                "Aguardar a regulação emocional em silêncio e com postura acolhedora.",
                "Registrar o ocorrido para identificar o padrão do gatilho."
            ],
            "aprendizagem": [
                "Observar o ritmo individual de cada aluno.",
                "Adaptar o material conforme o nível de interesse demonstrado.",
                "Reforçar positivamente as pequenas conquistas diárias."
            ]
        }


class ProtocoloCrise(models.Model):
    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, related_name='protocolo_crise')
    gatilhos_especificos = models.TextField()
    sinais_alerta = models.TextField()
    plano_acao = models.TextField()
    o_que_evitar = models.TextField(blank=True, null=True)
    contato_emergencia = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Protocolo Personalizado: {self.aluno.nome}"


class LaudoMedico(models.Model):
    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, related_name='laudo')
    diagnostico = models.TextField()
    cid = models.CharField(max_length=20)
    data_emissao = models.DateField()
    arquivo = models.FileField(upload_to='laudos/', blank=True, null=True)

    def __str__(self):
        return f"Laudo de {self.aluno.nome}"


class PEI(models.Model):
    # O PEI é o que conecta o Aluno ao Professor naquele momento específico
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='peis')
    professor_responsavel = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True)
    
    # NOVOS CAMPOS ADICIONADOS PARA CORRIGIR OS BUGS
    nome_plano = models.CharField(max_length=255, blank=True, null=True)
    protocolo_crise = models.JSONField(default=list, blank=True, null=True)
    
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    # Níveis de avaliação (movidos do aluno para cá)
    comunicacao = models.IntegerField(default=50)
    humor = models.IntegerField(default=50)
    social = models.IntegerField(default=50)
    motor = models.IntegerField(default=50)
    
    objetivos = models.TextField(blank=True, null=True)
    metodologia = models.TextField(blank=True, null=True)

    def __str__(self):
        # Mostra o nome do plano se existir, senão mostra o padrão
        if self.nome_plano:
            return f"{self.nome_plano} ({self.aluno.nome})"
        return f"PEI de {self.aluno.nome} - {self.data_criacao.strftime('%d/%m/%Y')}"


class EvolucaoDiaria(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='evolucoes')
    data = models.DateField(auto_now_add=True)
    descricao = models.TextField()
    progresso_notado = models.BooleanField(default=False)

    def __str__(self):
        return f"Evolução de {self.aluno.nome} - {self.data}"