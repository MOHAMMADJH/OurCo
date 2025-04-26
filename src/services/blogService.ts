import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mihwaralarab-1072625241731.me-central1.run.app/api';

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  posts_count?: number;
}

export interface ITag {
  id: string;
  name: string;
  slug: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IComment {
  id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

export interface IPost {
  id: string;
  title: string;
  slug: string;
  author: IUser;
  content?: string;
  featured_image?: string;
  excerpt?: string;
  category?: ICategory;
  tags?: ITag[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at?: string;
  published_at?: string;
  comments?: IComment[];
  views?: number;
}

export interface IPostCreate {
  title: string;
  content: string;
  featured_image?: File | null;
  excerpt?: string;
  category_id?: string | null;
  tag_ids?: string[];
  status: 'draft' | 'published';
  slug?: string | null;
}

export interface ICommentCreate {
  name: string;
  email: string;
  content: string;
}

const BlogService = {
  // Posts
  getAllPosts: async (params?: {
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
  }) => {
    const response = await axios.get(`${API_URL}/blog/posts/`, { params });
    return response.data;
  },

  getPostBySlug: async (slug: string) => {
    const response = await axios.get(`${API_URL}/blog/posts/${slug}/`);
    return response.data;
  },

  getPostById: async (id: string) => {
    const response = await axios.get(`${API_URL}/blog/posts/id/${id}/`);
    return response.data;
  },

  createPost: async (postData: IPostCreate, token: string) => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('status', postData.status);
    
    if (postData.excerpt) formData.append('excerpt', postData.excerpt);
    if (postData.category_id) formData.append('category_id', postData.category_id);
    if (postData.tag_ids && postData.tag_ids.length > 0) {
      postData.tag_ids.forEach(tagId => {
        formData.append('tag_ids', tagId);
      });
    }
    
    // Add featured image if present
    if (postData.featured_image) {
      formData.append('featured_image', postData.featured_image);
    }
    
    if (postData.slug) {
      formData.append('slug', postData.slug);
    }
    
    const response = await axios.post(`${API_URL}/blog/posts/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  },

  updatePost: async (id: string, postData: Partial<IPostCreate>, token: string) => {
    const formData = new FormData();
    
    // Add fields that are present
    if (postData.title) formData.append('title', postData.title);
    if (postData.content) formData.append('content', postData.content);
    if (postData.status) formData.append('status', postData.status);
    if (postData.excerpt) formData.append('excerpt', postData.excerpt);
    
    if (postData.category_id !== undefined) {
      formData.append('category_id', postData.category_id || '');
    }
    
    if (postData.tag_ids) {
      postData.tag_ids.forEach(tagId => {
        formData.append('tag_ids', tagId);
      });
    }
    
    // Add featured image if present
    if (postData.featured_image) {
      formData.append('featured_image', postData.featured_image);
    }
    
    if (postData.slug) {
      formData.append('slug', postData.slug);
    }
    
    const response = await axios.patch(`${API_URL}/blog/posts/id/${id}/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  },

  deletePost: async (slug: string, token: string) => {
    await axios.delete(`${API_URL}/blog/posts/${slug}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  },

  // Categories
  getAllCategories: async () => {
    const response = await axios.get(`${API_URL}/blog/categories/`);
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string; slug?: string | null }, token: string) => {
    const response = await axios.post(`${API_URL}/blog/categories/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  updateCategory: async (slug: string, data: { name?: string; description?: string }, token: string) => {
    const response = await axios.patch(`${API_URL}/blog/categories/${slug}/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  deleteCategory: async (slug: string, token: string) => {
    await axios.delete(`${API_URL}/blog/categories/${slug}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  },

  // Tags
  getAllTags: async () => {
    const response = await axios.get(`${API_URL}/blog/tags/`);
    return response.data;
  },

  createTag: async (data: { name: string; slug?: string | null }, token: string) => {
    const response = await axios.post(`${API_URL}/blog/tags/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  deleteTag: async (slug: string, token: string) => {
    await axios.delete(`${API_URL}/blog/tags/${slug}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  },

  // Comments
  addComment: async (postSlug: string, commentData: ICommentCreate) => {
    const response = await axios.post(`${API_URL}/blog/posts/${postSlug}/add_comment/`, commentData);
    return response.data;
  },

  getAllComments: async (token: string) => {
    const response = await axios.get(`${API_URL}/blog/comments/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  approveComment: async (commentId: string, token: string) => {
    const response = await axios.post(`${API_URL}/blog/comments/${commentId}/approve/`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  rejectComment: async (commentId: string, token: string) => {
    const response = await axios.post(`${API_URL}/blog/comments/${commentId}/reject/`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  deleteComment: async (commentId: string, token: string) => {
    const response = await axios.delete(`${API_URL}/blog/comments/${commentId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  // Slug operations
  updatePostSlug: async (id: string, newSlug: string | null, token: string) => {
    const response = await axios.post(`${API_URL}/blog/posts/id/${id}/update_slug/`, 
      { slug: newSlug }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    return response.data;
  },

  updateCategorySlug: async (categorySlug: string, newSlug: string | undefined, token: string) => {
    const response = await axios.post(
      `${API_URL}/blog/categories/${categorySlug}/update_slug/`,
      newSlug ? { slug: newSlug } : {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  updateTagSlug: async (slug: string, newSlug: string | null, token: string) => {
    const response = await axios.post(`${API_URL}/blog/tags/${slug}/update_slug/`, 
      { slug: newSlug }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    return response.data;
  },
};

export default BlogService;
