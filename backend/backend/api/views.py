from rest_framework import viewsets
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria
from .serializers import (
    ProfessorSerializer, AlunoSerializer, PEISerializer, 
    LaudoMedicoSerializer, EvolucaoSerializer
)

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

class PEIViewSet(viewsets.ModelViewSet):
    queryset = PEI.objects.all()
    serializer_class = PEISerializer

class LaudoMedicoViewSet(viewsets.ModelViewSet):
    queryset = LaudoMedico.objects.all()
    serializer_class = LaudoMedicoSerializer

class EvolucaoViewSet(viewsets.ModelViewSet):
    queryset = EvolucaoDiaria.objects.all()
    serializer_class = EvolucaoSerializer