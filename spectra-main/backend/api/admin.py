from django.contrib import admin
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria

admin.site.register(Professor)
admin.site.register(Aluno)
admin.site.register(PEI)
admin.site.register(LaudoMedico)
admin.site.register(EvolucaoDiaria)