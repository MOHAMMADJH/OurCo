import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface PostSchedulerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const PostScheduler = ({ selectedDate, onDateSelect }: PostSchedulerProps) => {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">جدولة النشر</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            locale={ar}
            className="rounded-md border border-white/10"
          />

          {selectedDate && (
            <div className="text-center text-sm text-gray-400">
              سيتم نشر المقال في {format(selectedDate, "PPP", { locale: ar })}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full border-white/10 text-white hover:bg-white/10"
            onClick={() => onDateSelect(undefined)}
          >
            إلغاء الجدولة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostScheduler;
