import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import BlogService, { ICategory, ITag } from '@/services/blogService';
import { handleApiError } from '@/utils/apiUtils';

/**
 * Custom hook for managing categories
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState<Record<string, boolean>>({});
  const { getToken } = useAuth();
  const { toast } = useToast();

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;
      
      const fetchedCategories = await BlogService.getCategories(token);
      setCategories(fetchedCategories);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setLoading(false);
    }
  }, [getToken, toast]);

  // Add a new category
  const addCategory = useCallback(async (categoryData: { name: string; slug?: string; description?: string }) => {
    try {
      const token = getToken();
      if (!token) return null;
      
      const newCategory = await BlogService.createCategory(
        token,
        categoryData.name,
        categoryData.slug || '',
        categoryData.description || ''
      );
      
      setCategories(prev => [...prev, newCategory]);
      
      toast({
        title: 'تم إنشاء التصنيف',
        description: `تم إنشاء التصنيف "${newCategory.name}" بنجاح`,
      });
      
      return newCategory;
    } catch (error) {
      handleApiError(error, toast);
      return null;
    }
  }, [getToken, toast]);

  // Delete a category
  const deleteCategory = useCallback(async (categoryId: string) => {
    setIsCategoryLoading(prev => ({ ...prev, [categoryId]: true }));
    try {
      const token = getToken();
      if (!token) return false;
      
      await BlogService.deleteCategory(token, categoryId);
      setCategories(prev => prev.filter(category => category.id !== categoryId));
      
      toast({
        title: 'تم حذف التصنيف',
        description: 'تم حذف التصنيف بنجاح',
      });
      
      return true;
    } catch (error) {
      handleApiError(error, toast);
      return false;
    } finally {
      setIsCategoryLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  }, [getToken, toast]);

  // Update a category
  const updateCategory = useCallback(async (
    categoryId: string, 
    categoryData: { name?: string; slug?: string; description?: string }
  ) => {
    setIsCategoryLoading(prev => ({ ...prev, [categoryId]: true }));
    try {
      const token = getToken();
      if (!token) return null;
      
      const updatedCategory = await BlogService.updateCategory(
        token,
        categoryId,
        categoryData
      );
      
      setCategories(prev => 
        prev.map(category => 
          category.id === categoryId ? updatedCategory : category
        )
      );
      
      toast({
        title: 'تم تحديث التصنيف',
        description: `تم تحديث التصنيف "${updatedCategory.name}" بنجاح`,
      });
      
      return updatedCategory;
    } catch (error) {
      handleApiError(error, toast);
      return null;
    } finally {
      setIsCategoryLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  }, [getToken, toast]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    isCategoryLoading,
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory
  };
};

/**
 * Custom hook for managing tags
 */
export const useTags = () => {
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTagLoading, setIsTagLoading] = useState<Record<string, boolean>>({});
  const { getToken } = useAuth();
  const { toast } = useToast();

  // Fetch all tags
  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;
      
      const fetchedTags = await BlogService.getTags(token);
      setTags(fetchedTags);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setLoading(false);
    }
  }, [getToken, toast]);

  // Add a new tag
  const addTag = useCallback(async (tagData: { name: string; slug?: string }) => {
    try {
      const token = getToken();
      if (!token) return null;
      
      const newTag = await BlogService.createTag(
        token,
        tagData.name,
        tagData.slug || ''
      );
      
      setTags(prev => [...prev, newTag]);
      
      toast({
        title: 'تم إنشاء الوسم',
        description: `تم إنشاء الوسم "${newTag.name}" بنجاح`,
      });
      
      return newTag;
    } catch (error) {
      handleApiError(error, toast);
      return null;
    }
  }, [getToken, toast]);

  // Delete a tag
  const deleteTag = useCallback(async (tagId: string) => {
    setIsTagLoading(prev => ({ ...prev, [tagId]: true }));
    try {
      const token = getToken();
      if (!token) return false;
      
      await BlogService.deleteTag(token, tagId);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      
      toast({
        title: 'تم حذف الوسم',
        description: 'تم حذف الوسم بنجاح',
      });
      
      return true;
    } catch (error) {
      handleApiError(error, toast);
      return false;
    } finally {
      setIsTagLoading(prev => ({ ...prev, [tagId]: false }));
    }
  }, [getToken, toast]);

  // Update a tag
  const updateTag = useCallback(async (
    tagId: string, 
    tagData: { name?: string; slug?: string }
  ) => {
    setIsTagLoading(prev => ({ ...prev, [tagId]: true }));
    try {
      const token = getToken();
      if (!token) return null;
      
      const updatedTag = await BlogService.updateTag(
        token,
        tagId,
        tagData
      );
      
      setTags(prev => 
        prev.map(tag => 
          tag.id === tagId ? updatedTag : tag
        )
      );
      
      toast({
        title: 'تم تحديث الوسم',
        description: `تم تحديث الوسم "${updatedTag.name}" بنجاح`,
      });
      
      return updatedTag;
    } catch (error) {
      handleApiError(error, toast);
      return null;
    } finally {
      setIsTagLoading(prev => ({ ...prev, [tagId]: false }));
    }
  }, [getToken, toast]);

  // Load tags on mount
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    isTagLoading,
    fetchTags,
    addTag,
    deleteTag,
    updateTag
  };
};
