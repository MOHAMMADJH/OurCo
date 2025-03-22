import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "../ui/badge";
import BlogService, { ICategory } from "@/services/blogService";

interface BlogFiltersProps {
  onFilterChange: (filters: BlogFilterValues) => void;
  className?: string;
}

export interface BlogFilterValues {
  search: string;
  category?: string;
  tag?: string;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({ onFilterChange, className = "" }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filters, setFilters] = useState<BlogFilterValues>({
    search: "",
    category: undefined,
    tag: undefined,
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await BlogService.getAllCategories();
        setCategories(response.results || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update filters and notify parent component
  const handleFilterChange = (name: keyof BlogFilterValues, value: string | undefined) => {
    // إذا كانت قيمة التصنيف هي "all"، نقوم بتعيين قيمة التصنيف إلى undefined
    // لإزالة فلتر التصنيف من الطلب
    if (name === "category" && value === "all") {
      value = undefined;
    }
    
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Update active filters for display
    updateActiveFilters(name, value);

    // Notify parent component
    onFilterChange(newFilters);
  };

  // Update the list of active filters for display
  const updateActiveFilters = (name: keyof BlogFilterValues, value: string | undefined) => {
    if (!value) {
      setActiveFilters(activeFilters.filter((filter) => !filter.startsWith(name)));
      return;
    }

    // For category, show the category name instead of ID
    let displayValue = value;
    if (name === "category") {
      const category = categories.find((cat) => cat.id === value);
      if (category) {
        displayValue = category.name;
      }
    }

    const filterKey = `${name}:${displayValue}`;
    if (!activeFilters.includes(filterKey)) {
      setActiveFilters([...activeFilters.filter((filter) => !filter.startsWith(name)), filterKey]);
    }
  };

  // Remove a filter
  const removeFilter = (filterKey: string) => {
    const [name, _] = filterKey.split(":");
    setActiveFilters(activeFilters.filter((filter) => filter !== filterKey));

    // Update the filters object
    const newFilters = { ...filters, [name]: undefined };
    setFilters(newFilters);

    // Notify parent component
    onFilterChange(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters: BlogFilterValues = {
      search: "",
      category: undefined,
      tag: undefined,
    };
    setFilters(emptyFilters);
    setActiveFilters([]);
    onFilterChange(emptyFilters);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ابحث عن مقالات..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Category filter */}
        <div className="w-full md:w-64">
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="تصفية حسب الفئة" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#0B1340] border-white/10 text-white">
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear filters button - only show if there are active filters */}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            مسح الكل
          </Button>
        )}
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => {
            const [name, value] = filter.split(":");
            let label = "";
            switch (name) {
              case "search":
                label = `بحث: ${value}`;
                break;
              case "category":
                label = `الفئة: ${value}`;
                break;
              case "tag":
                label = `الوسم: ${value}`;
                break;
              default:
                label = value;
            }

            return (
              <Badge
                key={filter}
                variant="outline"
                className="flex items-center gap-1 bg-white/5 text-white border-white/10 hover:bg-white/10"
              >
                {label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogFilters;