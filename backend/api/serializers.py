from rest_framework import serializers
from .models import Aluno, PEI

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'

# NOVO SERIALIZER
class PEISerializer(serializers.ModelSerializer):
    # Isso traz o nome do aluno junto com o ID na hora de listar
    aluno_nome = serializers.ReadOnlyField(source='aluno.nome') 

    class Meta:
        model = PEI
        fields = '__all__'