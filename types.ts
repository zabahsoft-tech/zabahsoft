
export type Language = 'en' | 'fa' | 'ps';

export enum ServiceType {
  WEB = 'Web Development',
  DB = 'Database Solutions',
  SOFT = 'Custom Software',
  DOMAIN = 'Domain Registration'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export type Permission = 
  | 'MANAGE_USERS' 
  | 'VIEW_REPORTS' 
  | 'MANAGE_SERVICES' 
  | 'MANAGE_BILLING' 
  | 'SYSTEM_SETTINGS';

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
  userId: number;
  service_id: number;
  service_name: string;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: 'hessabpay' | 'stripe';
  amount_paid: string;
  date: string;
  license_key?: string;
  whatsapp_notified?: boolean;
  domain_name?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string; // WhatsApp integration
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  lastLogin?: string;
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
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured?: boolean;
}

export interface Branch {
  id: string;
  nameKey: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  mapQuery: string;
}

export type ContributionType = 'SUCCESS_STORY' | 'FEATURE_REQUEST' | 'FEEDBACK';

export interface Contribution {
  id: string;
  userId: number;
  userName: string;
  type: ContributionType;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'implemented' | 'archived';
  date: string;
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
  previewUrl: string;
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
