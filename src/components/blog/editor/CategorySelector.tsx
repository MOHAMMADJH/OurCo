import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { ICategory } from "@/services/blogService";

interface CategorySelectorProps {
  /**
   * List of available categories
   */
  categories: ICategory[];
  /**
   * Currently selected category ID
   */
  selectedCategory: string;
  /**
   * Callback for category selection
   */
  onChange: (categoryId: string) => void;
  /**
   * Callback for adding a new category
   */
  onAddCategory: (name: string) => Promise<void>;
  /**
   * Callback for deleting a category
   */
  onDeleteCategory: (id: string) => Promise<void>;
  /**
   * Loading state
   */
  isLoading: boolean;
}

/**
 * Component for selecting, adding, and deleting blog categories
 */
const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onChange,
  onAddCategory,
  onDeleteCategory,
  isLoading,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await onAddCategory(newCategory);
      setNewCategory("");
      setShowAddForm(false);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await onDeleteCategory(id);
      // If the deleted category was selected, reset selection
      if (id === selectedCategory) {
        onChange("");
      }
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">التصنيف</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "إلغاء" : "إضافة تصنيف"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm ? (
          <form onSubmit={handleSubmit} className="mb-4 space-y-2">
            <Input
              placeholder="اسم التصنيف الجديد"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="sm"
                disabled={isLoading || !newCategory.trim()}
                className="h-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <Select
            value={selectedCategory}
            onValueChange={onChange}
          >
            <SelectTrigger className="border-white/10 bg-white/5 text-right text-white">
              <SelectValue placeholder="اختر تصنيفًا" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              <SelectItem value="none">بدون تصنيف</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{category.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
