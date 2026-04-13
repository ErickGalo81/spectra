from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria
from .serializers import (
    ProfessorSerializer, AlunoSerializer, PEISerializer, 
    LaudoMedicoSerializer, EvolucaoDiariaSerializer
)

# ==========================================
# 1. LOGICA DE CADASTRO (PROFESSOR)
# ==========================================
class RegistroUsuarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            user = User.objects.create_user(
                username=data.get('email'), 
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('nome', '')
            )
            
            Professor.objects.create(
                user=user,
                instituicao=data.get('instituicao', 'Não informada'),
                especialidade=data.get('especialidade', '')
            )
            
            return Response(
                {"msg": "Professor cadastrado com sucesso!"}, 
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": f"Erro ao cadastrar: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

# ==========================================
# 2. VIEWSETS (CRUD AUTOMÁTICO)
# ==========================================

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    # Removido o perform_create daqui, pois o professor é criado no RegistroUsuarioView

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    
    # 1. Filtra para o professor logado ver apenas os SEUS alunos
    def get_queryset(self):
        return Aluno.objects.filter(professor__user=self.request.user)

    # 2. ESSA FUNÇÃO RESOLVE O ERRO DE INTEGRITY ERROR:
    # Ela associa o aluno ao professor logado no momento da criação
    def perform_create(self, serializer):
        # self.request.user.perfil pega o objeto Professor do usuário logado
        serializer.save(professor=self.request.user.perfil)

class LaudoMedicoViewSet(viewsets.ModelViewSet):
    queryset = LaudoMedico.objects.all()
    serializer_class = LaudoMedicoSerializer

class PEIViewSet(viewsets.ModelViewSet):
    queryset = PEI.objects.all()
    serializer_class = PEISerializer

class EvolucaoViewSet(viewsets.ModelViewSet):
    queryset = EvolucaoDiaria.objects.all()
    serializer_class = EvolucaoDiariaSerializer