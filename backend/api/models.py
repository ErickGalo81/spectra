from django.db import models
from django.contrib.auth.models import User

class Aluno(models.Model):
    professor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alunos')
    nome_completo = models.CharField(max_length=255)
    email_institucional = models.EmailField(unique=True)
    escola_matricula = models.CharField(max_length=255)
    idade = models.PositiveIntegerField()
    foto = models.ImageField(upload_to='alunos/fotos/', null=True, blank=True)
    cadastrado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome_completo

class PEI(models.Model):
    STATUS_CHOICES = [
        ('Em elaboração', 'Em elaboração'),
        ('Aprovado', 'Aprovado'),
    ]

    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, related_name='pei')
    diagnostico = models.CharField(max_length=255)
    metas = models.TextField()
    adaptacoes = models.TextField()
    estrategias_pedagogicas = models.TextField()
    nivel_suporte = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3')])
    proxima_revisao = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Em elaboração')
    
    comunicacao_progresso = models.IntegerField(default=0)
    humor_progresso = models.IntegerField(default=0)
    interacao_progresso = models.IntegerField(default=0)
    cognicao_progresso = models.IntegerField(default=0)
    autonomia_progresso = models.IntegerField(default=0)
    
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PEI - {self.aluno.nome_completo}"

class LaudoMedico(models.Model):
    pei = models.ForeignKey(PEI, on_delete=models.CASCADE, related_name='laudos')
    arquivo = models.FileField(upload_to='laudos/')
    nome_arquivo = models.CharField(max_length=255)
    data_upload = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome_arquivo

class EvolucaoDiaria(models.Model):
    TIPO_CHOICES = [
        ('Observação', 'Observação'),
        ('Interação Social', 'Melhora na interação social'),
        ('Nova Estratégia', 'Nova estratégia de apoio'),
        ('Meta Alcançada', 'Meta alcançada'),
    ]

    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='evolucoes')
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    descricao = models.TextField()
    data_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - {self.aluno.nome_completo} - {self.data_registro}"