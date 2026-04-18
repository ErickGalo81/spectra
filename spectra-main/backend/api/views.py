from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria

# ==========================================
# 1. LOGICA DE CADASTRO (PROFESSOR)
# ==========================================
class RegistroUsuarioView(APIView):
    # AllowAny: Permite que qualquer pessoa acesse para se cadastrar
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            # Criando o usuário base do Django
            # O Frontend deve enviar: nome, email, password, instituicao
            user = User.objects.create_user(
                username=data.get('email'), # Usamos o email como login
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('nome', '')
            )
            
            # Criando o perfil do Professor vinculado ao usuário
            # Aqui é onde salvamos a INSTITUIÇÃO que você queria
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
# Isso permite criar, editar, listar e deletar via API

from .serializers import (
    ProfessorSerializer, AlunoSerializer, PEISerializer, 
    LaudoMedicoSerializer, EvolucaoDiariaSerializer
)

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    
    # Filtra para o professor logado ver apenas os SEUS alunos
    def get_queryset(self):
        return Aluno.objects.filter(professor__user=self.request.user)

class LaudoMedicoViewSet(viewsets.ModelViewSet):
    queryset = LaudoMedico.objects.all()
    serializer_class = LaudoMedicoSerializer

class PEIViewSet(viewsets.ModelViewSet):
    queryset = PEI.objects.all()
    serializer_class = PEISerializer

class EvolucaoViewSet(viewsets.ModelViewSet):
    queryset = EvolucaoDiaria.objects.all()
    serializer_class = EvolucaoDiariaSerializer