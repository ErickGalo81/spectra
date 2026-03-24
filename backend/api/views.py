from rest_framework import viewsets
from .models import Aluno, PEI
from .serializers import AlunoSerializer, PEISerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

# NOVA VIEW
class PEIViewSet(viewsets.ModelViewSet):
    queryset = PEI.objects.all()
    serializer_class = PEISerializer