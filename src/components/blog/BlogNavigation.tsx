import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, FileText, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Separator } from '@/components/ui/separator';

interface BlogNavigationProps {
  postTitle?: string;
  postSlug?: string;
  showHomeLink?: boolean;
}

/**
 * مكون التنقل في المدونة - يعرض شريط التنقل للتنقل بين صفحات المدونة
 */
const BlogNavigation: React.FC<BlogNavigationProps> = ({
  postTitle,
  postSlug,
  showHomeLink = true,
}) => {
  const location = useLocation();
  const { isRTL } = useLanguage();
  
  // تحديد الصفحة الحالية
  const isListPage = location.pathname === '/blog';
  const isPostPage = location.pathname.startsWith('/blog/') && location.pathname !== '/blog';
  
  // الرمز المناسب حسب اتجاه اللغة
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <nav className="mb-8 w-full">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
        {showHomeLink && (
          <>
            <Link to="/" className="flex items-center gap-1 hover:text-white">
              <Home className="h-4 w-4" />
              <span>الرئيسية</span>
            </Link>
            <ArrowIcon className="h-4 w-4" />
          </>
        )}
        
        <Link to="/blog" className={`flex items-center gap-1 ${isListPage ? 'font-medium text-white' : 'hover:text-white'}`}>
          <List className="h-4 w-4" />
          <span>المدونة</span>
        </Link>
        
        {isPostPage && postTitle && (
          <>
            <ArrowIcon className="h-4 w-4" />
            <span className="flex items-center gap-1 font-medium text-white">
              <FileText className="h-4 w-4" />
              <span className="line-clamp-1">{postTitle}</span>
            </span>
          </>
        )}
      </div>
      
      <Separator className="my-4 bg-gray-800" />
      
      <div className="flex justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/blog" className="text-gray-400 hover:text-white">
            <ChevronRight className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            العودة إلى المدونة
          </Link>
        </Button>
        
        {isPostPage && postSlug && (
          <div className="flex gap-2">
            {/* يمكن إضافة روابط للمقال السابق والتالي هنا */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default BlogNavigation;
