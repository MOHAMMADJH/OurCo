import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, PauseCircle, EyeOff } from 'lucide-react';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived'
}

interface PostStatusBadgeProps {
  status: PostStatus;
  className?: string;
}

/**
 * Component for displaying post status with appropriate styling and icon
 */
const PostStatusBadge: React.FC<PostStatusBadgeProps> = ({ status, className = '' }) => {
  // Define status configurations
  const statusConfig = {
    [PostStatus.DRAFT]: {
      label: 'مسودة',
      icon: <PauseCircle className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />,
      variant: 'outline' as const,
      className: 'border-gray-500 text-gray-500'
    },
    [PostStatus.PUBLISHED]: {
      label: 'منشور',
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />,
      variant: 'default' as const,
      className: 'bg-green-600 hover:bg-green-700'
    },
    [PostStatus.SCHEDULED]: {
      label: 'مجدول',
      icon: <Clock className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />,
      variant: 'default' as const,
      className: 'bg-blue-600 hover:bg-blue-700'
    },
    [PostStatus.ARCHIVED]: {
      label: 'مؤرشف',
      icon: <EyeOff className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />,
      variant: 'outline' as const,
      className: 'border-gray-500 text-gray-500'
    }
  };

  // Get config for current status
  const config = statusConfig[status] || statusConfig[PostStatus.DRAFT];

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${className} flex items-center`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default PostStatusBadge;
