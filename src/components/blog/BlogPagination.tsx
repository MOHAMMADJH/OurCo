import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if there's a gap after page 1
    if (rangeStart > 2) {
      pages.push("...");
    }
    
    // Add pages in the calculated range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap before the last page
    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-gray-400"
            >
              ...
            </span>
          );
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page as number)}
            className={`h-9 w-9 ${currentPage === page
              ? "bg-[#FF6B00] text-white hover:bg-[#FF8533]"
              : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
          >
            {page}
          </Button>
        );
      })}

      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BlogPagination;