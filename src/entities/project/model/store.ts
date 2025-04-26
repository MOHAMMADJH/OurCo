import { create } from 'zustand';
import { 
  Project, 
  Task, 
  Client, 
  TeamMember, 
  CreateProjectData, 
  UpdateProjectData, 
  ProjectFilterParams 
} from './types';
import { projectApi } from '@/shared/api/project';

/**
 * Project state interface
 */
interface ProjectState {
  // Projects state
  projects: {
    data: Project[];
    isLoading: boolean;
    error: string | null;
  };
  
  // Current project state
  currentProject: {
    data: Project | null;
    isLoading: boolean;
    error: string | null;
  };
  
  // Tasks state
  tasks: {
    data: Task[];
    isLoading: boolean;
    error: string | null;
  };
  
  // Clients state
  clients: {
    data: Client[];
    isLoading: boolean;
    error: string | null;
  };
  
  // Team members state
  teamMembers: {
    data: TeamMember[];
    isLoading: boolean;
    error: string | null;
  };
  
  // Filters state
  filters: ProjectFilterParams;
}

/**
 * Project store using Zustand
 * Handles project state and operations
 */
export const useProjectStore = create<
  ProjectState & {
    // Projects actions
    fetchProjects: (params?: ProjectFilterParams) => Promise<void>;
    fetchProjectById: (id: string) => Promise<void>;
    createProject: (data: CreateProjectData) => Promise<Project>;
    updateProject: (id: string, data: UpdateProjectData) => Promise<Project>;
    deleteProject: (id: string) => Promise<void>;
    
    // Tasks actions
    fetchTasks: (projectId: string) => Promise<void>;
    createTask: (projectId: string, data: any) => Promise<Task>;
    updateTask: (taskId: string, data: any) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<void>;
    
    // Clients actions
    fetchClients: () => Promise<void>;
    createClient: (data: any) => Promise<Client>;
    updateClient: (id: string, data: any) => Promise<Client>;
    deleteClient: (id: string) => Promise<void>;
    
    // Team members actions
    fetchTeamMembers: () => Promise<void>;
    
    // Filter actions
    setFilters: (filters: ProjectFilterParams) => void;
    clearFilters: () => void;
    
    // Reset actions
    resetCurrentProject: () => void;
    clearErrors: () => void;
  }
>((set, get) => ({
  // Initial state
  projects: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentProject: {
    data: null,
    isLoading: false,
    error: null,
  },
  tasks: {
    data: [],
    isLoading: false,
    error: null,
  },
  clients: {
    data: [],
    isLoading: false,
    error: null,
  },
  teamMembers: {
    data: [],
    isLoading: false,
    error: null,
  },
  filters: {},

  // Projects actions
  fetchProjects: async (params) => {
    try {
      set((state) => ({
        projects: {
          ...state.projects,
          isLoading: true,
          error: null,
        },
      }));

      const projects = await projectApi.getProjects({
        ...get().filters,
        ...params,
      });

      set((state) => ({
        projects: {
          ...state.projects,
          data: projects,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        projects: {
          ...state.projects,
          isLoading: false,
          error: error.message || 'Failed to fetch projects',
        },
      }));
    }
  },

  fetchProjectById: async (id) => {
    try {
      set((state) => ({
        currentProject: {
          ...state.currentProject,
          isLoading: true,
          error: null,
        },
      }));

      const project = await projectApi.getProject(id);

      set((state) => ({
        currentProject: {
          ...state.currentProject,
          data: project,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        currentProject: {
          ...state.currentProject,
          isLoading: false,
          error: error.message || 'Failed to fetch project',
        },
      }));
    }
  },

  createProject: async (data) => {
    try {
      const newProject = await projectApi.createProject(data);
      
      set((state) => ({
        projects: {
          ...state.projects,
          data: [newProject, ...state.projects.data],
        },
      }));
      
      return newProject;
    } catch (error: any) {
      throw error;
    }
  },

  updateProject: async (id, data) => {
    try {
      const updatedProject = await projectApi.updateProject(id, data);
      
      set((state) => ({
        projects: {
          ...state.projects,
          data: state.projects.data.map((project) => 
            project.id === updatedProject.id ? updatedProject : project
          ),
        },
        currentProject: {
          ...state.currentProject,
          data: state.currentProject.data?.id === updatedProject.id 
            ? updatedProject 
            : state.currentProject.data,
        },
      }));
      
      return updatedProject;
    } catch (error: any) {
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      await projectApi.deleteProject(id);
      
      set((state) => ({
        projects: {
          ...state.projects,
          data: state.projects.data.filter((project) => project.id !== id),
        },
      }));
    } catch (error: any) {
      throw error;
    }
  },

  // Tasks actions
  fetchTasks: async (projectId) => {
    try {
      set((state) => ({
        tasks: {
          ...state.tasks,
          isLoading: true,
          error: null,
        },
      }));

      const tasks = await projectApi.getTasks(projectId);

      set((state) => ({
        tasks: {
          ...state.tasks,
          data: tasks,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        tasks: {
          ...state.tasks,
          isLoading: false,
          error: error.message || 'Failed to fetch tasks',
        },
      }));
    }
  },

  createTask: async (projectId, data) => {
    try {
      const newTask = await projectApi.createTask(projectId, data);
      
      set((state) => ({
        tasks: {
          ...state.tasks,
          data: [...state.tasks.data, newTask],
        },
      }));
      
      return newTask;
    } catch (error: any) {
      throw error;
    }
  },

  updateTask: async (taskId, data) => {
    try {
      const updatedTask = await projectApi.updateTask(taskId, data);
      
      set((state) => ({
        tasks: {
          ...state.tasks,
          data: state.tasks.data.map((task) => 
            task.id === updatedTask.id ? updatedTask : task
          ),
        },
      }));
      
      return updatedTask;
    } catch (error: any) {
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      await projectApi.deleteTask(taskId);
      
      set((state) => ({
        tasks: {
          ...state.tasks,
          data: state.tasks.data.filter((task) => task.id !== taskId),
        },
      }));
    } catch (error: any) {
      throw error;
    }
  },

  // Clients actions
  fetchClients: async () => {
    try {
      set((state) => ({
        clients: {
          ...state.clients,
          isLoading: true,
          error: null,
        },
      }));

      const clients = await projectApi.getClients();

      set((state) => ({
        clients: {
          ...state.clients,
          data: clients,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        clients: {
          ...state.clients,
          isLoading: false,
          error: error.message || 'Failed to fetch clients',
        },
      }));
    }
  },

  createClient: async (data) => {
    try {
      const newClient = await projectApi.createClient(data);
      
      set((state) => ({
        clients: {
          ...state.clients,
          data: [...state.clients.data, newClient],
        },
      }));
      
      return newClient;
    } catch (error: any) {
      throw error;
    }
  },

  updateClient: async (id, data) => {
    try {
      const updatedClient = await projectApi.updateClient(id, data);
      
      set((state) => ({
        clients: {
          ...state.clients,
          data: state.clients.data.map((client) => 
            client.id === updatedClient.id ? updatedClient : client
          ),
        },
      }));
      
      return updatedClient;
    } catch (error: any) {
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      await projectApi.deleteClient(id);
      
      set((state) => ({
        clients: {
          ...state.clients,
          data: state.clients.data.filter((client) => client.id !== id),
        },
      }));
    } catch (error: any) {
      throw error;
    }
  },

  // Team members actions
  fetchTeamMembers: async () => {
    try {
      set((state) => ({
        teamMembers: {
          ...state.teamMembers,
          isLoading: true,
          error: null,
        },
      }));

      const teamMembers = await projectApi.getTeamMembers();

      set((state) => ({
        teamMembers: {
          ...state.teamMembers,
          data: teamMembers,
          isLoading: false,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        teamMembers: {
          ...state.teamMembers,
          isLoading: false,
          error: error.message || 'Failed to fetch team members',
        },
      }));
    }
  },

  // Filter actions
  setFilters: (filters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },

  clearFilters: () => {
    set({
      filters: {},
    });
  },

  // Reset actions
  resetCurrentProject: () => {
    set((state) => ({
      currentProject: {
        ...state.currentProject,
        data: null,
        error: null,
      },
    }));
  },

  clearErrors: () => {
    set((state) => ({
      projects: {
        ...state.projects,
        error: null,
      },
      currentProject: {
        ...state.currentProject,
        error: null,
      },
      tasks: {
        ...state.tasks,
        error: null,
      },
      clients: {
        ...state.clients,
        error: null,
      },
      teamMembers: {
        ...state.teamMembers,
        error: null,
      },
    }));
  },
}));
