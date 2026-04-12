from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProfessorSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Professor
        fields = ['id', 'user', 'user_details', 'especialidade']

class EvolucaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvolucaoDiaria
        fields = '__all__'

class LaudoMedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaudoMedico
        fields = '__all__'

class PEISerializer(serializers.ModelSerializer):
    # Ajustado para nome_completo que é o que está no seu model
    aluno_nome = serializers.ReadOnlyField(source='aluno.nome_completo')

    class Meta:
        model = PEI
        fields = '__all__'

class AlunoSerializer(serializers.ModelSerializer):
    # Pegando o nome do professor (User)
    professor_nome = serializers.ReadOnlyField(source='professor.first_name')
    
    class Meta:
        model = Aluno
        # 'matricula' entra aqui como read_only automaticamente porque definimos no model como editable=False
        fields = '__all__'