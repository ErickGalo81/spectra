from django.db import models
from django.contrib.auth.models import User

class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    instituicao = models.CharField(max_length=255)
    especialidade = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.instituicao}"

class Aluno(models.Model):
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='alunos')
    nome = models.CharField(max_length=255)
    data_nascimento = models.DateField(null=True, blank=True) # Coloque null=True para não travar o cadastro agora
    matricula = models.CharField(max_length=50, unique=True, blank=True, null=True)
    
    # Novos campos para bater com o seu Frontend
    diagnostico = models.CharField(max_length=255, blank=True, null=True)
    comunicacao = models.IntegerField(default=50)
    humor = models.IntegerField(default=50)
    social = models.IntegerField(default=50)
    motor = models.IntegerField(default=50)

    def __str__(self):
        return self.nome

class LaudoMedico(models.Model):
    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, related_name='laudo')
    diagnostico = models.TextField()
    cid = models.CharField(max_length=20, verbose_name="CID")
    data_emissao = models.DateField()
    arquivo = models.FileField(upload_to='laudos/', blank=True, null=True)

    def __str__(self):
        return f"Laudo de {self.aluno.nome}"

class PEI(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='peis')
    data_criacao = models.DateTimeField(auto_now_add=True)
    objetivos = models.TextField()
    metodologia = models.TextField()

    def __str__(self):
        return f"PEI de {self.aluno.nome} ({self.data_criacao.strftime('%d/%m/%Y')})"

class EvolucaoDiaria(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='evolucoes')
    data = models.DateField(auto_now_add=True)
    descricao = models.TextField(verbose_name="Relato do dia")
    progresso_notado = models.BooleanField(default=False)

    def __str__(self):
        return f"Evolução de {self.aluno.nome} - {self.data}"