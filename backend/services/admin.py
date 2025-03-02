from django.contrib import admin
from .models import ServiceCategory, Service, Testimonial, FAQ

# Register your models here.

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    list_filter = ('created_at',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'is_featured', 'created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description', 'description')
    list_filter = ('category', 'is_featured', 'created_at', 'updated_at')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'client_company', 'service', 'rating', 'is_featured', 'created_at')
    search_fields = ('client_name', 'client_company', 'content')
    list_filter = ('service', 'rating', 'is_featured', 'created_at')

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'service', 'created_at')
    search_fields = ('question', 'answer')
    list_filter = ('service', 'created_at')
