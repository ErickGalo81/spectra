from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlunoViewSet, PEIViewSet, EvolucaoViewSet, UserViewSet

router = DefaultRouter()
router.register(r'usuarios', UserViewSet)
router.register(r'alunos', AlunoViewSet)
router.register(r'peis', PEIViewSet)
router.register(r'evolucoes', EvolucaoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]