from django.contrib import admin
# Adicione o ProtocoloCrise aqui na lista de importação:
from .models import Professor, Aluno, ProtocoloCrise, LaudoMedico, PEI, EvolucaoDiaria

admin.site.register(Professor)
admin.site.register(Aluno)
admin.site.register(ProtocoloCrise) # Agora ele vai reconhecer o nome!
admin.site.register(LaudoMedico)
admin.site.register(PEI)
admin.site.register(EvolucaoDiaria)