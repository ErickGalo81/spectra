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
# 1. LÓGICA DE CADASTRO (PROFESSOR)
# ==========================================
class RegistroUsuarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            # Cria o usuário base no Django
            user = User.objects.create_user(
                username=data.get('email'), 
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('nome', '') # Salva o nome vindo do cadastro
            )
            
            # Cria o perfil de Professor vinculado a esse usuário
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
# 2. IDENTIDADE DO USUÁRIO LOGADO (Quem sou eu?)
# ==========================================
class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            # Busca os dados extras na tabela Professor usando o related_name 'perfil'
            professor = user.perfil 
            cargo = professor.especialidade or "Professor"
        except AttributeError:
            cargo = "Administrador"

        return Response({
            "id": user.id,
            "username": user.username,
            "nome": user.first_name, # Enviado para o Dashboard
            "email": user.email,
            "cargo": cargo
        })

# ==========================================
# 3. VIEWSETS (CRUD AUTOMÁTICO)
# ==========================================

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # Garante que o professor só veja os alunos que ele cadastrou
    def get_queryset(self):
        return Aluno.objects.filter(professor__user=self.request.user)

    # Vincula automaticamente o novo aluno ao professor logado
    def perform_create(self, serializer):
        serializer.save(professor=self.request.user.perfil)

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class LaudoMedicoViewSet(viewsets.ModelViewSet):
    queryset = LaudoMedico.objects.all()
    serializer_class = LaudoMedicoSerializer

class PEIViewSet(viewsets.ModelViewSet):
    queryset = PEI.objects.all()
    serializer_class = PEISerializer

class EvolucaoViewSet(viewsets.ModelViewSet):
    queryset = EvolucaoDiaria.objects.all()
    serializer_class = EvolucaoDiariaSerializer