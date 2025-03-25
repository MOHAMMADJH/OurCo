import { API_BASE_URL } from './constants';

// Size threshold for automatic direct upload (300KB)
export const S3_UPLOAD_SIZE_THRESHOLD = 300 * 1024;

/**
 * S3 Service for handling direct uploads to Wasabi S3
 * Provides functionality to get presigned URLs and upload files directly to S3
 */
export interface PresignedUrlResponse {
  presigned_url: string;
  public_url: string;
  file_key: string;
}

export interface PresignedUrlRequest {
  file_name: string;
  file_type: string;
  folder?: string;
}

const s3Service = {
  /**
   * Determines if a file should be uploaded directly to S3 based on its size
   * @param fileSize Size of the file in bytes
   * @returns Boolean indicating if direct upload should be used
   */
  shouldUseDirectUpload(fileSize: number): boolean {
    return fileSize > S3_UPLOAD_SIZE_THRESHOLD;
  },
  /**
   * Get a presigned URL for direct upload to S3
   * @param fileData Information about the file to upload
   * @returns Object containing presigned URL and public URL
   */
  async getPresignedUrl(fileData: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/s3/presigned-url/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fileData),
      });

      if (!response.ok) {
        throw new Error('Failed to get presigned URL');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw error;
    }
  },

  /**
   * Upload a file directly to S3 using a presigned URL
   * @param file File to upload
   * @param presignedUrl Presigned URL for the upload
   * @param onProgress Optional callback for upload progress
   * @returns Promise that resolves when upload is complete
   */
  async uploadToS3(
    file: File, 
    presignedUrl: string, 
    onProgress?: (progress: number) => void
  ): Promise<void> {
    try {
      // Use XHR for better cross-browser compatibility and progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };
      }
      
      // Create a promise to handle the upload completion
      return new Promise((resolve, reject) => {
        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Network error occurred during upload'));
        };
        
        xhr.send(file);
      });
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  },

  /**
   * Upload a file to the server, which will then upload it to S3
   * This is a fallback method when direct upload fails
   * @param file File to upload
   * @param folder Optional folder path within the S3 bucket
   * @param onProgress Optional callback for upload progress
   * @returns Public URL of the uploaded file
   */
  async uploadViaServer(
    file: File,
    folder?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      // Simulate progress for server upload
      let progressInterval: number | null = null;
      if (onProgress) {
        onProgress(10); // Start with 10%
        progressInterval = window.setInterval(() => {
          onProgress((prev) => {
            if (prev >= 90) {
              if (progressInterval) clearInterval(progressInterval);
              return 90;
            }
            return prev + 5;
          });
        }, 500);
      }

      // Send to server
      const response = await fetch(`${API_BASE_URL}/api/s3/upload-to-s3/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // Clear interval if it exists
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      if (!response.ok) {
        throw new Error('Server-side S3 upload failed');
      }

      const result = await response.json();
      
      // Complete progress
      if (onProgress) {
        onProgress(100);
      }

      return result.public_url;
    } catch (error) {
      console.error('Error in server upload:', error);
      throw error;
    }
  },

  /**
   * Complete upload process: get presigned URL and upload file to S3
   * Falls back to server upload if direct upload fails
   * @param file File to upload
   * @param folder Optional folder path within the S3 bucket
   * @param onProgress Optional callback for upload progress
   * @returns Public URL of the uploaded file
   */
  async uploadFile(
    file: File, 
    folder?: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Step 1: Get presigned URL
      const { presigned_url, public_url, file_key } = await this.getPresignedUrl({
        file_name: file.name,
        file_type: file.type,
        folder
      });
      
      // Step 2: Try direct S3 upload
      try {
        await this.uploadToS3(file, presigned_url, onProgress);
        return public_url;
      } catch (directUploadError) {
        console.warn('Direct S3 upload failed, falling back to server upload:', directUploadError);
        
        // If direct upload fails, try server upload as fallback
        if (onProgress) onProgress(0); // Reset progress
        return await this.uploadViaServer(file, folder, onProgress);
      }
    } catch (error) {
      console.error('Error in complete upload process:', error);
      throw error;
    }
  }
};

export default s3Service;
