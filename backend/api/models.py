from django.db import models

class Aluno(models.Model):
    nome = models.CharField(max_length=150)
    diagnostico = models.CharField(max_length=100, blank=True, null=True)
    observacoes_iniciais = models.TextField(blank=True, null=True)
    cadastrado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

# ADICIONE ESTE NOVO MODELO
class PEI(models.Model):
    # Relacionamento: Se o aluno for apagado, o PEI dele também será (CASCADE)
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='peis')
    metas = models.TextField(help_text="Metas de aprendizagem e comportamento")
    adaptacoes = models.TextField(help_text="Adaptações de material, tempo, ambiente, etc.")
    status = models.CharField(
        max_length=20, 
        choices=[('Em elaboração', 'Em elaboração'), ('Aprovado', 'Aprovado')],
        default='Em elaboração'
    )
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PEI - {self.aluno.nome}"