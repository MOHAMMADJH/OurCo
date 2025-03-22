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
  progress?: number; // Make progress optional
  client?: { id: string; name: string; } | string; // Remove number type
}