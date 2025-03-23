import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Trash2, Upload, CheckCircle, XCircle, Image, AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { API_BASE_URL } from "@/lib/constants";
import s3Service from "@/lib/s3-service";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ProjectImagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

interface ProjectImage {
  id: string;
  image: string;
  caption: string;
  is_primary: boolean;
  uploaded_at: string;
}

const ProjectImagesDialog = ({
  open,
  onOpenChange,
  projectId,
}: ProjectImagesDialogProps) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useDirectUpload, setUseDirectUpload] = useState(false);
  const [fileSize, setFileSize] = useState<number>(0);

  useEffect(() => {
    if (open && projectId) {
      fetchImages();
    }
  }, [open, projectId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/images/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project images');
      }

      const data = await response.json();
      setImages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('حدث خطأ أثناء تحميل الصور');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileSize(file.size);
      
      // Automatically switch to direct upload for files larger than 5MB
      if (file.size > 5 * 1024 * 1024) {
        setUseDirectUpload(true);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Choose upload method based on file size or user preference
      if (useDirectUpload) {
        // Direct S3 upload
        await handleDirectS3Upload();
      } else {
        // Traditional backend upload
        await handleBackendUpload();
      }

      // Reset form
      setSelectedFile(null);
      setCaption("");
      setIsPrimary(false);
      setFileSize(0);
      
      // Reload images
      fetchImages();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDirectS3Upload = async () => {
    if (!selectedFile) return;
    
    try {
      // Upload file directly to S3
      const publicUrl = await s3Service.uploadFile(
        selectedFile,
        `projects/${projectId}/images`,
        (progress) => setUploadProgress(progress)
      );
      
      // After successful S3 upload, register the image with the backend
      const token = localStorage.getItem('accessToken');
      
      // Create form data with just the metadata and S3 URL
      const formData = new FormData();
      formData.append('s3_url', publicUrl);
      formData.append('caption', caption);
      formData.append('is_primary', isPrimary.toString());
      
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/register_s3_image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to register S3 image with backend');
      }
      
      setUploadProgress(100);
    } catch (error) {
      console.error('Error in direct S3 upload:', error);
      throw error;
    }
  };

  const handleBackendUpload = async () => {
    if (!selectedFile) return;
    
    // Create form data
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);
    formData.append('is_primary', isPrimary.toString());
    
    // Simulate upload progress for backend upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/upload_image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error in backend upload:', error);
      throw error;
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/delete_image/?image_id=${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Update the images list
      setImages(images.filter((img) => img.id !== imageId));
      setError(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('حدث خطأ أثناء حذف الصورة');
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      setError(null);
      
      // تحديث واجهة المستخدم فورًا لتجربة مستخدم أفضل
      setImages(
        images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      );
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // استخدام النقطة النهائية الجديدة المخصصة لتعيين الصورة الرئيسية
      console.log(`Setting image ${imageId} as primary for project ${projectId}`);
      
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/set_primary_image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image_id: imageId
        }),
      });

      if (!response.ok) {
        console.warn('Failed to update primary image on server, UI updated only');
        
        // في حالة فشل النقطة النهائية الجديدة، المحاولة بالطريقة القديمة
        try {
          const fallbackResponse = await fetch(`${API_BASE_URL}/api/projects/${projectId}/upload_image/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              image_id: imageId
            }),
          });
          
          if (!fallbackResponse.ok) {
            console.error('Both primary image update approaches failed');
          } else {
            console.log('Successfully updated primary image using fallback approach');
            // تحديث قائمة الصور بالبيانات الجديدة من الخادم
            await fetchImages();
          }
        } catch (fallbackError) {
          console.error('Error in fallback approach:', fallbackError);
        }
      } else {
        // النقطة النهائية الجديدة نجحت، تحديث الواجهة بالبيانات المستلمة
        const updatedImages = await response.json();
        setImages(updatedImages);
        console.log('Successfully updated primary image');
      }
    } catch (err) {
      console.error('Error in handleSetPrimary:', err);
      setError('حدث خطأ أثناء تعيين الصورة الرئيسية');
      
      // إعادة تحميل الصور لإظهار الحالة الصحيحة
      fetchImages();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>إدارة صور المشروع</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500 mb-4">
          {error}
        </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_300px] md:grid-cols-1">
          <div>
            <h3 className="text-lg font-semibold mb-4">الصور الحالية</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="border-white/10 bg-white/5">
                    <CardContent className="p-4">
                      <Skeleton className="h-40 w-full rounded-md" />
                      <Skeleton className="h-4 w-1/2 mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-gray-400 flex flex-col items-center justify-center">
                <Image className="h-16 w-16 text-gray-500 mb-4" />
                <p>لا توجد صور لهذا المشروع</p>
                <p className="text-sm mt-2">قم برفع صور من القسم المجاور</p>
              </div>
            ) : (
              <div className="space-y-4">
                {images.map((image) => (
                  <Card
                    key={image.id}
                    className={`border-white/10 ${
                      image.is_primary
                        ? "bg-blue-900/20 border-blue-500/50"
                        : "bg-white/5"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative h-40 w-full md:w-48 flex-shrink-0">
                          <img
                            src={`${API_BASE_URL}${image.image}`}
                            alt={image.caption || "صورة المشروع"}
                            className="h-full w-full object-cover rounded-md"
                          />
                          {image.is_primary && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs">
                              الصورة الرئيسية
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <p className="text-sm font-semibold mb-1">
                            {image.caption || "بدون وصف"}
                          </p>
                          <p className="text-xs text-gray-400 mb-auto">
                            تم الرفع: {new Date(image.uploaded_at).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {!image.is_primary && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetPrimary(image.id)}
                                className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors duration-200"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                تعيين كصورة رئيسية
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id)}
                              className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">رفع صورة جديدة</h3>
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-4 sm:p-5">
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label>اختر صورة</Label>
                    <div className="relative border-2 border-dashed border-white/20 rounded-md p-4 text-center hover:bg-white/5 transition cursor-pointer">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      {selectedFile ? (
                        <p className="text-sm text-white">
                          {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          اضغط هنا لرفع صورة أو اسحب الصورة إلى هنا
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center justify-between gap-2 p-2 bg-blue-900/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="direct-upload"
                          checked={useDirectUpload}
                          onCheckedChange={setUseDirectUpload}
                          disabled={fileSize > 5 * 1024 * 1024}
                        />
                        <Label htmlFor="direct-upload" className="cursor-pointer">
                          الرفع المباشر إلى S3
                        </Label>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <AlertCircle className="h-4 w-4 text-blue-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0B1340] border-white/10 text-white">
                            <p>الرفع المباشر مناسب للملفات الكبيرة (أكبر من 5 ميجابايت)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>وصف الصورة</Label>
                    <Textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="وصف مختصر للصورة..."
                      className="min-h-[60px] border-white/10 bg-white/5 text-right text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                      className="rounded text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <Label htmlFor="isPrimary" className="cursor-pointer">
                      تعيين كصورة رئيسية
                    </Label>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>جاري الرفع{useDirectUpload ? ' المباشر إلى S3' : ''}...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B00]"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed mt-2"
                    disabled={!selectedFile || uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="mr-2">جاري الرفع...</span>
                        <Skeleton className="h-4 w-4 rounded-full animate-spin" />
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        رفع الصورة{useDirectUpload ? ' مباشرة إلى S3' : ''}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImagesDialog;
