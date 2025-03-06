import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Trash2, Upload, CheckCircle, XCircle, Image } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { API_BASE_URL } from "@/lib/constants";

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
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', caption);
      formData.append('is_primary', isPrimary.toString());

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

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

      // Reset form
      setSelectedFile(null);
      setCaption("");
      setIsPrimary(false);
      
      // Reload images
      fetchImages();
      setError(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
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
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/upload_image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image_id: imageId,
          is_primary: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set primary image');
      }

      // Update the images list locally
      setImages(
        images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      );
      setError(null);
    } catch (err) {
      console.error('Error setting primary image:', err);
      setError('حدث خطأ أثناء تعيين الصورة الرئيسية');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إدارة صور المشروع</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
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
                          <div className="flex gap-2 mt-4">
                            {!image.is_primary && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetPrimary(image.id)}
                                className="border-white/10 hover:bg-blue-500/20 hover:text-blue-500"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                تعيين كصورة رئيسية
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id)}
                              className="border-white/10 hover:bg-red-500/20 hover:text-red-500"
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
              <CardContent className="p-4">
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
                        <span>جاري الرفع...</span>
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
                    className="w-full bg-[#FF6B00] hover:bg-[#FF8533]"
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
                        رفع الصورة
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
