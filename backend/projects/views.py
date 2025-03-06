from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Project, Client, ProjectImage
from .serializers import ProjectSerializer, ProjectDetailSerializer, ClientSerializer, ProjectImageSerializer

class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientSerializer
    
    def get_queryset(self):
        return Client.objects.all()
    
    @action(detail=True, methods=['get'])
    def projects(self, request, pk=None):
        client = get_object_or_404(Client, pk=pk)
        projects = Project.objects.filter(client=client)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer
    
    def get_queryset(self):
        return Project.objects.all().select_related('client').prefetch_related('images')
    
    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        project = self.get_object()
        
        # Handle is_primary flag
        is_primary = request.data.get('is_primary', False)
        if is_primary:
            # Set all other images to non-primary
            ProjectImage.objects.filter(project=project, is_primary=True).update(is_primary=False)
        
        # Create the new image
        serializer = ProjectImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def images(self, request, pk=None):
        project = self.get_object()
        images = ProjectImage.objects.filter(project=project)
        serializer = ProjectImageSerializer(images, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        project = self.get_object()
        image_id = request.query_params.get('image_id')
        if not image_id:
            return Response({"detail": "Image ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image = ProjectImage.objects.get(id=image_id, project=project)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProjectImage.DoesNotExist:
            return Response({"detail": "Image not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def update_progress(self, request, pk=None):
        project = self.get_object()
        progress = request.data.get('progress')
        
        if progress is None:
            return Response({"detail": "Progress value is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            progress = int(progress)
            if progress < 0 or progress > 100:
                return Response({"detail": "Progress must be between 0 and 100"}, status=status.HTTP_400_BAD_REQUEST)
            
            project.progress = progress
            project.save(update_fields=['progress'])
            
            return Response({"progress": progress})
        except ValueError:
            return Response({"detail": "Progress must be a valid integer"}, status=status.HTTP_400_BAD_REQUEST)