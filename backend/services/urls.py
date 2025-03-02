from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceCategoryViewSet, ServiceViewSet, TestimonialViewSet, FAQViewSet

router = DefaultRouter(trailing_slash=True)
router.register('categories', ServiceCategoryViewSet)
router.register('', ServiceViewSet, basename='service')  # Changed to register at root
router.register('testimonials', TestimonialViewSet)
router.register('faqs', FAQViewSet)

urlpatterns = [
    path('', include(router.urls)),
]