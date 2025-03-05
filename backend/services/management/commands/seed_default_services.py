from django.core.management.base import BaseCommand
from services.models import Service, ServiceCategory

DEFAULT_SERVICES = [
    {
        "category": {
            "name": "صناعة الإعلانات المرئية",
            "slug": "video-advertising",
            "icon": "🎥"
        },
        "services": [
            {
                "title": "صناعة الإعلانات المرئية",
                "slug": "video-advertising-production",
                "description": "نحن نصنع محتويات إعلانية احترافية لتعزيز حضور علامتك التجارية.",
                "short_description": "نحن نصنع محتويات إعلانية احترافية",
                "icon": "🎥",
                "is_featured": True,
                "features": "تصوير احترافي\nمونتاج متميز\nمؤثرات بصرية\nتصحيح الألوان\nصناعة المحتوى"
            }
        ]
    },
    {
        "category": {
            "name": "تطوير المواقع",
            "slug": "web-development",
            "icon": "💻"
        },
        "services": [
            {
                "title": "برمجة المواقع الإلكترونية",
                "slug": "web-development-service",
                "description": "نصمم ونطور مواقع الويب الاحترافية لتلبية احتياجات عملك.",
                "short_description": "نصمم ونطور مواقع الويب الاحترافية",
                "icon": "💻",
                "is_featured": True,
                "features": "تصميم متجاوب\nتحسين محركات البحث\nلوحة تحكم سهلة\nتكامل وسائل التواصل الاجتماعي\nدعم فني متواصل"
            }
        ]
    },
    {
        "category": {
            "name": "التسويق بالمؤثرين",
            "slug": "influencer-marketing",
            "icon": "🌟"
        },
        "services": [
            {
                "title": "التسويق بالمؤثرين",
                "slug": "influencer-marketing-service",
                "description": "نقدم لك شبكة واسعة من المؤثرين لتعزيز وصول علامتك التجارية.",
                "short_description": "نقدم لك شبكة واسعة من المؤثرين",
                "icon": "🌟",
                "is_featured": True,
                "features": "شبكة مؤثرين واسعة\nحملات مخصصة\nتحليل النتائج\nاختيار المؤثرين المناسبين\nتقارير أداء"
            }
        ]
    },
    {
        "category": {
            "name": "تطوير العلامات التجارية",
            "slug": "brand-development",
            "icon": "✨"
        },
        "services": [
            {
                "title": "تطوير العلامات التجارية",
                "slug": "brand-development-service",
                "description": "نطور هويتك البصرية بشكل احترافي لتميز علامتك التجارية.",
                "short_description": "نطور هويتك البصرية بشكل احترافي",
                "icon": "✨",
                "is_featured": True,
                "features": "تصميم الهوية\nاستراتيجية العلامة\nتطوير الشعار\nاختيار الألوان\nدليل الهوية"
            }
        ]
    },
    {
        "category": {
            "name": "تحسين محركات البحث",
            "slug": "seo",
            "icon": "🔍"
        },
        "services": [
            {
                "title": "تحسين محركات البحث",
                "slug": "seo-optimization",
                "description": "نضمن لك الظهور في نتائج البحث من خلال تحسين محركات البحث.",
                "short_description": "نضمن لك الظهور في نتائج البحث",
                "icon": "🔍",
                "is_featured": True,
                "features": "تحليل الكلمات المفتاحية\nتحسين المحتوى\nبناء الروابط\nتحليل المنافسين\nتقارير شهرية"
            }
        ]
    },
    {
        "category": {
            "name": "إدارة وسائل التواصل",
            "slug": "social-media",
            "icon": "📱"
        },
        "services": [
            {
                "title": "إدارة وسائل التواصل",
                "slug": "social-media-management",
                "description": "نقدم محتوى متميز لمنصاتك الاجتماعية لتعزيز تواجدك الرقمي.",
                "short_description": "نقدم محتوى متميز لمنصاتك",
                "icon": "📱",
                "is_featured": True,
                "features": "إدارة المحتوى\nجدولة المنشورات\nتفاعل مع الجمهور\nتحليل الأداء\nتقارير دورية"
            }
        ]
    },
    {
        "category": {
            "name": "تصميم الجرافيك",
            "slug": "graphic-design",
            "icon": "🎨"
        },
        "services": [
            {
                "title": "تصميم الجرافيك",
                "slug": "graphic-design-service",
                "description": "نصمم هويتك البصرية بإبداع لتميز علامتك التجارية.",
                "short_description": "نصمم هويتك البصرية بإبداع",
                "icon": "🎨",
                "is_featured": True,
                "features": "تصميم الشعارات\nتصميم المطبوعات\nتصميم وسائل التواصل\nتصميم الإعلانات\nتصميم المواقع"
            }
        ]
    },
    {
        "category": {
            "name": "التصوير الاحترافي",
            "slug": "professional-photography",
            "icon": "📸"
        },
        "services": [
            {
                "title": "التصوير الاحترافي",
                "slug": "professional-photography-service",
                "description": "نقدم خدمات تصوير عالية الجودة لإبراز منتجاتك وخدماتك.",
                "short_description": "نقدم خدمات تصوير عالية الجودة",
                "icon": "📸",
                "is_featured": True,
                "features": "تصوير المنتجات\nتصوير الفعاليات\nتصوير المطاعم\nتصوير العقارات\nتصوير الأزياء"
            }
        ]
    }
]

class Command(BaseCommand):
    help = 'Seeds the database with default services and categories'

    def handle(self, *args, **options):
        for category_data in DEFAULT_SERVICES:
            category_info = category_data['category']
            category, created = ServiceCategory.objects.get_or_create(
                slug=category_info['slug'],
                defaults={
                    'name': category_info['name'],
                    'icon': category_info['icon']
                }
            )

            for service_data in category_data['services']:
                service, created = Service.objects.get_or_create(
                    slug=service_data['slug'],
                    defaults={
                        'title': service_data['title'],
                        'description': service_data['description'],
                        'short_description': service_data['short_description'],
                        'icon': service_data['icon'],
                        'is_featured': service_data['is_featured'],
                        'features': service_data['features'],
                        'category': category
                    }
                )

                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f'Successfully created service "{service.title}"')
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f'Service "{service.title}" already exists')
                    )

        self.stdout.write(self.style.SUCCESS('Default services seeding completed'))