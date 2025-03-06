from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ClientViewSet

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')
router.register('clients', ClientViewSet, basename='client')

urlpatterns = [
    path('', include(router.urls)),
]