import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PostSchedulerProps {
  /**
   * The currently selected date and time
   */
  value?: Date | null;
  
  /**
   * Callback function when date or time changes
   */
  onChange: (date: Date | null) => void;
  
  /**
   * Minimum allowed date (defaults to today)
   */
  minDate?: Date;
  
  /**
   * CSS class name for styling
   */
  className?: string;
}

/**
 * Component for scheduling post publication date and time
 */
const PostScheduler: React.FC<PostSchedulerProps> = ({
  value,
  onChange,
  minDate = new Date(),
  className
}) => {
  const [date, setDate] = useState<Date | null>(value || null);
  const [timeString, setTimeString] = useState<string>(
    value ? format(value, 'HH:mm') : '12:00'
  );

  // Update parent component when date or time changes
  useEffect(() => {
    if (date) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      onChange(newDate);
    } else {
      onChange(null);
    }
  }, [date, timeString, onChange]);

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeString(e.target.value);
  };

  // Clear selected date and time
  const handleClear = () => {
    setDate(null);
    setTimeString('12:00');
    onChange(null);
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
              onSelect={(day) => setDate(day)}
              initialFocus
              disabled={(date) => date < minDate}
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
    </div>
  );
};

export default PostScheduler;
