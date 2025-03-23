import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import S3FileUploader from "../common/S3FileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { AlertCircle, Check, Image as ImageIcon } from "lucide-react";

/**
 * Example component demonstrating how to use the S3FileUploader in different contexts
 */
const S3UploaderExample: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImageUploadComplete = (url: string) => {
    setImageUrl(url);
    setUploadError(null);
    setSuccessMessage("تم رفع الصورة بنجاح!");
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleDocumentUploadComplete = (url: string) => {
    setDocumentUrl(url);
    setUploadError(null);
    setSuccessMessage("تم رفع المستند بنجاح!");
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleUploadError = (error: Error) => {
    setUploadError(error.message);
    setSuccessMessage(null);
  };

  return (
    <Card className="border-white/10 bg-[#0B1340] text-white">
      <CardHeader>
        <CardTitle className="text-xl">مثال على استخدام S3FileUploader</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="mb-4 bg-white/10">
            <TabsTrigger value="images" className="data-[state=active]:bg-blue-600">صور</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600">مستندات</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-blue-600">كيفية الاستخدام</TabsTrigger>
          </TabsList>
          
          <TabsContent value="images" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">رفع صورة جديدة</h3>
                <S3FileUploader 
                  onUploadComplete={handleImageUploadComplete}
                  onUploadError={handleUploadError}
                  folder="blog/images"
                  accept="image/*"
                  buttonText="اختر صورة"
                  maxSizeInMB={10}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">معاينة الصورة</h3>
                {imageUrl ? (
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <img 
                      src={imageUrl} 
                      alt="Uploaded preview" 
                      className="w-full h-auto max-h-[300px] object-contain bg-black/20"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-gray-400 flex flex-col items-center justify-center h-[200px]">
                    <ImageIcon className="h-16 w-16 text-gray-500 mb-4" />
                    <p>لم يتم رفع أي صورة بعد</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">رفع مستند جديد</h3>
                <S3FileUploader 
                  onUploadComplete={handleDocumentUploadComplete}
                  onUploadError={handleUploadError}
                  folder="documents"
                  accept=".pdf,.doc,.docx,.xlsx,.pptx"
                  buttonText="اختر مستندًا"
                  maxSizeInMB={20}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">تفاصيل المستند</h3>
                {documentUrl ? (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                    <p className="font-semibold mb-2">تم رفع المستند بنجاح:</p>
                    <a 
                      href={documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {documentUrl}
                    </a>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="border-white/20 bg-white/5 hover:bg-white/10"
                        onClick={() => window.open(documentUrl, '_blank')}
                      >
                        فتح المستند
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-gray-400 flex flex-col items-center justify-center h-[200px]">
                    <p>لم يتم رفع أي مستند بعد</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="usage" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">كيفية استخدام مكون S3FileUploader</h3>
              
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-white overflow-x-auto rtl:text-left">
{`// استيراد المكون
import S3FileUploader from "@/components/common/S3FileUploader";

// استخدام المكون في واجهة المستخدم
<S3FileUploader 
  onUploadComplete={(url) => console.log('تم الرفع:', url)}
  onUploadError={(error) => console.error('خطأ:', error)}
  folder="blog/images"
  accept="image/*"
  buttonText="اختر صورة"
  maxSizeInMB={10}
/>`}
                </pre>
              </div>
              
              <h4 className="font-semibold mt-4">الخصائص المتاحة:</h4>
              <ul className="list-disc list-inside space-y-2 pr-4">
                <li><code className="bg-white/10 px-1 rounded">onUploadComplete</code>: دالة تستدعى عند اكتمال الرفع بنجاح</li>
                <li><code className="bg-white/10 px-1 rounded">onUploadError</code>: دالة اختيارية تستدعى عند حدوث خطأ</li>
                <li><code className="bg-white/10 px-1 rounded">folder</code>: مجلد اختياري في S3 لتخزين الملف فيه</li>
                <li><code className="bg-white/10 px-1 rounded">accept</code>: أنواع الملفات المقبولة (مثل "image/*")</li>
                <li><code className="bg-white/10 px-1 rounded">buttonText</code>: نص زر اختيار الملف</li>
                <li><code className="bg-white/10 px-1 rounded">maxSizeInMB</code>: الحد الأقصى لحجم الملف بالميجابايت</li>
                <li><code className="bg-white/10 px-1 rounded">showDirectUploadToggle</code>: عرض زر تبديل الرفع المباشر</li>
                <li><code className="bg-white/10 px-1 rounded">className</code>: فئات CSS إضافية للمكون</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        {successMessage && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-md flex items-center">
            <Check className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {uploadError && (
          <div className="mt-4 p-3 bg-red-500/20 text-red-400 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            خطأ: {uploadError}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default S3UploaderExample;
