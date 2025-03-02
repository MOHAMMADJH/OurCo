from rest_framework import serializers
from .models import ServiceCategory, Service, Testimonial, FAQ
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order']
        read_only_fields = ['id']

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_position', 'client_company',
            'client_image', 'content', 'rating', 'is_featured', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'created_at']
        read_only_fields = ['id', 'created_at']

class ServiceListSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_description', 'image',
            'icon', 'category', 'price', 'price_suffix', 'is_featured',
            'order', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class ServiceDetailSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    testimonials = TestimonialSerializer(many=True, read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)
    features_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'image', 'icon', 'category', 'price', 'price_suffix',
            'features', 'features_list', 'is_featured', 'order',
            'created_at', 'updated_at', 'testimonials', 'faqs'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_features_list(self, obj):
        if obj.features:
            return [feature.strip() for feature in obj.features.split('\n') if feature.strip()]
        return []

class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.UUIDField(required=False, allow_null=True)
    
    class Meta:
        model = Service
        fields = [
            'title', 'slug', 'description', 'short_description',
            'image', 'icon', 'category_id', 'price', 'price_suffix',
            'features', 'is_featured', 'order'
        ]
    
    def create(self, validated_data):
        category_id = validated_data.pop('category_id', None)
        
        if category_id:
            try:
                category = ServiceCategory.objects.get(id=category_id)
                validated_data['category'] = category
            except ServiceCategory.DoesNotExist:
                pass
        
        return Service.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        
        if category_id is not None:
            try:
                category = ServiceCategory.objects.get(id=category_id)
                instance.category = category
            except ServiceCategory.DoesNotExist:
                instance.category = None
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance