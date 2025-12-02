
export type Language = 'en' | 'fa' | 'ps';

export enum ServiceType {
  WEB = 'Web Development',
  DB = 'Database Solutions',
  SOFT = 'Custom Software'
}

export interface Service {
  id: number;
  name: string;
  description: string;
  type: ServiceType;
  price_afn: number;
  price_usd: number;
  features: string[];
  icon: string;
  specs: { label: string; value: string }[];
  badge?: string;
}

export interface Order {
  id: string;
  service_id: number;
  service_name: string;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: 'hessabpay' | 'stripe';
  amount_paid: string;
  date: string;
  license_key?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  feedback?: 'up' | 'down';
}

export type BlogCategory = 'Tech' | 'Business' | 'Tutorial' | 'News';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string for rich text
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  readTime: string; // e.g. "5 min read"
  featured?: boolean;
}

export interface Branch {
  id: string;
  nameKey: string; // used for title translation lookup
  city: string;
  address: string;
  phone: string;
  email: string;
  mapQuery: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface WebDemo {
  id: number;
  title: string;
  category: string;
  image: string;
  previewUrl: string; // New field for iframe
  tags: string[];
  description: string;
  client?: string;
  year?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}
