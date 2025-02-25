import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface MessageReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  onSend: (data: { subject: string; content: string }) => void;
}

const MessageReplyDialog = ({
  open,
  onOpenChange,
  recipientName,
  recipientEmail,
  subject,
  onSend,
}: MessageReplyDialogProps) => {
  const [replySubject, setReplySubject] = React.useState(`رد: ${subject}`);
  const [replyContent, setReplyContent] = React.useState("");

  const handleSend = () => {
    onSend({
      subject: replySubject,
      content: replyContent,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>الرد على الرسالة</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">إلى:</p>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium">{recipientName}</p>
              <p className="text-sm text-gray-400">{recipientEmail}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">الموضوع:</p>
            <Input
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              className="border-white/10 bg-white/5 text-right text-white"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">الرسالة:</p>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[200px] border-white/10 bg-white/5 text-right text-white"
              placeholder="اكتب ردك هنا..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="border-white/10 hover:bg-white/5"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSend}
            className="bg-[#FF6B00] hover:bg-[#FF8533]"
            disabled={!replyContent.trim()}
          >
            إرسال
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageReplyDialog;
