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
  // New fields for detailed view
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
}