import { API_BASE_URL } from './constants';
import { authService } from './auth-service';

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
  client?: { id: string; name: string; } | string;
}

// Convert API project format to frontend project format
const mapApiProjectToProject = (apiProject: any): Project => {
  console.log("Raw API Project data:", apiProject);
  
  // Map client data properly
  // Default client data to ensure it's never null
  let clientData = {
    id: '0',
    name: 'عميل غير معروف'
  };
  
  // Case 1: client_details is available (full client object from API)
  if (apiProject.client_details) {
    clientData = {
      id: String(apiProject.client_details.id),
      name: apiProject.client_details.name || 'عميل غير معروف'
    };
  }
  // Case 2: client is a full object
  else if (apiProject.client && typeof apiProject.client === 'object') {
    clientData = {
      id: String(apiProject.client.id),
      name: apiProject.client.name || 'عميل غير معروف'
    };
  }
  // Case 3: client is just an ID
  else if (apiProject.client) {
    clientData = {
      id: String(apiProject.client),
      name: apiProject.client_name || 'عميل معرف بالرقم'
    };
  }

  // Format budget to always be a number with 2 decimal places
  const budget = typeof apiProject.budget === 'number' 
    ? parseFloat(apiProject.budget.toFixed(2)) 
    : (apiProject.budget ? parseFloat(parseFloat(apiProject.budget).toFixed(2)) : 0);
  
  console.log("Mapping project from API:", {
    originalBudget: apiProject.budget,
    formattedBudget: budget,
    originalClient: apiProject.client,
    clientDetails: apiProject.client_details,
    formattedClient: clientData
  });

  return {
    id: apiProject.id,
    title: apiProject.title,
    description: apiProject.description,
    status: apiProject.status,
    deadline: apiProject.deadline,
    budget: budget,
    progress: apiProject.progress || 0,
    client: clientData,
    images: Array.isArray(apiProject.images) ? apiProject.images : [],
    created_at: apiProject.created_at,
    updated_at: apiProject.updated_at,
  };
};

const projectService = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Add authorization header only if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Use fetch with no-cors mode to avoid CORS issues on Vercel
      const response = await fetch(`${API_BASE_URL}/api/projects/`, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        // Check if the error is due to authentication
        if (response.status === 401) {
          // Return empty array for public access instead of throwing error
          console.warn('Unauthenticated access to projects, showing public data only');
          return [];
        }
        console.error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      return (data.results || []).map(mapApiProjectToProject);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Return empty array instead of throwing error for public access
      return [];
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