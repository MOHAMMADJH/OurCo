import { API_BASE_URL } from './constants';
import { authService } from './auth-service';
import { Project as EntityProject } from '@/entities/project/model/types';
import { APIProject, apiProjectToEntity } from '@/types';

export interface ProjectImage {
  id: string;
  image: string;
  caption?: string;
  is_primary: boolean;
  uploaded_at: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  client_id: string;
  status: "active" | "completed" | "pending";
  deadline: string;
  budget: number;
  progress?: number;
  client?: { id: string; name: string; } | string;
}

// Helper function to convert API response to Entity format
function mapApiResponseToEntityProjects(apiProjects: APIProject[]): EntityProject[] {
  return apiProjects.map(apiProjectToEntity);
}

const projectService = {
  /**
   * Get all projects
   */
  async getProjects(): Promise<EntityProject[]> {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.warn('No authentication token found');
        return [];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/projects/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching projects: ${response.status}`);
      }
      
      const data = await response.json();
      return mapApiResponseToEntityProjects(data.results || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },
  
  /**
   * Get a project by ID
   */
  async getProject(id: string): Promise<APIProject> {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching project: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Create a new project
  async createProject(projectData: ProjectFormData): Promise<EntityProject> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Format data for the API
      const formattedData = {
        title: projectData.title,
        description: projectData.description,
        client_id: projectData.client_id ? String(projectData.client_id) : null,
        status: projectData.status,
        deadline: projectData.deadline,
        budget: typeof projectData.budget === 'number' ? parseFloat(projectData.budget.toFixed(2)) : 0,
        progress: projectData.progress || 0,
      };

      console.log("Creating project with data:", formattedData);

      const response = await fetch(`${API_BASE_URL}/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.detail || 'Failed to create project');
      }

      const data = await response.json();
      return apiProjectToEntity(data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update an existing project
  async updateProject(id: string, projectData: Partial<ProjectFormData>): Promise<EntityProject> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Format data for the API
      const formattedData = {
        ...projectData,
        client_id: projectData.client_id ? String(projectData.client_id) : undefined,
        budget: typeof projectData.budget === 'number' ? parseFloat(projectData.budget.toFixed(2)) : undefined,
      };

      console.log("Sending to API:", formattedData);

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.detail || 'Failed to update project');
      }

      const data = await response.json();
      return apiProjectToEntity(data);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Update project progress
  async updateProgress(id: string, progress: number, note?: string): Promise<EntityProject> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/update_progress/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          progress,
          note
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update project progress');
      }

      const data = await response.json();
      return apiProjectToEntity(data);
    } catch (error) {
      console.error('Error updating project progress:', error);
      throw error;
    }
  },

  // Get project images
  async getProjectImages(id: string): Promise<ProjectImage[]> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/images/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project images');
      }
      const data = await response.json();
      // Ensure we return an array, handling both array response and results property
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Error fetching project images:', error);
      throw error;
    }
  },

  // Upload a project image
  async uploadProjectImage(id: string, formData: FormData): Promise<ProjectImage> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/upload_image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload project image');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  },

  // Delete a project image
  async deleteProjectImage(projectId: string, imageId: string): Promise<void> {
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
        throw new Error('Failed to delete project image');
      }
    } catch (error) {
      console.error('Error deleting project image:', error);
      throw error;
    }
  }
};

export default projectService;