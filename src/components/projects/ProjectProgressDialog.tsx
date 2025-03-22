import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";
import { Loader2, CheckCheck, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

interface ProjectProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentProgress: number;
  onProgressUpdated: () => void;
}

const ProjectProgressDialog = ({
  open,
  onOpenChange,
  projectId,
  currentProgress,
  onProgressUpdated,
}: ProjectProgressDialogProps) => {
  const [progress, setProgress] = useState(currentProgress);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setProgress(currentProgress);
      setNote("");
      setError(null);
      setSuccess(false);
    }
  }, [open, currentProgress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/update_progress/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          progress: progress,
          note: note.trim() || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update project progress');
      }

      setSuccess(true);
      onProgressUpdated();
      
      // Close dialog after success
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث نسبة الإنجاز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white">
        <DialogHeader>
          <DialogTitle>تحديث نسبة إنجاز المشروع</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500 mb-4 flex gap-2 items-start">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-500/10 p-4 text-green-500 mb-4 flex gap-2 items-start">
            <CheckCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>تم تحديث نسبة الإنجاز بنجاح!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">نسبة الإنجاز</label>
              <span className="text-xl font-bold text-[#FF6B00]">{progress}%</span>
            </div>
            <div className="px-1">
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={1}
                defaultValue={[currentProgress]}
                className="[&_[role=slider]]:bg-[#FF6B00] [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                // Custom styling can be applied through className or other supported props
                // The custom properties have been removed as they don't exist on the component
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ملاحظات (اختياري)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أضف أي ملاحظات أو تفاصيل حول تقدم المشروع..."
              className="min-h-[100px] border-white/10 bg-white/5 text-right text-white"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 hover:bg-white/5"
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-[#FF6B00] hover:bg-[#FF8533]"
              disabled={loading || progress === currentProgress}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                "تحديث نسبة الإنجاز"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectProgressDialog;
