from rest_framework import serializers
from .models import Professor, Aluno, PEI, LaudoMedico, EvolucaoDiaria, ProtocoloCrise
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

# Movendo os Serializers de apoio para cima para o AlunoSerializer poder usá-los
class ProtocoloCriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProtocoloCrise
        fields = '__all__'

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

class AlunoSerializer(serializers.ModelSerializer):
    sugestao_manejo = serializers.ReadOnlyField() 
    
    # ADIÇÕES: Isso faz a mágica de trazer os dados relacionados no "Exibir Plano"
    peis = PEISerializer(many=True, read_only=True) 
    laudo = LaudoMedicoSerializer(read_only=True)
    protocolo_detalhado = ProtocoloCriseSerializer(source='protocolo_crise', read_only=True)

    class Meta:
        model = Aluno
        fields = '__all__'
        read_only_fields = ['professor']