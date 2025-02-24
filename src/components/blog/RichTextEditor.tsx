import React from "react";
import { Card } from "../ui/card";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link,
  AlignRight,
  AlignCenter,
  AlignLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div className="min-h-[400px] p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full resize-none bg-transparent text-right text-white outline-none"
          placeholder="اكتب محتوى المقال هنا..."
        />
      </div>
    </Card>
  );
};

export default RichTextEditor;
