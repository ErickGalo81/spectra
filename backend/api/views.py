from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Aluno, PEI, EvolucaoDiaria
from .serializers import AlunoSerializer, PEISerializer, EvolucaoSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

class PEIViewSet(viewsets.ModelViewSet):
    queryset = PEI.objects.all()
    serializer_class = PEISerializer

class EvolucaoViewSet(viewsets.ModelViewSet):
    queryset = EvolucaoDiaria.objects.all()
    serializer_class = EvolucaoSerializer