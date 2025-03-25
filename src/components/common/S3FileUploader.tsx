import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlertCircle, Upload } from "lucide-react";
import s3Service from "@/lib/s3-service";

// Import the threshold from s3-service
import { S3_UPLOAD_SIZE_THRESHOLD } from "@/lib/s3-service";

interface S3FileUploaderProps {
  onUploadComplete: (fileUrl: string) => void;
  onUploadError?: (error: Error) => void;
  folder?: string;
  accept?: string;
  buttonText?: string;
  className?: string;
  showDirectUploadToggle?: boolean;
  maxSizeInMB?: number;
}

const S3FileUploader: React.FC<S3FileUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  folder = "uploads",
  accept = "*/*",
  buttonText = "اختر ملفًا",
  className = "",
  showDirectUploadToggle = true,
  maxSizeInMB = 50, // Default max size: 50MB
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useDirectUpload, setUseDirectUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`حجم الملف يتجاوز الحد الأقصى (${maxSizeInMB} ميجابايت)`);
        return;
      }
      
      setSelectedFile(file);
      
      // Automatically use direct upload for large files
      if (s3Service.shouldUseDirectUpload(file.size)) {
        setUseDirectUpload(true);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Use S3 direct upload
      if (useDirectUpload) {
        const publicUrl = await s3Service.uploadFile(
          selectedFile,
          folder,
          (progress) => setUploadProgress(progress)
        );
        
        onUploadComplete(publicUrl);
      } 
      // Use traditional backend upload
      else {
        // Create FormData
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        // Get authentication token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 300);
        
        // Upload to backend
        const response = await fetch(`/api/upload/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        
        const data = await response.json();
        onUploadComplete(data.file_url);
      }
      
      // Reset after successful upload
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const error = err as Error;
      setError(`خطأ في رفع الملف: ${error.message}`);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        <Button 
          type="button" 
          onClick={triggerFileInput}
          variant="outline"
          className="border-white/20 bg-white/5 hover:bg-white/10"
          disabled={uploading}
        >
          <Upload className="h-4 w-4 ml-2" />
          {buttonText}
        </Button>
        
        {selectedFile && (
          <div className="text-sm text-white mt-2">
            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded-md">
          {error}
        </div>
      )}
      
      {selectedFile && showDirectUploadToggle && (
        <div className="flex items-center justify-between gap-2 p-2 bg-blue-900/20 rounded-md">
          <div className="flex items-center gap-2">
            <Switch
              id="direct-upload-toggle"
              checked={useDirectUpload}
              onCheckedChange={setUseDirectUpload}
              disabled={s3Service.shouldUseDirectUpload(selectedFile.size)}
            />
            <Label htmlFor="direct-upload-toggle" className="cursor-pointer text-sm">
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
                <p>الرفع المباشر مناسب للملفات الكبيرة (أكبر من 300 كيلوبايت)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
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
      
      {selectedFile && !uploading && (
        <Button
          type="button"
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200"
        >
          <Upload className="h-4 w-4 ml-2" />
          رفع الملف{useDirectUpload ? ' مباشرة إلى S3' : ''}
        </Button>
      )}
      
      {uploading && (
        <Button
          type="button"
          disabled
          className="w-full bg-gray-600 text-white cursor-not-allowed"
        >
          <span className="ml-2">جاري الرفع...</span>
          <Skeleton className="h-4 w-4 rounded-full animate-spin" />
        </Button>
      )}
    </div>
  );
};

export default S3FileUploader;
