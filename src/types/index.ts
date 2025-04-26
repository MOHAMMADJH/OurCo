/**
 * Shared type definitions for the application
 * This file contains interfaces that are used across multiple components
 * to ensure type consistency and prevent type mismatches.
 */

// User types
export interface User {
  id: string; // Changed from number to string for consistency
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  role: string; // Added to match useAuth.ts requirements
  name?: string; // Added for compatibility with debug.tsx
}

// Blog types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string; // Not optional to match ICategory
  updated_at: string; // Not optional to match ICategory
  posts_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string; // Not optional to match ITag
  updated_at: string; // Not optional to match ITag
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  post: {
    id: string;
    title: string;
  };
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected';
  parent_id: string | null;
  replies?: Comment[];
  name?: string; // Added for compatibility with existing Comment type
  email?: string; // Added for compatibility with existing Comment type
  is_approved?: boolean; // Added for compatibility with existing Comment type
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  categories: Category[];
  tags: Tag[];
  comments_count: number;
  views_count: number;
  reading_time: number;
}

// Project types
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
  progress?: number; // Make progress optional
  client?: { id: string; name: string; } | string; // Remove number type
}

import { 
  Project as EntityProject, 
  Client as EntityClient, 
  Task as EntityTask, 
  TeamMember as EntityTeamMember, 
  ProjectStatus, 
  ProjectPriority 
} from '@/entities/project/model/types';

// UI extension for Project with additional UI-specific properties
export interface UIProject extends EntityProject {
  image_url?: string;
  live_url?: string;
  github_url?: string;
  technologies?: string[];
  start_date?: string; // For legacy compatibility
  end_date?: string;   // For legacy compatibility
  created_at?: string; // For legacy compatibility
  updated_at?: string; // For legacy compatibility
  deadline?: string;   // For legacy compatibility
  images?: Array<{
    id: string;
    image: string;
    caption?: string;
    is_primary: boolean;
    uploaded_at: string;
  }>;
}

// Helper functions to convert between API format and Entity format
export function apiProjectToEntity(apiProject: any): EntityProject {
  // Ensure client is handled safely
  const apiClient = apiProject.client || {};
  const clientImages = apiProject.images || [];

  return {
    id: apiProject.id?.toString() || '', // Ensure ID is a string
    title: apiProject.title || '',
    description: apiProject.description || '',
    status: convertStatus(apiProject.status), // Use existing helper
    priority: apiProject.priority || ProjectPriority.MEDIUM, // Use default
    progress: apiProject.progress || 0,
    startDate: apiProject.start_date || apiProject.created_at, // Allow start_date or created_at
    endDate: apiProject.end_date || apiProject.deadline, // Allow end_date or deadline
    budget: apiProject.budget || 0,
    client: {
      id: apiClient.id?.toString() || '', // Ensure ID is string
      name: apiClient.name || 'Unknown Client',
      email: apiClient.email || '', // Default empty string if missing
      company: apiClient.company || '', // Default empty string if missing
      createdAt: apiClient.created_at || '',
      updatedAt: apiClient.updated_at || '',
    },
    image: clientImages[0]?.image || '', // Use first image if available
    createdAt: apiProject.created_at || '',
    updatedAt: apiProject.updated_at || '',
  };
}

export function apiTaskToEntity(apiTask: any): EntityTask {
  // Ensure assignee is handled safely
  const apiAssignee = apiTask.assignee || {};
  
  return {
    id: apiTask.id?.toString() || '',
    title: apiTask.title || 'Untitled Task',
    description: apiTask.description || '',
    // Basic status/priority mapping (adjust if API uses different strings)
    status: apiTask.status?.toUpperCase() || 'TODO',
    priority: apiTask.priority?.toUpperCase() || 'MEDIUM',
    assignee: {
      id: apiAssignee.id?.toString() || '',
      name: apiAssignee.name || 'Unassigned',
      email: apiAssignee.email || '',
      role: apiAssignee.role || '',
    },
    dueDate: apiTask.due_date || apiTask.dueDate, // Allow due_date or dueDate
    createdAt: apiTask.created_at || '',
    updatedAt: apiTask.updated_at || '',
    // Add defaults for other fields if needed
  };
}

export function apiClientToEntity(apiClient: any): EntityClient {
  return {
    id: apiClient.id?.toString() || '',
    name: apiClient.name || 'Unknown Client',
    email: apiClient.email || '',
    phone: apiClient.phone || '',
    company: apiClient.company || '',
    logo: apiClient.logo || '',
    address: apiClient.address || '',
    website: apiClient.website || '',
    industry: apiClient.industry || '',
    notes: apiClient.notes || '',
    createdAt: apiClient.created_at || '',
    updatedAt: apiClient.updated_at || '',
  };
}

export function apiTeamMemberToEntity(apiMember: any): EntityTeamMember {
  // Combine first/last name if provided, otherwise use name
  const name = apiMember.name || `${apiMember.first_name || ''} ${apiMember.last_name || ''}`.trim() || 'Unknown Member';
  
  return {
    id: apiMember.id?.toString() || '',
    name: name,
    email: apiMember.email || '',
    role: apiMember.role || 'Member',
    avatar: apiMember.avatar || apiMember.avatar_url || '', // Allow avatar or avatar_url
    department: apiMember.department || '',
    skills: apiMember.skills || [],
  };
}

// Convert legacy status to enum status
export function convertStatus(status: string): ProjectStatus {
  switch (status) {
    case 'active':
      return ProjectStatus.IN_PROGRESS;
    case 'completed':
      return ProjectStatus.COMPLETED;
    case 'pending':
    default:
      return ProjectStatus.PLANNING;
  }
}