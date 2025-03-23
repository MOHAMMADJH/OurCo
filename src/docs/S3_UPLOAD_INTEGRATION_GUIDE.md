# دليل تكامل رفع الملفات المباشر إلى S3

## نظرة عامة

تم تنفيذ حل يوفر لك أفضل ما في العالمين للتعامل مع تحميل الملفات باستخدام Wasabi S3:

1. **الرفع عبر الخادم الخلفي (Backend)**: مناسب للملفات الصغيرة مثل الصور المصغرة والأيقونات
2. **الرفع المباشر من الواجهة الأمامية (Frontend)**: مناسب للملفات الكبيرة مثل الصور عالية الدقة والمستندات

## المكونات الرئيسية

1. **خدمة S3 (s3-service.ts)**:
   - وظائف للحصول على روابط موقعة مسبقًا (presigned URLs)
   - وظائف لرفع الملفات مباشرة إلى S3
   - تتبع تقدم الرفع

2. **مكون S3FileUploader**:
   - مكون قابل لإعادة الاستخدام للرفع المباشر
   - دعم الرفع التقليدي والمباشر
   - واجهة مستخدم سهلة الاستخدام مع تتبع التقدم

3. **نقطة نهاية API للروابط الموقعة مسبقًا**:
   - `/api/s3/presigned-url/` للحصول على روابط موقعة مسبقًا
   - مؤمنة بالمصادقة لمنع الوصول غير المصرح به

4. **نقطة نهاية API لتسجيل الصور المرفوعة**:
   - `/api/projects/:projectId/register_s3_image/` لتسجيل الصور المرفوعة مباشرة إلى S3

## كيفية الاستخدام

### 1. استخدام مكون S3FileUploader

هذا المكون يمكن استخدامه في أي مكان تحتاج فيه إلى رفع ملفات:

```tsx
import S3FileUploader from "@/components/common/S3FileUploader";

// في مكون React الخاص بك
const MyComponent = () => {
  const handleUploadComplete = (url: string) => {
    console.log('تم رفع الملف بنجاح:', url);
    // قم بتخزين عنوان URL أو إرساله إلى الخادم الخلفي
  };

  return (
    <S3FileUploader 
      onUploadComplete={handleUploadComplete}
      onUploadError={(error) => console.error('خطأ:', error)}
      folder="blog/images"
      accept="image/*"
      buttonText="اختر صورة"
      maxSizeInMB={10}
    />
  );
};
```

### 2. تكامل مع محرر المدونة

بناءً على التحسينات السابقة لمحرر المدونة، يمكنك دمج S3FileUploader في واجهة تحرير المدونة:

```tsx
// في مكون تحرير المدونة
import S3FileUploader from "@/components/common/S3FileUploader";

const BlogEditor = () => {
  // ...الحالة والوظائف الحالية

  const handleImageUpload = (imageUrl: string) => {
    // تحديث حالة الصورة في المدونة
    setBlogPost({
      ...blogPost,
      featured_image: imageUrl
    });
  };

  return (
    <div className="blog-editor-tabs">
      {/* علامة تبويب المحتوى */}
      <TabsContent value="content">
        {/* محرر النص الغني الحالي */}
        <SimpleRichTextEditor 
          value={blogPost.content} 
          onChange={(content) => handleContentChange(content)} 
        />
      </TabsContent>

      {/* علامة تبويب الوسائط */}
      <TabsContent value="media">
        <Card>
          <CardHeader>
            <CardTitle>صورة المدونة الرئيسية</CardTitle>
          </CardHeader>
          <CardContent>
            <S3FileUploader 
              onUploadComplete={handleImageUpload}
              folder="blog/featured-images"
              accept="image/*"
              buttonText="اختر صورة للمدونة"
            />
            
            {blogPost.featured_image && (
              <div className="mt-4">
                <img 
                  src={blogPost.featured_image} 
                  alt="صورة المدونة" 
                  className="max-h-[200px] rounded-md"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* علامة تبويب التصنيفات/الوسوم */}
      <TabsContent value="categories">
        {/* مكون MultiSelectWithCreate الحالي */}
      </TabsContent>
    </div>
  );
};
```

### 3. تكامل مع مكون ProjectImagesDialog

تم بالفعل تحديث مكون ProjectImagesDialog لاستخدام وظائف الرفع المباشر إلى S3. يمكنك استخدام نفس النهج في مكونات أخرى.

## أفضل الممارسات

1. **اختيار طريقة الرفع المناسبة**:
   - للملفات الصغيرة (< 5 ميجابايت): استخدم الرفع التقليدي عبر الخادم الخلفي
   - للملفات الكبيرة (> 5 ميجابايت): استخدم الرفع المباشر إلى S3

2. **التعامل مع الأخطاء**:
   - دائمًا قم بتنفيذ معالجة الأخطاء المناسبة
   - عرض رسائل خطأ واضحة للمستخدم
   - تسجيل الأخطاء في وحدة التحكم للتشخيص

3. **تتبع تقدم الرفع**:
   - استخدم شريط التقدم لإظهار حالة الرفع للمستخدم
   - تقديم تعليقات بصرية أثناء عملية الرفع

4. **الأمان**:
   - تأكد من أن جميع طلبات الحصول على روابط موقعة مسبقًا تتطلب مصادقة
   - تحقق من صحة أنواع الملفات وأحجامها قبل الرفع
   - استخدم HTTPS لجميع الاتصالات

## تكامل مع مكونات أخرى

### تكامل مع SimpleRichTextEditor

بناءً على التحسينات السابقة لمكون SimpleRichTextEditor، يمكنك دمج وظيفة رفع الصور مباشرة إلى S3:

```tsx
// في مكون SimpleRichTextEditor
import s3Service from "@/lib/s3-service";

const SimpleRichTextEditor = ({ value, onChange, onError }) => {
  // ...الشيفرة الحالية

  // وظيفة لرفع الصور من المحرر
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // رفع الصورة مباشرة إلى S3
      const imageUrl = await s3Service.uploadFile(
        file,
        'blog/content-images',
        (progress) => console.log('تقدم رفع الصورة:', progress)
      );
      
      return imageUrl;
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  };

  // تكوين CKEditor مع دعم رفع الصور
  const editorConfig = {
    // ...التكوين الحالي
    
    // إضافة معالج رفع الصور
    ckfinder: {
      uploadUrl: '/api/upload-placeholder', // سيتم تجاوز هذا
      uploadCallback: handleImageUpload
    }
  };

  // ...باقي الشيفرة
};
```

### تكامل مع MultiSelectWithCreate

يمكن أيضًا استخدام نهج مماثل لرفع الصور المرتبطة بالوسوم أو التصنيفات:

```tsx
// في مكون إنشاء الوسم
import S3FileUploader from "@/components/common/S3FileUploader";

const CreateTagDialog = () => {
  // ...الحالة والوظائف الحالية
  const [tagImage, setTagImage] = useState<string | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setTagImage(imageUrl);
  };

  const handleCreateTag = async () => {
    // ...الشيفرة الحالية
    
    // إضافة الصورة إلى بيانات الوسم
    const tagData = {
      name: tagName,
      slug: tagSlug,
      image: tagImage // الصورة المرفوعة إلى S3
    };
    
    // ...إرسال البيانات إلى الخادم الخلفي
  };

  return (
    <DialogContent>
      {/* ...الحقول الحالية */}
      
      <div className="space-y-2">
        <Label>صورة الوسم (اختياري)</Label>
        <S3FileUploader 
          onUploadComplete={handleImageUpload}
          folder="blog/tags"
          accept="image/*"
          buttonText="اختر صورة للوسم"
        />
      </div>
      
      {/* ...باقي الواجهة */}
    </DialogContent>
  );
};
```

## الخلاصة

هذا النهج الهجين يوفر لك أفضل أداء وتجربة مستخدم مع الحفاظ على الأمان والتحكم في عمليات رفع الملفات. استخدم الرفع التقليدي للملفات الصغيرة والرفع المباشر للملفات الكبيرة حسب احتياجات تطبيقك.
