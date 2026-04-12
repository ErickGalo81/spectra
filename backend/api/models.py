from django.db import models
from django.contrib.auth.models import User
import uuid

# Criamos o modelo de Professor para separar do User se necessário futuramente
class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    especialidade = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Aluno(models.Model):
    # O professor que cadastrou (importante para ele não ver alunos de outros professores)
    professor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alunos')
    
    nome_completo = models.CharField(max_length=255)
    
    # Deixando email e matricula opcionais (blank=True, null=True) para evitar erros
    email_institucional = models.EmailField(unique=True, blank=True, null=True)
    matricula = models.CharField(max_length=50, blank=True, null=True)
    
    # Deixando idade opcional por enquanto (ou você adiciona o campo no Next.js depois)
    idade = models.PositiveIntegerField(blank=True, null=True) 
    
    foto = models.ImageField(upload_to='alunos/fotos/', null=True, blank=True)
    cadastrado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.matricula or 'S/MAT'} - {self.nome_completo}"

    def save(self, *args, **kwargs):
        if not self.matricula:
            # Gera uma matrícula única baseada no ano + UUID curto
            import datetime
            ano = datetime.datetime.now().year
            codigo = str(uuid.uuid4().hex[:6]).upper()
            self.matricula = f"MAT{ano}{codigo}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.matricula} - {self.nome_completo}"

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
        return f"{self.tipo} - {self.aluno.nome_completo}"