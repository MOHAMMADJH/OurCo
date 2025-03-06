import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Image, ImagePlus } from "lucide-react";
import projectService, { ProjectImage } from "@/lib/project-service";
import ProjectImagesDialog from "./ProjectImagesDialog";
import { API_BASE_URL } from "@/lib/constants";

interface ProjectImagesPreviewProps {
  projectId: string;
}

const ProjectImagesPreview = ({ projectId }: ProjectImagesPreviewProps) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjectImages(projectId);
        setImages(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching project images:", err);
        setError("فشل في تحميل صور المشروع");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchImages();
    }
  }, [projectId]);

  return (
    <>
      {loading ? (
        <div className="flex overflow-x-auto py-2 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-24 w-32 shrink-0 rounded-md bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : images.length > 0 ? (
        <div className="space-y-4">
          <div className="flex overflow-x-auto py-2 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative h-24 w-32 shrink-0 rounded-md overflow-hidden border border-white/10"
              >
                <img
                  src={`${API_BASE_URL}${image.image}`}
                  alt={image.caption || "صورة المشروع"}
                  className="h-full w-full object-cover"
                />
                {image.is_primary && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#FF6B00]/90 text-white text-sm font-medium py-1.5">
                    الصورة الرئيسية
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-white/10 hover:bg-white/5 w-full"
            onClick={() => setImagesDialogOpen(true)}
          >
            <Image className="ml-2 h-4 w-4" />
            إدارة صور المشروع
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center h-32 border border-dashed border-white/20 rounded-md bg-white/5">
            <div className="text-center space-y-2">
              <ImagePlus className="h-10 w-10 mx-auto text-gray-400" />
              <p className="text-gray-300 text-base font-medium">لا توجد صور</p>
              <p className="text-gray-400 text-sm">قم بإضافة صور لعرض مشروعك بشكل أفضل</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-white/10 hover:bg-white/5 w-full font-medium text-base flex items-center justify-center gap-2"
            onClick={() => setImagesDialogOpen(true)}
          >
            <ImagePlus className="h-5 w-5" />
            إضافة صور للمشروع
          </Button>
        </div>
      )}

      <ProjectImagesDialog
        open={imagesDialogOpen}
        onOpenChange={setImagesDialogOpen}
        projectId={projectId}
      />
    </>
  );
};

export default ProjectImagesPreview;
