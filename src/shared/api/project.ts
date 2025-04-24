import { 
  Project, 
  Task, 
  Client, 
  TeamMember, 
  CreateProjectData, 
  UpdateProjectData, 
  ProjectFilterParams 
} from '@/entities/project/model/types';
import { api } from './base';

/**
 * Project API service
 * Handles all project-related API calls
 */
export const projectApi = {
  /**
   * Get all projects with optional filtering
   */
  getProjects: async (params?: ProjectFilterParams): Promise<Project[]> => {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single project by ID
   */
  getProject: async (id: string): Promise<Project> => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new project
   */
  createProject: async (data: CreateProjectData): Promise<Project> => {
    try {
      const response = await api.post('/projects', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing project
   */
  updateProject: async (id: string, data: UpdateProjectData): Promise<Project> => {
    try {
      const response = await api.patch(`/projects/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a project
   */
  deleteProject: async (id: string): Promise<void> => {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all tasks for a project
   */
  getTasks: async (projectId: string): Promise<Task[]> => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new task for a project
   */
  createTask: async (projectId: string, data: any): Promise<Task> => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing task
   */
  updateTask: async (taskId: string, data: any): Promise<Task> => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a task
   */
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all clients
   */
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new client
   */
  createClient: async (data: any): Promise<Client> => {
    try {
      const response = await api.post('/clients', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing client
   */
  updateClient: async (id: string, data: any): Promise<Client> => {
    try {
      const response = await api.patch(`/clients/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a client
   */
  deleteClient: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clients/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all team members
   */
  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const response = await api.get('/team-members');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
