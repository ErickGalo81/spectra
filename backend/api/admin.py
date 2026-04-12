from django.contrib import admin
from .models import Aluno, PEI, EvolucaoDiaria, LaudoMedico

admin.site.register(Aluno)
admin.site.register(PEI)
admin.site.register(EvolucaoDiaria)
admin.site.register(LaudoMedico)