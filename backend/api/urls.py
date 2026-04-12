from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegistroUsuarioView, ProfessorViewSet, AlunoViewSet, 
    PEIViewSet, LaudoMedicoViewSet, EvolucaoViewSet
)

# O Router cria todas as rotas CRUD automaticamente para os seus ViewSets
router = DefaultRouter()
router.register(r'professores', ProfessorViewSet, basename='professor')
router.register(r'alunos', AlunoViewSet, basename='aluno')
router.register(r'peis', PEIViewSet, basename='pei')
router.register(r'laudos', LaudoMedicoViewSet, basename='laudo')
router.register(r'evolucoes', EvolucaoViewSet, basename='evolucao')

urlpatterns = [
    # A Rota específica de cadastro que criamos
    path('usuarios/registrar/', RegistroUsuarioView.as_view(), name='registrar_usuario'),
    
    # Adicionando todas as rotas geradas pelo Router
    path('', include(router.urls)),
]