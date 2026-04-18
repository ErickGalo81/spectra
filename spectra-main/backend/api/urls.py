from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # Importante para o Login

from .views import (
    RegistroUsuarioView, ProfessorViewSet, AlunoViewSet, 
    PEIViewSet, LaudoMedicoViewSet, EvolucaoViewSet
)

# O Router cria todas as rotas CRUD automaticamente
router = DefaultRouter()
router.register(r'professores', ProfessorViewSet, basename='professor')
router.register(r'alunos', AlunoViewSet, basename='aluno')
router.register(r'peis', PEIViewSet, basename='pei')
router.register(r'laudos', LaudoMedicoViewSet, basename='laudo')
router.register(r'evolucoes', EvolucaoViewSet, basename='evolucao')

urlpatterns = [
    # --- ROTA DE CADASTRO ---
    path('register/', RegistroUsuarioView.as_view(), name='registrar_usuario'),
    
    # --- ROTAS DE LOGIN (JWT) ---
    # É aqui que o Daniel vai enviar o email/senha para entrar no sistema
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # --- DEMAIS ROTAS ---
    path('', include(router.urls)),
]