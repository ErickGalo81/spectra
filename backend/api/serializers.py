from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Aluno, PEI, EvolucaoDiaria

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name']

class EvolucaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvolucaoDiaria
        fields = '__all__'

class PEISerializer(serializers.ModelSerializer):
    aluno_nome = serializers.ReadOnlyField(source='aluno.nome')

    class Meta:
        model = PEI
        fields = '__all__'

class AlunoSerializer(serializers.ModelSerializer):
    professor_nome = serializers.ReadOnlyField(source='professor.first_name')
    
    class Meta:
        model = Aluno
        fields = '__all__'