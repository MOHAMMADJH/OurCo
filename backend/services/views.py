from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status, filters, renderers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.core.management import call_command

from .models import ServiceCategory, Service, Testimonial, FAQ
from .serializers import (
    ServiceCategorySerializer,
    ServiceListSerializer,
    ServiceDetailSerializer,
    ServiceCreateUpdateSerializer,
    TestimonialSerializer,
    FAQSerializer
)

class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
        
    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch service categories", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'short_description']
    renderer_classes = [renderers.JSONRenderer]
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def seed_default(self, request):
        try:
            call_command('seed_default_services')
            return Response({'message': 'Default services seeded successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to seed default services', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ServiceListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ServiceCreateUpdateSerializer
        return ServiceDetailSerializer
    
    def get_queryset(self):
        queryset = Service.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter featured services
        featured = self.request.query_params.get('featured', None)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(short_description__icontains=search)
            )
        
        return queryset

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['client_name', 'client_company', 'content']
    
    def get_queryset(self):
        queryset = Testimonial.objects.all()
        
        # Filter by service
        service = self.request.query_params.get('service', None)
        if service:
            queryset = queryset.filter(service__slug=service)
        
        # Filter featured testimonials
        featured = self.request.query_params.get('featured', None)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['question', 'answer']
    
    def get_queryset(self):
        queryset = FAQ.objects.all()
        
        # Filter by service
        service = self.request.query_params.get('service', None)
        if service:
            queryset = queryset.filter(service__slug=service)
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]
