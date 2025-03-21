import React, { useState, useRef, useCallback, useEffect } from "react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MultiSelectItem = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  items: MultiSelectItem[];
  selectedValues: string[];
  onSelectChange: (selectedValues: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  items,
  selectedValues,
  onSelectChange,
  placeholder = "Select items",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const commandRef = useRef<HTMLDivElement>(null);

  const handleUnselect = useCallback((value: string) => {
    onSelectChange(selectedValues.filter((item) => item !== value));
  }, [selectedValues, onSelectChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = commandRef.current?.querySelector("input");
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selectedValues.length > 0) {
          handleUnselect(selectedValues[selectedValues.length - 1]);
        }
      }
      // Don't close on tab
      if (e.key === "Tab") {
        e.preventDefault();
      }
    }
  }, [selectedValues, handleUnselect]);

  const selectables = items.filter((item) => !selectedValues.includes(item.value));
  const selectedItems = items.filter((item) => selectedValues.includes(item.value));

  // Filter items based on search query
  const filteredItems = searchQuery 
    ? selectables.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectables;

  useEffect(() => {
    // Focus the input when opening the popover
    if (open && commandRef.current) {
      const inputElement = commandRef.current.querySelector('input');
      if (inputElement) {
        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  }, [open]);

  return (
    <div className="relative" dir="rtl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between border-white/10 bg-white/5 hover:bg-white/10",
              className
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap items-center gap-1 p-1 text-white rtl:text-right">
              {selectedItems.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1">
                  {selectedItems.map((item) => (
                    <div key={item.value} className="flex items-center">
                      <Badge
                        className="flex items-center gap-1 border-white/20 bg-white/10 px-2 text-white"
                      >
                        {item.label}
                      </Badge>
                      <div
                        className="ml-1 cursor-pointer rounded-full p-1 hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnselect(item.value);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full border-white/10 bg-gray-900 p-0 text-white"
          align="start"
          side="bottom"
        >
          <Command 
            ref={commandRef}
            className="bg-transparent"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center border-b border-white/10 px-3">
              <div className="flex-1">
                <input
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <X
                  className="h-4 w-4 cursor-pointer text-gray-400"
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
            {filteredItems.length > 0 ? (
              <CommandGroup className="max-h-[300px] overflow-auto p-1">
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      onSelectChange([...selectedValues, item.value]);
                      setOpen(true); // Keep the popover open
                      setSearchQuery(""); // Clear the search
                    }}
                    className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm text-white hover:bg-white/10"
                  >
                    <span>{item.label}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-[#FF6B00]",
                        selectedValues.includes(item.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : items.length === selectedValues.length ? (
              <div className="py-6 text-center text-sm text-gray-400">
                تم تحديد جميع العناصر
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-gray-400">
                لا توجد نتائج
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
