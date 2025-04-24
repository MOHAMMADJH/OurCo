/**
 * Project status enum
 */
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Project priority enum
 */
export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Client interface
 */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  logo?: string;
  address?: string;
  website?: string;
  industry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Team member interface
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  skills?: string[];
}

/**
 * Task interface
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee?: TeamMember;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  attachments?: Attachment[];
  comments?: Comment[];
}

/**
 * Attachment interface
 */
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

/**
 * Comment interface
 */
export interface Comment {
  id: string;
  content: string;
  author: TeamMember;
  createdAt: string;
  updatedAt?: string;
  attachments?: Attachment[];
}

/**
 * Project interface
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  client: Client;
  team?: TeamMember[];
  tasks?: Task[];
  attachments?: Attachment[];
  tags?: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create project data interface
 */
export interface CreateProjectData {
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId: string;
  teamIds?: string[];
  tags?: string[];
  image?: string;
}

/**
 * Update project data interface
 */
export interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  progress?: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId?: string;
  teamIds?: string[];
  tags?: string[];
  image?: string;
}

/**
 * Project filter params interface
 */
export interface ProjectFilterParams {
  search?: string;
  status?: ProjectStatus | ProjectStatus[];
  priority?: ProjectPriority | ProjectPriority[];
  clientId?: string;
  teamMemberId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  tags?: string[];
  sortBy?: 'title' | 'status' | 'priority' | 'startDate' | 'endDate' | 'progress' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
