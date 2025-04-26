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
import { 
  apiProjectToEntity,
  apiTaskToEntity,
  apiClientToEntity,
  apiTeamMemberToEntity
} from '@/types';

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
      return Array.isArray(response.data) ? response.data.map(apiProjectToEntity) : [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  /**
   * Get a single project by ID
   */
  getProject: async (id: string): Promise<Project> => {
    try {
      const response = await api.get(`/projects/${id}`);
      return apiProjectToEntity(response.data);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new project
   */
  createProject: async (data: CreateProjectData): Promise<Project> => {
    try {
      const response = await api.post('/projects', data);
      return apiProjectToEntity(response.data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  /**
   * Update an existing project
   */
  updateProject: async (id: string, data: UpdateProjectData): Promise<Project> => {
    try {
      const response = await api.patch(`/projects/${id}`, data);
      return apiProjectToEntity(response.data);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
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
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all tasks for a project
   */
  getTasks: async (projectId: string): Promise<Task[]> => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      // Map raw API data to canonical Task type
      return Array.isArray(response.data) ? response.data.map(apiTaskToEntity) : [];
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new task for a project
   */
  createTask: async (projectId: string, data: any): Promise<Task> => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, data);
      // Map raw API data to canonical Task type
      return apiTaskToEntity(response.data);
    } catch (error) {
      console.error(`Error creating task for project ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing task
   */
  updateTask: async (taskId: string, data: any): Promise<Task> => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, data);
      // Map raw API data to canonical Task type
      return apiTaskToEntity(response.data);
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
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
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Get all clients
   */
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await api.get('/clients');
      // Map raw API data to canonical Client type
      return Array.isArray(response.data) ? response.data.map(apiClientToEntity) : [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  /**
   * Create a new client
   */
  createClient: async (data: any): Promise<Client> => {
    try {
      const response = await api.post('/clients', data);
      // Map raw API data to canonical Client type
      return apiClientToEntity(response.data);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  /**
   * Update an existing client
   */
  updateClient: async (id: string, data: any): Promise<Client> => {
    try {
      const response = await api.patch(`/clients/${id}`, data);
      // Map raw API data to canonical Client type
      return apiClientToEntity(response.data);
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
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
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all team members
   */
  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const response = await api.get('/team-members');
      // Map raw API data to canonical TeamMember type
      return Array.isArray(response.data) ? response.data.map(apiTeamMemberToEntity) : [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },
};
