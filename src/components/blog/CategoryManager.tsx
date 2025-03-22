import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

interface CategoryManagerProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager = ({
  categories = [],
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) => {
  const [newCategory, setNewCategory] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">التصنيفات</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="اسم التصنيف الجديد"
            className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
          />
          <Button type="submit" className="bg-[#FF6B00] hover:bg-[#FF8533]">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              className={`flex cursor-pointer items-center gap-2 ${selectedCategory === category.id ? 'bg-[#FF6B00] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
