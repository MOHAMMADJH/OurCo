import { API_BASE_URL } from './constants';

export interface ProjectImage {
  id: string;
  image: string;
  caption?: string;
  is_primary: boolean;
  uploaded_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "pending";
  deadline: string;
  budget: number;
  progress: number;
  client: {
    id: string;
    name: string;
  };
  images: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  client_id: string;
  status: "active" | "completed" | "pending";
  deadline: string;
  budget: number;
  progress?: number;
}

// Convert API project format to frontend project format
const mapApiProjectToProject = (apiProject: any): Project => {
  // Make sure client is properly formatted
  const client = typeof apiProject.client === 'object' && apiProject.client !== null
    ? apiProject.client 
    : { id: apiProject.client_id || '', name: apiProject.client_name || 'Unknown Client' };

  // Make sure images are properly formatted and include full URLs
  const images = Array.isArray(apiProject.images)
    ? apiProject.images.map(img => ({
        ...img,
        image: img.image ? (img.image.startsWith('http') ? img.image : `${API_BASE_URL}${img.image.startsWith('/') ? '' : '/'}${img.image}`) : ''
      }))
    : [];

  return {
    id: apiProject.id.toString(),
    title: apiProject.title,
    description: apiProject.description,
    status: apiProject.status as "active" | "completed" | "pending",
    client,
    deadline: apiProject.deadline || new Date().toISOString().split('T')[0],
    budget: typeof apiProject.budget === 'number' ? apiProject.budget : 0,
    progress: typeof apiProject.progress === 'number' ? apiProject.progress : 0,
    images,
    created_at: apiProject.created_at,
    updated_at: apiProject.updated_at,
  };
};

const projectService = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      return (data.results || []).map(mapApiProjectToProject);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get a single project by ID
  async getProject(id: string): Promise<Project> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      return mapApiProjectToProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Create a new project
  async createProject(projectData: ProjectFormData): Promise<Project> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: projectData.title,
          description: projectData.description,
          client_id: projectData.client_id,
          status: projectData.status,
          deadline: projectData.deadline,
          budget: projectData.budget,
          progress: projectData.progress || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create project');
      }

      const data = await response.json();
      return mapApiProjectToProject(data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update an existing project
  async updateProject(id: string, projectData: Partial<ProjectFormData>): Promise<Project> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update project');
      }

      const data = await response.json();
      return mapApiProjectToProject(data);
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
  async updateProgress(id: string, progress: number, note?: string): Promise<Project> {
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
      return mapApiProjectToProject(data);
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