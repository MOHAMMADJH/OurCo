import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import BlogService, { ICategory, ITag } from '@/lib/blog-service';
import { handleApiError } from '@/utils/apiUtils';

// تعريف أنواع البيانات الداخلية
export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string; // Not optional to match ICategory
  updated_at: string; // Not optional to match ICategory
  posts_count?: number; // Added for compatibility with ICategory
}

export interface TagType {
  id: string;
  name: string;
  slug: string;
  created_at: string; // Not optional to match ITag
  updated_at: string; // Not optional to match ITag
}

/**
 * Custom hook for managing categories
 */
export function useCategories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const fetchedCategories = await BlogService.getCategories(token);
      setCategories(fetchedCategories as unknown as CategoryType[]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'خطأ',
        description: 'فشل في جلب التصنيفات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  const addCategory = useCallback(
    async (categoryData: { 
      name?: string;
      slug?: string;
      description?: string;
    }) => {
      if (!token) return null;
      setLoading(true);
      try {
        const newCategory = await BlogService.createCategory(
          categoryData.name || '',
          categoryData.slug || '',
          categoryData.description || '',
          token
        );
        setCategories(prev => [...prev, newCategory as unknown as CategoryType]);
        toast({
          title: 'نجاح',
          description: 'تم إضافة التصنيف بنجاح',
          variant: 'default',
        });
        return newCategory;
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast({
          title: 'خطأ',
          description: 'فشل في إضافة التصنيف: ' + error.message,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, toast]
  );

  const updateCategory = useCallback(
    async (
      categoryId: string,
      categoryData: {
        name?: string;
        slug?: string;
        description?: string;
      }
    ) => {
      if (!token) return null;
      setLoading(true);
      try {
        const updatedCategory = await BlogService.updateCategory(
          token,
          categoryId,
          categoryData
        );
        setCategories(prev =>
          prev.map(cat => (cat.id === categoryId ? updatedCategory as unknown as CategoryType : cat))
        );
        toast({
          title: 'نجاح',
          description: 'تم تحديث التصنيف بنجاح',
          variant: 'default',
        });
        return updatedCategory;
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast({
          title: 'خطأ',
          description: 'فشل في تحديث التصنيف: ' + error.message,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, toast]
  );

  const deleteCategory = useCallback(async (categoryId: string) => {
    if (!token) return false;
    setLoading(true);

    try {
      await BlogService.deleteCategory(categoryId, token);
      setCategories(prev => prev.filter(category => category.id !== categoryId));
      toast({
        title: 'نجاح',
        description: 'تم حذف التصنيف بنجاح',
        variant: 'default',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف التصنيف: ' + error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    isCategoryLoading: loading // إصلاح هذا الحقل للتوافق مع الكود الحالي
  };
}

/**
 * Custom hook for managing tags
 */
export function useTags() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchTags = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const fetchedTags = await BlogService.getTags(token);
      setTags(fetchedTags as unknown as TagType[]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'خطأ',
        description: 'فشل في جلب الوسوم',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  const addTag = useCallback(
    async (tagData: { name?: string; slug?: string }) => {
      if (!token) return null;
      setLoading(true);
      try {
        const newTag = await BlogService.createTag(
          tagData.name || '',
          tagData.slug || '',
          token
        );
        setTags(prev => [...prev, newTag as unknown as TagType]);
        toast({
          title: 'نجاح',
          description: 'تم إضافة الوسم بنجاح',
          variant: 'default',
        });
        return newTag;
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast({
          title: 'خطأ',
          description: 'فشل في إضافة الوسم: ' + error.message,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, toast]
  );

  const updateTag = useCallback(
    async (
      tagId: string,
      tagData: {
        name?: string;
        slug?: string;
      }
    ) => {
      if (!token) return null;
      setLoading(true);
      try {
        const updatedTag = await BlogService.updateTag(
          token,
          tagId,
          tagData
        );
        setTags(prev =>
          prev.map(tag => (tag.id === tagId ? updatedTag as unknown as TagType : tag))
        );
        toast({
          title: 'نجاح',
          description: 'تم تحديث الوسم بنجاح',
          variant: 'default',
        });
        return updatedTag;
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast({
          title: 'خطأ',
          description: 'فشل في تحديث الوسم: ' + error.message,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, toast]
  );

  const deleteTag = useCallback(async (tagId: string) => {
    if (!token) return false;
    setLoading(true);

    try {
      await BlogService.deleteTag(tagId, token);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      toast({
        title: 'نجاح',
        description: 'تم حذف الوسم بنجاح',
        variant: 'default',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الوسم: ' + error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    fetchTags,
    addTag,
    updateTag,
    deleteTag,
    isTagLoading: loading // إصلاح هذا الحقل للتوافق مع الكود الحالي
  };
}
