import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { ITag } from "@/services/blogService";
import { Button } from "../ui/button"; // Import Button component
import { ScrollArea } from "../ui/scroll-area"; // Import ScrollArea component

interface TagSelectProps {
  tags: ITag[];
  selectedTags: string[];
  onTagSelect: (ids: string[]) => void;
  onAddTag?: (name: string) => void;
  onDeleteTag?: (id: string) => void;
}

const TagSelect = ({
  tags = [],
  selectedTags = [],
  onTagSelect,
  onAddTag,
  onDeleteTag,
}: TagSelectProps) => {
  const [newTag, setNewTag] = React.useState("");

  const handleAddTag = () => {
    if (newTag.trim() && onAddTag) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  const handleTagClick = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    onTagSelect(newSelectedTags);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, tagId: string) => {
    e.stopPropagation(); // Prevent tag click event
    if (onDeleteTag) {
      onDeleteTag(tagId);
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">الوسوم</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Input
            placeholder="أضف وسماً جديداً"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
              }
            }}
            className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400 flex-grow"
          />
          <Button onClick={handleAddTag} disabled={!newTag.trim()}>
            إضافة
          </Button>
        </div>

        <ScrollArea className="h-[200px] w-full rounded-md border">
          <div className="flex flex-wrap gap-2 p-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className={`cursor-pointer ${selectedTags.includes(tag.id)
                  ? "bg-[#FF6B00] hover:bg-[#FF8533] text-white"
                  : "border-white/10 hover:bg-white/10 text-white"
                  } flex items-center gap-1`}
                onClick={() => handleTagClick(tag.id)}
              >
                {tag.name}
                {onDeleteTag && (
                  <button onClick={(e) => handleDeleteClick(e, tag.id)} aria-label={`Delete tag ${tag.name}`}>
                    <X className="h-3 w-3 hover:text-red-500" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TagSelect;