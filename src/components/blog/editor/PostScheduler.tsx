import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PostStatus } from "../common/PostStatusBadge";

interface PostSchedulerProps {
  /**
   * Callback function when date changes
   */
  onDateSelect: (date?: Date) => void;
  
  /**
   * Callback function when status changes
   */
  onStatusChange: (status: 'draft' | 'published' | 'scheduled' | 'archived') => void;
  
  /**
   * Initial date value
   */
  initialDate?: Date;
  
  /**
   * Initial status
   */
  initialStatus: 'draft' | 'published' | 'scheduled' | 'archived';
  
  /**
   * CSS class name for styling
   */
  className?: string;
}

/**
 * Component for scheduling post publication date and time
 */
const PostScheduler: React.FC<PostSchedulerProps> = ({
  onDateSelect,
  onStatusChange,
  initialDate,
  initialStatus,
  className
}) => {
  const [date, setDate] = useState<Date | null>(initialDate || null);
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>(initialStatus);
  const [timeString, setTimeString] = useState<string>(
    initialDate ? format(initialDate, 'HH:mm') : '12:00'
  );

  // Update date when it changes
  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    onDateSelect(newDate || undefined);
  };

  // Update status when it changes
  const handleStatusChange = (newStatus: 'draft' | 'published' | 'scheduled' | 'archived') => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeString(e.target.value);
  };

  // Clear selected date and time
  const handleClear = () => {
    setDate(null);
    setTimeString('12:00');
    onDateSelect(undefined);
  };

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      <Label htmlFor="schedule-date">تاريخ النشر</Label>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 rtl:space-x-reverse">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-right sm:w-[240px]',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
              {date ? format(date, 'PPP', { locale: ar }) : 'اختر تاريخ'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date as any}
              onSelect={(day) => handleDateChange(day)}
              initialFocus
              locale={ar}
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Input
            id="schedule-time"
            type="time"
            value={timeString}
            onChange={handleTimeChange}
            className="w-[120px]"
            disabled={!date}
          />
          
          {date && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClear}
              className="h-9"
            >
              مسح
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <PostStatus status={status} />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleStatusChange('draft')}
          className={cn('h-9', status === 'draft' && 'bg-primary-foreground text-white')}
        >
          مسودة
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleStatusChange('published')}
          className={cn('h-9', status === 'published' && 'bg-primary-foreground text-white')}
        >
          منشور
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleStatusChange('scheduled')}
          className={cn('h-9', status === 'scheduled' && 'bg-primary-foreground text-white')}
        >
          مخطط
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleStatusChange('archived')}
          className={cn('h-9', status === 'archived' && 'bg-primary-foreground text-white')}
        >
          مؤرشف
        </Button>
      </div>
    </div>
  );
};

export default PostScheduler;
