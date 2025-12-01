import { MOCK_SERVICES, MOCK_ORDERS, MOCK_POSTS } from '../constants';
import { User, Service, Order, BlogPost } from '../types';

/**
 * ZabahSoft API Service
 * ---------------------
 * This file handles all communication with the Laravel Backend.
 * 
 * DEVELOPER NOTE:
 * The `API_URL` defaults to localhost. You can override this by setting
 * `REACT_APP_API_URL` in your .env file.
 * 
 * FALLBACK MODE:
 * If the API is unreachable (e.g. backend not running), this service
 * gracefully falls back to the MOCK data defined in `constants.ts`.
 * This allows frontend developers to work without a running backend.
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper to get headers with Auth Token
const getHeaders = (isMultipart = false) => {
  const headers: HeadersInit = {};
  const token = localStorage.getItem('zabah_token');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  
  return headers;
};

// Generic fetch wrapper with error handling and fallback support
async function request<T>(endpoint: string, options: RequestInit = {}, fallback: T | null = null): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API] Request to ${endpoint} failed. Using fallback data if available.`, error);
    if (fallback !== null) {
      // Simulate network delay for realistic fallback experience
      await new Promise(resolve => setTimeout(resolve, 800));
      return fallback;
    }
    throw error;
  }
}

export const api = {
  // --- Authentication ---

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Fallback user for dev
    const mockResponse = {
      user: { id: 1, name: 'Demo User', email: email, phone: '+93799000000' },
      token: 'mock-jwt-token-12345'
    };
    
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, mockResponse);
  },

  async register(data: { name: string; email: string; password: string; phone?: string }): Promise<{ user: User; token: string }> {
    const mockResponse = {
      user: { id: 2, name: data.name, email: data.email, phone: data.phone || '' },
      token: 'mock-jwt-token-67890'
    };

    return request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, mockResponse);
  },

  async getMe(): Promise<User> {
    // Check if we even have a token stored
    const token = localStorage.getItem('zabah_token');
    if(!token) throw new Error("No token found");

    const mockUser: User = { id: 1, name: 'Demo User', email: 'demo@zabahsoft.com', phone: '+93799000000' };
    
    return request('/user', {
      method: 'GET'
    }, mockUser);
  },

  async logout(): Promise<void> {
    // Fix: Use await instead of return to match Promise<void> return type
    await request('/logout', { method: 'POST' }, {});
  },

  // --- Services ---

  async getServices(): Promise<Service[]> {
    return request('/services', { method: 'GET' }, MOCK_SERVICES);
  },

  // --- Orders ---

  async getOrders(): Promise<Order[]> {
    return request('/user/orders', { method: 'GET' }, MOCK_ORDERS as unknown as Order[]);
  },

  async createOrder(serviceId: number, paymentMethod: string, details: any): Promise<Order> {
    const mockOrder: Order = {
      id: `ORD-${Date.now()}`,
      service_id: serviceId,
      service_name: 'New Service Order',
      status: 'pending',
      payment_method: paymentMethod as any,
      amount_paid: '---',
      date: new Date().toISOString().split('T')[0]
    };

    return request('/orders', {
      method: 'POST',
      body: JSON.stringify({ service_id: serviceId, payment_method: paymentMethod, ...details })
    }, mockOrder);
  },

  // --- Blog ---

  async getPosts(): Promise<BlogPost[]> {
    return request('/posts', { method: 'GET' }, MOCK_POSTS);
  },

  async getPost(slug: string): Promise<BlogPost | undefined> {
    // For mock, we filter the array. For API, we'd hit /posts/{slug}
    const mockPost = MOCK_POSTS.find(p => p.id === slug || p.slug === slug);
    return request(`/posts/${slug}`, { method: 'GET' }, mockPost);
  },

  // --- Contact ---

  async submitContact(data: any): Promise<void> {
    // Fix: Use await instead of return to match Promise<void> return type
    await request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }, {});
  }
};