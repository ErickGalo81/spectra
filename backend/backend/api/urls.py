from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfessorViewSet, AlunoViewSet, PEIViewSet, 
    LaudoMedicoViewSet, EvolucaoViewSet
)

# O Router cria automaticamente todas as rotas de GET, POST, PUT e DELETE
router = DefaultRouter()
router.register(r'professores', ProfessorViewSet)
router.register(r'alunos', AlunoViewSet)
router.register(r'peis', PEIViewSet)
router.register(r'laudos', LaudoMedicoViewSet)
router.register(r'evolucoes', EvolucaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]