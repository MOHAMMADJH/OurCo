import axios from 'axios';
import { getApiBaseUrl } from '@/utils/apiUtils';

const API_URL = `${getApiBaseUrl()}/api/services`;

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: number;
  duration?: string;
  features?: string[];
  // Add other properties as needed
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_title?: string;
  content: string;
  rating: number;
  service: number;
  created_at: string;
}

export interface TestimonialCreate {
  client_name: string;
  client_title?: string;
  content: string;
  rating: number;
  service: number;
}

const ServiceService = {
  getAllServices: async (): Promise<Service[]> => {
    const response = await axios.get<Service[]>(`${API_URL}/`);
    return response.data;
  },

  getServiceById: async (id: string): Promise<Service> => {
    if (!id) throw new Error('Service ID is required');
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
  },
  
  // Testimonial related methods
  getTestimonialsByServiceId: async (id: string): Promise<Testimonial[]> => {
    if (!id) return [];
    const response = await axios.get<Testimonial[]>(`${API_URL}/${id}/testimonials/`);
    return response.data;
  },
  
  createTestimonial: async (testimonial: TestimonialCreate): Promise<Testimonial> => {
    const response = await axios.post<Testimonial>(`${API_URL}/testimonials/`, testimonial);
    return response.data;
  }
};

export default ServiceService;
