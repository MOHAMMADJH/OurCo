import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultiSelectWithCreate, { MultiSelectItem } from "@/components/ui/multi-select-with-create";
import { Loader2 } from "lucide-react";

interface TagSelectorProps {
  availableTags: { id: string; name: string }[];
  selectedTags: string[];
  onChange: (selectedTagIds: string[]) => void;
  onAddTag: (name: string) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Component for selecting and creating tags for blog posts
 */
const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onChange,
  onAddTag,
  onDeleteTag,
  isLoading = false,
}) => {
  // Convert tags to format expected by MultiSelectWithCreate
  const tagItems: MultiSelectItem[] = availableTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  // Handle adding a new tag
  const handleAddTag = async (newItems: MultiSelectItem[]) => {
    // The MultiSelectWithCreate component will handle the API call and state updates
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white">الوسوم</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-white/50" />
          </div>
        ) : (
          <MultiSelectWithCreate
            items={tagItems}
            selectedValues={selectedTags}
            onSelectChange={onChange}
            onItemsChange={handleAddTag}
            placeholder="اختر الوسوم"
            createItemLabel="إضافة وسم جديد"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TagSelector;