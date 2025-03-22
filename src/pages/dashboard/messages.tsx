import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessageReplyDialog from "@/components/messages/MessageReplyDialog";
import MessageDeleteDialog from "@/components/messages/MessageDeleteDialog";
import {
  Search,
  Star,
  Mail,
  Phone,
  Calendar,
  Clock,
  Archive,
  Trash2,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  content: string;
  date: string;
  time: string;
  status: "new" | "read" | "archived";
  serviceType: "website" | "marketing" | "design" | "consultation";
  priority: "high" | "medium" | "low";
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderName: "محمد أحمد",
    senderEmail: "mohammed@example.com",
    senderPhone: "+966 12 345 6789",
    subject: "طلب تطوير موقع إلكتروني",
    content: "أرغب في الحصول على عرض سعر لتطوير موقع إلكتروني لشركتي...",
    date: "2024-03-20",
    time: "10:30",
    status: "new",
    serviceType: "website",
    priority: "high",
  },
  {
    id: "2",
    senderName: "سارة محمد",
    senderEmail: "sara@example.com",
    senderPhone: "+966 12 345 6788",
    subject: "استفسار عن خدمات التسويق",
    content: "أود معرفة المزيد عن خدمات التسويق الرقمي التي تقدمونها...",
    date: "2024-03-19",
    time: "15:45",
    status: "read",
    serviceType: "marketing",
    priority: "medium",
  },
  {
    id: "3",
    senderName: "عبدالله خالد",
    senderEmail: "abdullah@example.com",
    senderPhone: "+966 12 345 6787",
    subject: "طلب تصميم هوية بصرية",
    content: "نحتاج إلى تصميم هوية بصرية كاملة لمشروعنا الجديد...",
    date: "2024-03-18",
    time: "09:15",
    status: "archived",
    serviceType: "design",
    priority: "low",
  },
];

const getServiceTypeColor = (type: Message["serviceType"]) => {
  switch (type) {
    case "website":
      return "bg-blue-500/10 text-blue-500";
    case "marketing":
      return "bg-green-500/10 text-green-500";
    case "design":
      return "bg-purple-500/10 text-purple-500";
    case "consultation":
      return "bg-yellow-500/10 text-yellow-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getServiceTypeText = (type: Message["serviceType"]) => {
  switch (type) {
    case "website":
      return "تطوير مواقع";
    case "marketing":
      return "تسويق رقمي";
    case "design":
      return "تصميم";
    case "consultation":
      return "استشارة";
    default:
      return type;
  }
};

const getPriorityColor = (priority: Message["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-500";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500";
    case "low":
      return "bg-green-500/10 text-green-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getPriorityText = (priority: Message["priority"]) => {
  switch (priority) {
    case "high":
      return "عالية";
    case "medium":
      return "متوسطة";
    case "low":
      return "منخفضة";
    default:
      return priority;
  }
};

const MessagesPage = () => {
  const [messages, setMessages] = React.useState(mockMessages);
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [replyDialogOpen, setReplyDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(
    null,
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleArchive = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: "archived" } : msg,
      ),
    );
  };

  const handleDelete = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    setDeleteDialogOpen(false);
  };

  const handleReply = (data: { subject: string; content: string }) => {
    console.log("Sending reply:", data);
    // Here you would typically send the reply to your backend
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    return message.status === selectedTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <DashboardHeader
        title="الرسائل"
        subtitle="إدارة الرسائل والاستفسارات الواردة"
      />

      <div className="p-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="bg-white/5">
              <TabsTrigger value="all" className="text-white">
                الكل
              </TabsTrigger>
              <TabsTrigger value="new" className="text-white">
                جديد
              </TabsTrigger>
              <TabsTrigger value="read" className="text-white">
                مقروء
              </TabsTrigger>
              <TabsTrigger value="archived" className="text-white">
                مؤرشف
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-96">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث في الرسائل..."
                className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid gap-4">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className="border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      {/* Message Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-2">
                            <Badge
                              className={getServiceTypeColor(
                                message.serviceType,
                              )}
                            >
                              {getServiceTypeText(message.serviceType)}
                            </Badge>
                            <Badge
                              className={getPriorityColor(message.priority)}
                            >
                              {getPriorityText(message.priority)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {message.date}
                            <Clock className="h-4 w-4 mr-2" />
                            {message.time}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white">
                          {message.subject}
                        </h3>

                        <p className="text-gray-300">{message.content}</p>
                      </div>

                      {/* Sender Info */}
                      <div className="w-full space-y-3 rounded-lg bg-white/5 p-4 lg:w-80">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Star className="h-4 w-4 text-[#FF6B00]" />
                          <span className="font-medium text-white">
                            {message.senderName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail className="h-4 w-4" />
                          {message.senderEmail}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="h-4 w-4" />
                          {message.senderPhone}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          setSelectedMessage(message);
                          setReplyDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        رد
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleArchive(message.id)}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        أرشفة
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => {
                          setSelectedMessage(message);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Reply Dialog */}
        <MessageReplyDialog
          open={replyDialogOpen}
          onOpenChange={setReplyDialogOpen}
          recipientName={selectedMessage?.senderName || ""}
          recipientEmail={selectedMessage?.senderEmail || ""}
          subject={selectedMessage?.subject || ""}
          onSend={handleReply}
        />

        {/* Delete Dialog */}
        <MessageDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => selectedMessage && handleDelete(selectedMessage.id)}
        />
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
