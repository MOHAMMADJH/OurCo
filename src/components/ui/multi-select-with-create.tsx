import React, { useState, useRef, useCallback, useEffect } from "react";
import { Command, CommandGroup, CommandItem, CommandSeparator, CommandList } from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import BlogService from "@/services/blogService";
import { useAuth } from "@/hooks/useAuth";

export type MultiSelectItem = {
  value: string;
  label: string;
};

interface MultiSelectWithCreateProps {
  items: MultiSelectItem[];
  selectedValues: string[];
  onSelectChange: (selectedValues: string[]) => void;
  onItemsChange: (newItems: MultiSelectItem[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  createItemLabel?: string;
}

export const MultiSelectWithCreate: React.FC<MultiSelectWithCreateProps> = ({
  items,
  selectedValues,
  onSelectChange,
  onItemsChange,
  placeholder = "Select items",
  className,
  disabled = false,
  createItemLabel = "إضافة وسم جديد"
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const commandRef = useRef<HTMLDivElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { getToken } = useAuth();
  const isMounted = useRef(true);

  // Set up cleanup function to track component mount state
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  // Check if search query doesn't match any existing items
  const shouldShowCreateOption = searchQuery && 
    !filteredItems.some(item => item.label.toLowerCase() === searchQuery.toLowerCase());

  const handleCreateNewItem = async (tagName = searchQuery) => {
    const nameToUse = tagName.trim();
    if (!nameToUse) return;
    
    try {
      setIsCreating(true);
      const token = await getToken();
      
      if (!token) {
        if (isMounted.current) {
          toast({
            title: "خطأ في المصادقة",
            description: "يرجى تسجيل الدخول مرة أخرى",
            variant: "destructive",
          });
        }
        return;
      }

      const newTag = await BlogService.createTag({ name: nameToUse }, token);
      
      // Only update state if component is still mounted
      if (!isMounted.current) return;
      
      // Add the new tag to the items list
      const newItem = { value: newTag.id, label: newTag.name };
      const updatedItems = [...items, newItem];
      onItemsChange(updatedItems);
      
      // Select the new tag
      onSelectChange([...selectedValues, newTag.id]);
      
      if (isMounted.current) {
        toast({
          title: "تم إنشاء الوسم",
          description: `تم إنشاء الوسم "${nameToUse}" بنجاح`,
        });
        
        setSearchQuery("");
        setNewTagName("");
        setShowCreateInput(false);
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      
      // Only update state if component is still mounted
      if (!isMounted.current) return;
      
      toast({
        title: "خطأ في إنشاء الوسم",
        description: "فشل في إنشاء الوسم، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (isMounted.current) {
      setOpen(newOpen);
      
      // Reset states when closing the popover
      if (!newOpen) {
        setSearchQuery("");
        setShowCreateInput(false);
        setNewTagName("");
      }
    }
  }, []);
  
  // Use a ref to track if we're in the process of closing
  const isClosing = useRef(false);

  // We'll rely on Popover's built-in onInteractOutside instead of custom click handler
  // This avoids potential ref conflicts with the Command component
  useEffect(() => {
    return () => {
      // Cleanup function to ensure we don't have memory leaks
      if (isMounted.current) {
        setOpen(false);
        setSearchQuery("");
        setShowCreateInput(false);
        setNewTagName("");
      }
    };
  }, []);

  useEffect(() => {
    // Focus the input when opening the popover
    if (open && commandRef.current) {
      const inputElement = commandRef.current.querySelector('input');
      if (inputElement) {
        setTimeout(() => {
          if (isMounted.current) {
            inputElement.focus();
          }
        }, 0);
      }
    }
  }, [open]);

  useEffect(() => {
    // Focus the create input when showing it
    if (showCreateInput && createInputRef.current) {
      setTimeout(() => {
        if (isMounted.current && createInputRef.current) {
          createInputRef.current.focus();
        }
      }, 0);
    }
  }, [showCreateInput]);

  return (
    <div className="relative" dir="rtl" ref={popoverRef}>
      <Popover open={open} onOpenChange={handleOpenChange}>
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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isClosing.current) {
                handleOpenChange(!open);
              }
            }}
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
          sideOffset={8}
          onEscapeKeyDown={() => {
            isClosing.current = true;
            handleOpenChange(false);
            setTimeout(() => {
              isClosing.current = false;
            }, 100);
          }}
          onInteractOutside={() => {
            isClosing.current = true;
            handleOpenChange(false);
            setTimeout(() => {
              isClosing.current = false;
            }, 100);
          }}
        >
          <Command 
            ref={commandRef}
            className="bg-transparent"
            onKeyDown={handleKeyDown}
          >
            <CommandList>
              {!showCreateInput ? (
                <>
                  <div className="flex items-center border-b border-white/10 px-3">
                    <div className="flex-1">
                      <input
                        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="بحث..."
                        value={searchQuery}
                        onChange={(e) => {
                          if (isMounted.current) {
                            setSearchQuery(e.target.value);
                          }
                        }}
                      />
                    </div>
                    {searchQuery && (
                      <X
                        className="h-4 w-4 cursor-pointer text-gray-400"
                        onClick={() => {
                          if (isMounted.current) {
                            setSearchQuery("");
                          }
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Existing items */}
                  {filteredItems.length > 0 && (
                    <CommandGroup className="max-h-[200px] overflow-auto p-1">
                      {filteredItems.map((item) => (
                        <CommandItem
                          key={item.value}
                          onSelect={() => {
                            if (isMounted.current) {
                              onSelectChange([...selectedValues, item.value]);
                              setSearchQuery(""); // Clear the search
                            }
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
                  )}
                  
                  {/* Create new item option from search */}
                  {shouldShowCreateOption && (
                    <>
                      {filteredItems.length > 0 && <CommandSeparator className="bg-white/10" />}
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            if (isMounted.current && !isCreating) {
                              handleCreateNewItem();
                            }
                          }}
                          disabled={isCreating}
                          className="flex cursor-pointer items-center justify-between px-2 py-2 text-sm text-[#FF6B00] hover:bg-white/10"
                        >
                          <div className="flex items-center">
                            {isCreating ? (
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="ml-2 h-4 w-4" />
                            )}
                            <span>
                              {isCreating ? "جاري الإنشاء..." : `${createItemLabel}: "${searchQuery}"`}
                            </span>
                          </div>
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                  
                  {/* Empty state */}
                  {filteredItems.length === 0 && !shouldShowCreateOption && (
                    <div className="py-6 text-center text-sm text-gray-400">
                      {items.length === selectedValues.length 
                        ? "تم تحديد جميع العناصر" 
                        : "لا توجد نتائج"}
                    </div>
                  )}
                  
                  {/* Always show Add New Tag button */}
                  <div className="border-t border-white/10 p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/10 bg-white/5 text-[#FF6B00] hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isMounted.current) {
                          setShowCreateInput(true);
                          setNewTagName("");
                        }
                      }}
                      type="button"
                    >
                      <Plus className="ml-2 h-4 w-4" />
                      {createItemLabel}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-3">
                  <div className="mb-2 text-sm font-medium text-white">إضافة وسم جديد</div>
                  <div className="mb-3">
                    <input
                      ref={createInputRef}
                      className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400"
                      placeholder="اسم الوسم الجديد..."
                      value={newTagName}
                      onChange={(e) => {
                        if (isMounted.current) {
                          setNewTagName(e.target.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTagName.trim()) {
                          e.preventDefault();
                          handleCreateNewItem(newTagName);
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          if (isMounted.current) {
                            setShowCreateInput(false);
                            setNewTagName("");
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-between gap-2">
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-gray-400"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isMounted.current) {
                          setShowCreateInput(false);
                          setNewTagName("");
                        }
                      }}
                      type="button"
                    >
                      إلغاء
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90"
                      disabled={isCreating || !newTagName.trim()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isMounted.current && !isCreating && newTagName.trim()) {
                          handleCreateNewItem(newTagName);
                        }
                      }}
                      type="button"
                    >
                      {isCreating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "إضافة"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelectWithCreate;
