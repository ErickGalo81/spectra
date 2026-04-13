from rest_framework import serializers
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name']

class ProfessorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Professor
        fields = ['id', 'user', 'instituicao', 'especialidade']

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'
        read_only_fields = ['professor']

class LaudoMedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaudoMedico
        fields = '__all__'
        

class PEISerializer(serializers.ModelSerializer):
    class Meta:
        model = PEI
        fields = '__all__'

class EvolucaoDiariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvolucaoDiaria
        fields = '__all__'