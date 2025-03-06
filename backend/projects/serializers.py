from rest_framework import serializers
from .models import Project, Client, ProjectImage
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    projects_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['id', 'name', 'company', 'email', 'phone', 'location', 
                 'type', 'status', 'user', 'created_at', 'updated_at',
                 'projects_count', 'total_value']
    
    def get_projects_count(self, obj):
        return obj.get_projects_count()
    
    def get_total_value(self, obj):
        return obj.get_total_value()

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'is_primary', 'uploaded_at']

class ProjectSerializer(serializers.ModelSerializer):
    client_details = ClientSerializer(source='client', read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'created_at', 
                 'updated_at', 'client', 'client_details', 'deadline', 
                 'budget', 'progress', 'images']

class ProjectDetailSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        pass