// Minimal API base for shared/api/project.ts
// Replace with axios or your real API implementation as needed
import { APIProject, ProjectFormData } from '@/types';
import { Project, Task, Client, TeamMember, ProjectStatus, ProjectPriority } from '@/entities/project/model/types';

// Mock data for development
const mockProject: Project = {
  id: '1',
  title: 'Sample Project',
  description: 'This is a sample project',
  status: ProjectStatus.PLANNING,
  priority: ProjectPriority.MEDIUM,
  progress: 25,
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  budget: 10000,
  client: {
    id: '1',
    name: 'Sample Client',
    email: 'client@example.com',
    company: 'Sample Company',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  image: 'https://example.com/image.jpg',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01'
};

const mockTask: Task = {
  id: '1',
  title: 'Sample Task',
  description: 'This is a sample task',
  status: 'TODO',
  priority: 'LOW',
  dueDate: '2025-12-31',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01'
};

const mockClient: Client = {
  id: '1',
  name: 'Sample Client',
  email: 'client@example.com',
  company: 'Sample Company',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01'
};

const mockTeamMember: TeamMember = {
  id: '1',
  name: 'Sample Member',
  email: 'member@example.com',
  role: 'Developer'
};

export const api = {
  get: async (url: string, config?: any) => {
    // Return different mock data based on the URL
    if (url.includes('/projects/') && !url.includes('/tasks')) {
      return { data: mockProject };
    } else if (url.includes('/projects')) {
      return { data: [mockProject, {...mockProject, id: '2', title: 'Another Project', status: ProjectStatus.PLANNING, priority: ProjectPriority.MEDIUM}] };
    } else if (url.includes('/tasks')) {
      return { data: [mockTask, {...mockTask, id: '2', title: 'Another Task'}] };
    } else if (url.includes('/clients')) {
      return { data: [mockClient, {...mockClient, id: '2', name: 'Another Client'}] };
    } else if (url.includes('/team-members')) {
      return { data: [mockTeamMember, {...mockTeamMember, id: '2', name: 'Another Member'}] };
    }
    
    return { data: {} };
  },
  post: async (url: string, data?: any, config?: any) => {
    if (url.includes('/projects')) {
      return { data: { ...mockProject, ...data } };
    } else if (url.includes('/tasks')) {
      return { data: { ...mockTask, ...data } };
    } else if (url.includes('/clients')) {
      return { data: { ...mockClient, ...data } };
    }
    
    return { data: {} };
  },
  patch: async (url: string, data?: any, config?: any) => {
    if (url.includes('/projects/')) {
      return { data: { ...mockProject, ...data } };
    } else if (url.includes('/tasks/')) {
      return { data: { ...mockTask, ...data } };
    } else if (url.includes('/clients/')) {
      return { data: { ...mockClient, ...data } };
    }
    
    return { data: {} };
  },
  delete: async (url: string, config?: any) => {
    return { data: {} };
  },
};
