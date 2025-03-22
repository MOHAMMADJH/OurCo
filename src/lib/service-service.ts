import axios from 'axios';
import { getApiBaseUrl } from '@/utils/apiUtils';

const API_URL = `${getApiBaseUrl()}/api/services`;

export interface Service {
  id: string;
  name: string;
  description: string;
  // Add other properties as needed
}

const ServiceService = {
  getAllServices: async (): Promise<Service[]> => {
    const response = await axios.get<Service[]>(`${API_URL}/`);
    return response.data;
  },

  getServiceById: async (id: string): Promise<Service> => {
    const response = await axios.get<Service>(`${API_URL}/${id}/`);
    return response.data;
  },

  createService: async (service: Omit<Service, 'id'>): Promise<Service> => {
    const response = await axios.post<Service>(`${API_URL}/`, service);
    return response.data;
  },

  updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
    const response = await axios.put<Service>(`${API_URL}/${id}/`, service);
    return response.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}/`);
  }
};

export default ServiceService;
