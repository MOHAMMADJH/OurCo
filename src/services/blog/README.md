# دليل استخدام API المدونة مع دعم اللغة العربية وتعديل Slug

## الميزات الجديدة

تم تطوير API المدونة في الـ backend لدعم:
1. اللغة العربية في الـ slug
2. إمكانية تعديل الـ slug للمقالات والفئات والوسوم

## كيفية تحديث BlogService في الواجهة الأمامية

### 1. إضافة وظائف جديدة في BlogService

قم بإضافة الوظائف التالية إلى ملف `BlogService.ts`:

```typescript
// تحديث slug المقال
static async updatePostSlug(postSlug: string, newSlug?: string): Promise<Post> {
  try {
    const response = await api.post(
      `/blog/posts/${postSlug}/update_slug/`,
      newSlug ? { slug: newSlug } : {}
    );
    return response.data;
  } catch (error) {
    console.error('Error updating post slug:', error);
    throw error;
  }
}

// تحديث slug الفئة
static async updateCategorySlug(categorySlug: string, newSlug?: string): Promise<Category> {
  try {
    const response = await api.post(
      `/blog/categories/${categorySlug}/update_slug/`,
      newSlug ? { slug: newSlug } : {}
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category slug:', error);
    throw error;
  }
}

// تحديث slug الوسم
static async updateTagSlug(tagSlug: string, newSlug?: string): Promise<Tag> {
  try {
    const response = await api.post(
      `/blog/tags/${tagSlug}/update_slug/`,
      newSlug ? { slug: newSlug } : {}
    );
    return response.data;
  } catch (error) {
    console.error('Error updating tag slug:', error);
    throw error;
  }
}
```

### 2. تعديل نماذج البيانات (Types)

تأكد من أن نماذج البيانات تدعم الـ slug بالعربية:

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;  // يمكن أن يحتوي على أحرف عربية
  // ... باقي الحقول
}

interface Category {
  id: string;
  name: string;
  slug: string;  // يمكن أن يحتوي على أحرف عربية
  // ... باقي الحقول
}

interface Tag {
  id: string;
  name: string;
  slug: string;  // يمكن أن يحتوي على أحرف عربية
  // ... باقي الحقول
}
```

## كيفية استخدام الوظائف الجديدة في واجهة المستخدم

### 1. تحديث slug المقال

```tsx
import { BlogService } from '@/services/blog/BlogService';

// تحديث slug باستخدام عنوان المقال
const updateSlugFromTitle = async (postSlug: string) => {
  try {
    const updatedPost = await BlogService.updatePostSlug(postSlug);
    // تحديث واجهة المستخدم بالـ slug الجديد
    navigate(`/blog/${updatedPost.slug}`);
  } catch (error) {
    toast.error('حدث خطأ أثناء تحديث slug المقال');
  }
};

// تحديث slug باستخدام قيمة مخصصة
const updateSlugWithCustomValue = async (postSlug: string, newSlug: string) => {
  try {
    const updatedPost = await BlogService.updatePostSlug(postSlug, newSlug);
    // تحديث واجهة المستخدم بالـ slug الجديد
    navigate(`/blog/${updatedPost.slug}`);
  } catch (error) {
    toast.error('حدث خطأ أثناء تحديث slug المقال');
  }
};
```

### 2. إضافة حقل تعديل Slug في نموذج تحرير المقال

```tsx
<FormField
  control={form.control}
  name="slug"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Slug (المعرف في الرابط)</FormLabel>
      <FormControl>
        <div className="flex gap-2">
          <Input
            placeholder="slug-المقال"
            {...field}
            dir="ltr"
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              // توليد slug من العنوان
              const titleValue = form.getValues('title');
              if (titleValue) {
                // يمكنك استخدام مكتبة slugify في الواجهة الأمامية أيضًا
                import('slugify').then(({ default: slugify }) => {
                  const newSlug = slugify(titleValue, { lower: true, strict: true, locale: 'ar' });
                  form.setValue('slug', newSlug);
                });
              }
            }}
          >
            توليد من العنوان
          </Button>
        </div>
      </FormControl>
      <FormDescription>
        المعرف الذي سيظهر في رابط المقال. يمكن أن يحتوي على أحرف عربية.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## ملاحظات هامة

1. تأكد من تحديث الروابط في التطبيق عند تغيير slug
2. قم بتحديث ذاكرة التخزين المؤقت (cache) عند تغيير slug
3. تأكد من معالجة الأخطاء بشكل مناسب في واجهة المستخدم
4. يمكن استخدام مكتبة [slugify](https://www.npmjs.com/package/slugify) في الواجهة الأمامية أيضًا لتوليد slug متوافق مع الخلفية
