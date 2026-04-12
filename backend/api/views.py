from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User

from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria
from .serializers import (
    ProfessorSerializer, AlunoSerializer, PEISerializer, 
    LaudoMedicoSerializer, EvolucaoSerializer, UserSerializer
)

# ==========================================
# 1. VIEW DE CADASTRO (Aberto para o Next.js)
# ==========================================
class RegistroUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # Permite que pessoas sem login possam criar a conta
    permission_classes = [AllowAny] 

# ==========================================
# 2. VIEWSETS PROTEGIDOS (Precisam do Token JWT)
# ==========================================

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [IsAuthenticated]

class AlunoViewSet(viewsets.ModelViewSet):
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated] # Trava a porta!

    def get_queryset(self):
        # SEGURANÇA: O professor só vê a lista dos SEUS alunos, e não os de outros professores.
        return Aluno.objects.filter(professor=self.request.user)

    def perform_create(self, serializer):
        # MÁGICA: Pega o professor dono do Token e amarra ao aluno que está sendo salvo.
        serializer.save(professor=self.request.user)

class PEIViewSet(viewsets.ModelViewSet):
    queryset = PEI.objects.all()
    serializer_class = PEISerializer
    permission_classes = [IsAuthenticated]

class LaudoMedicoViewSet(viewsets.ModelViewSet):
    queryset = LaudoMedico.objects.all()
    serializer_class = LaudoMedicoSerializer
    permission_classes = [IsAuthenticated]

class EvolucaoViewSet(viewsets.ModelViewSet):
    queryset = EvolucaoDiaria.objects.all()
    serializer_class = EvolucaoSerializer
    permission_classes = [IsAuthenticated]