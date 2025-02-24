import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager = ({
  categories = [],
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
              className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20"
            >
              {category.name}
              <span className="rounded-full bg-white/20 px-2 text-xs">
                {category.count}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent hover:text-red-500"
                onClick={() => onDeleteCategory(category.id)}
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
