import axios from 'axios';
import { getApiBaseUrl } from '@/utils/apiUtils';

export interface IPost {
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
  categories: ICategory[];
  tags: ITag[];
  comments_count: number;
  views_count: number;
  reading_time: number;
  comments?: IComment[];
}

export interface IPostCreate {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: File | null;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string | null;
  category_ids?: string[];
  tag_ids?: string[];
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string; // Changed from optional to required for compatibility with CategoryType
  created_at: string;
  updated_at: string;
  posts_count?: number;
}

export interface ITag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface IComment {
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
  replies?: IComment[];
}

class BlogService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${getApiBaseUrl()}/api/blog`;
  }

  // Posts
  async getPosts(token: string, params: Record<string, any> = {}): Promise<IPost[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await axios.get(`${this.baseUrl}/posts${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async getPost(token: string, id: string): Promise<IPost> {
    const response = await axios.get(`${this.baseUrl}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async getPostById(id: string | undefined, token: string): Promise<IPost> {
    if (!id) throw new Error('Post ID is required');
    const response = await axios.get(`${this.baseUrl}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async getPostBySlug(slug: string): Promise<IPost> {
    const response = await axios.get(`${this.baseUrl}/posts/slug/${slug}`);
    return response.data;
  }

  async createPost(token: string, postData: IPostCreate): Promise<IPost> {
    const formData = new FormData();
    
    Object.entries(postData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'category_ids' || key === 'tag_ids') {
          if (Array.isArray(value)) {
            value.forEach(id => formData.append(key, id));
          }
        } else if (key === 'featured_image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    const response = await axios.post(`${this.baseUrl}/posts`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }

  async updatePost(token: string, id: string, postData: Partial<IPostCreate>): Promise<IPost> {
    const formData = new FormData();
    
    Object.entries(postData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'category_ids' || key === 'tag_ids') {
          if (Array.isArray(value)) {
            // Clear existing values first
            formData.append(`${key}_clear`, 'true');
            value.forEach(id => formData.append(key, id));
          }
        } else if (key === 'featured_image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    const response = await axios.patch(`${this.baseUrl}/posts/${id}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }

  async updatePostSlug(token: string, id: string, slug: string): Promise<IPost> {
    const response = await axios.patch(
      `${this.baseUrl}/posts/${id}/slug`,
      { slug },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async deletePost(token: string, id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Categories
  async getCategories(token: string): Promise<ICategory[]> {
    const response = await axios.get(`${this.baseUrl}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async getCategory(token: string, id: string): Promise<ICategory> {
    const response = await axios.get(`${this.baseUrl}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async createCategory(
    token: string, 
    name: string, 
    slug: string = '', 
    description: string = ''
  ): Promise<ICategory> {
    const response = await axios.post(
      `${this.baseUrl}/categories`,
      { name, slug, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async updateCategory(
    token: string,
    id: string,
    data: { name?: string; slug?: string; description?: string }
  ): Promise<ICategory> {
    const response = await axios.patch(
      `${this.baseUrl}/categories/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async updateCategorySlug(token: string, id: string, slug: string): Promise<ICategory> {
    const response = await axios.patch(
      `${this.baseUrl}/categories/${id}/slug`,
      { slug },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async deleteCategory(token: string, id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Tags
  async getTags(token: string): Promise<ITag[]> {
    const response = await axios.get(`${this.baseUrl}/tags`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async getTag(token: string, id: string): Promise<ITag> {
    const response = await axios.get(`${this.baseUrl}/tags/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async createTag(token: string, name: string, slug: string = ''): Promise<ITag> {
    const response = await axios.post(
      `${this.baseUrl}/tags`,
      { name, slug },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async updateTag(
    token: string,
    id: string,
    data: { name?: string; slug?: string }
  ): Promise<ITag> {
    const response = await axios.patch(
      `${this.baseUrl}/tags/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async updateTagSlug(token: string, id: string, slug: string): Promise<ITag> {
    const response = await axios.patch(
      `${this.baseUrl}/tags/${id}/slug`,
      { slug },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async deleteTag(token: string, id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/tags/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Comments
  async getComments(token: string, postId?: string): Promise<IComment[]> {
    const url = postId 
      ? `${this.baseUrl}/posts/${postId}/comments` 
      : `${this.baseUrl}/comments`;
    
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  }

  async createComment(token: string, postId: string, content: string, parentId?: string): Promise<IComment> {
    const data: any = { content };
    if (parentId) data.parent_id = parentId;
    
    const response = await axios.post(
      `${this.baseUrl}/posts/${postId}/comments`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async addComment(postId: string, commentData: { content: string }, token: string): Promise<IComment> {
    const response = await axios.post(
      `${this.baseUrl}/posts/${postId}/comments`,
      commentData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async updateCommentStatus(token: string, commentId: string, status: 'approved' | 'rejected'): Promise<IComment> {
    const response = await axios.patch(
      `${this.baseUrl}/comments/${commentId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  }

  async deleteComment(token: string, commentId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}

export default new BlogService();
