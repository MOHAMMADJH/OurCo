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
    projects_count: apiClient.projects_count || 0,
    total_value: apiClient.total_value || 0,
  };
};

const clientService = {
  // Get all clients
  async getClients(): Promise<Client[]> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/clients/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      return (data.results || []).map(mapApiClientToClient);
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get a single client by ID
  async getClient(id: string): Promise<Client> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/clients/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch client');
      }
      const data = await response.json();
      return mapApiClientToClient(data);
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create a new client
  async createClient(client: Omit<Client, 'id' | 'projects_count' | 'total_value'>): Promise<Client> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/clients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error('Failed to create client');
      }

      const data = await response.json();
      return mapApiClientToClient(data);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update an existing client
  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/clients/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      const data = await response.json();
      return mapApiClientToClient(data);
    } catch (error) {
      console.error('Error updating client:', error);
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

      const response = await fetch(`${API_BASE_URL}/api/clients/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Get client projects
  async getClientProjects(id: string): Promise<any[]> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/clients/${id}/projects/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch client projects');
      }
      const data = await response.json();
      // API returns the array directly, not wrapped in a 'results' property
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching client projects:', error);
      throw error;
    }
  }
};

export default clientService;
