from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria

# ==========================================
# USUÁRIO E PROFESSOR
# ==========================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        # Esconde a senha para ela nunca ser vazada/devolvida nas respostas da API
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Usamos create_user em vez do padrão para garantir que a senha 
        # seja salva criptografada (hash) no banco de dados!
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class ProfessorSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Professor
        fields = ['id', 'user', 'user_details', 'especialidade']


# ==========================================
# ALUNOS
# ==========================================
class AlunoSerializer(serializers.ModelSerializer):
    # Pegando o nome do professor (User) para facilitar a exibição no Front-end
    professor_nome = serializers.ReadOnlyField(source='professor.first_name')
    
    class Meta:
        model = Aluno
        fields = '__all__'
        # IMPORTANTÍSSIMO: 
        # O Next.js não vai mandar o "professor". Nós vamos pegar ele pelo Token na View.
        # Por isso, marcamos como read_only_fields.
        read_only_fields = ['professor', 'cadastrado_em', 'matricula']


# ==========================================
# PEI, LAUDOS E EVOLUÇÃO
# ==========================================
class PEISerializer(serializers.ModelSerializer):
    # Ajustado para nome_completo que é o que está no seu model Aluno
    aluno_nome = serializers.ReadOnlyField(source='aluno.nome_completo')

    class Meta:
        model = PEI
        fields = '__all__'

class LaudoMedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaudoMedico
        fields = '__all__'

class EvolucaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvolucaoDiaria
        fields = '__all__'