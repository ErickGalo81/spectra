from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegistroUsuarioView, 
    MeView,             # 1. Adicionamos a importação da nova View
    ProfessorViewSet, 
    AlunoViewSet, 
    PEIViewSet, 
    LaudoMedicoViewSet, 
    EvolucaoViewSet
)

# O Router cria todas as rotas CRUD automaticamente
router = DefaultRouter()
router.register(r'professores', ProfessorViewSet, basename='professor')
router.register(r'alunos', AlunoViewSet, basename='aluno')
router.register(r'peis', PEIViewSet, basename='pei')
router.register(r'laudos', LaudoMedicoViewSet, basename='laudo')
router.register(r'evolucoes', EvolucaoViewSet, basename='evolucao')

urlpatterns = [
    # --- ROTA DE IDENTIDADE (Quem sou eu?) ---
    # É aqui que o Next.js vai buscar o nome do professor logado
    path('me/', MeView.as_view(), name='me'), 

    # --- ROTA DE CADASTRO ---
    path('register/', RegistroUsuarioView.as_view(), name='registrar_usuario'),
    
    # --- ROTAS DE LOGIN (JWT) ---
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # --- DEMAIS ROTAS (CRUD) ---
    path('', include(router.urls)),
]