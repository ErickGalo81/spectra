from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlunoViewSet, PEIViewSet

router = DefaultRouter()
router.register(r'alunos', AlunoViewSet)
router.register(r'peis', PEIViewSet) # Nova rota /api/peis/

urlpatterns = [
    path('', include(router.urls)),
]