import axios from "axios";
import { API_BASE_URL } from './constants';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  type: "company" | "individual";
  status: "active" | "inactive";
  image?: string;
  imageUrl?: string; // Added for compatibility with ClientFormData
  projects_count: number;
  total_value: number;
}

// Convert API client format to frontend client format if needed
const mapApiClientToClient = (apiClient: any): Client => {
  return {
    id: apiClient.id.toString(),
    name: apiClient.name,
    company: apiClient.company || '',
    email: apiClient.email,
    phone: apiClient.phone,
    location: apiClient.location,
    type: apiClient.type as "company" | "individual",
    status: apiClient.status as "active" | "inactive",
    image: apiClient.image || '',
    projects_count: apiClient.projects_count || 0,
    total_value: apiClient.total_value || 0,
  };
};

const clientService = {
  // Get all clients
  async getClients(): Promise<Client[]> {
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

      // Try using fetch instead of axios to match the project service approach
      const response = await fetch(`${API_BASE_URL}/api/clients/`, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        // Check if the error is due to authentication
        if (response.status === 401) {
          // Return empty array for public access instead of throwing error
          console.warn('Unauthenticated access to clients, showing public data only');
          return [];
        }
        console.error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      return (data.results || []).map(mapApiClientToClient);
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Return empty array instead of throwing error for public access
      return [];
    }
  },

  // Get a single client by ID
  async getClient(id: string): Promise<Client> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await axios.get(`${API_BASE_URL}/api/clients/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return mapApiClientToClient(response.data);
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create a new client
  async createClient(clientData: Omit<Client, "id" | "projects_count" | "total_value"> & { image?: File | null }): Promise<Client> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Check if we have a file using simple property check
      const hasFile = clientData.image ? true : false;
      
      if (hasFile && clientData.image) {
        const formData = new FormData();
        
        // Add all client data to FormData
        Object.entries(clientData).forEach(([key, value]) => {
          if (key === 'image' && value) {
            formData.append('image', value as File);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        
        const response = await axios.post(`${API_BASE_URL}/api/clients/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
        
        return mapApiClientToClient(response.data);
      } else {
        // Regular JSON request if no file
        // Remove image from JSON payload if it's null
        const { image, ...clientDataWithoutImage } = clientData;
        const response = await axios.post(`${API_BASE_URL}/api/clients/`, clientDataWithoutImage, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        return mapApiClientToClient(response.data);
      }
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  },

  // Update an existing client
  async updateClient(id: string, clientData: Partial<Client> & { image?: File | null }): Promise<Client> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Check if we have a file using simple property check
      const hasFile = clientData.image ? true : false;
      
      if (hasFile && clientData.image) {
        const formData = new FormData();
        
        // Add all client data to FormData
        Object.entries(clientData).forEach(([key, value]) => {
          if (key === 'image' && value) {
            formData.append('image', value as File);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        
        const response = await axios.patch(`${API_BASE_URL}/api/clients/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
        
        return mapApiClientToClient(response.data);
      } else {
        // Regular JSON request if no file
        // Remove image from JSON payload if it's null
        const { image, ...clientDataWithoutImage } = clientData;
        const response = await axios.patch(`${API_BASE_URL}/api/clients/${id}/`, clientDataWithoutImage, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        return mapApiClientToClient(response.data);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  },

  // Delete a client
  async deleteClient(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      await axios.delete(`${API_BASE_URL}/api/clients/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Delete operation successful if no error was thrown
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Get projects for a client
  async getClientProjects(id: string): Promise<any[]> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await axios.get(`${API_BASE_URL}/api/clients/${id}/projects/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // API returns the array directly, not wrapped in a 'results' property
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching client projects:', error);
      throw error;
    }
  }
};

export default clientService;
