import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

interface CategorySelectProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
}

const CategorySelect = ({
  categories = [],
  selectedCategory,
  onCategorySelect,
}: CategorySelectProps) => {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">التصنيف</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedCategory} onValueChange={onCategorySelect}>
          <SelectTrigger className="border-white/10 bg-white/5 text-right text-white">
            <SelectValue placeholder="اختر تصنيف" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-white/5">
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
                className="text-right text-white hover:bg-white/10"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CategorySelect;