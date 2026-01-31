
import { MOCK_SERVICES, MOCK_ORDERS, MOCK_POSTS } from '../constants';
import { User, Service, Order, BlogPost, UserRole, Permission, Branch, Contribution, Testimonial, Language, FAQ, ServiceType } from '../types';

const STORAGE_KEYS = {
  USERS: 'zabah_db_users',
  ORDERS: 'zabah_db_orders',
  SERVICES: 'zabah_db_services',
  POSTS: 'zabah_db_posts',
  REQUESTS: 'zabah_db_requests',
  BRANCHES: 'zabah_db_branches',
  CONTRIBUTIONS: 'zabah_db_contributions',
  SITE_CONFIG: 'zabah_db_site_config',
  TESTIMONIALS: 'zabah_db_testimonials',
  SYSTEM_SETTINGS: 'zabah_db_system_settings',
  LEGAL_PRIVACY: 'zabah_db_legal_privacy',
  LEGAL_TERMS: 'zabah_db_legal_terms',
  VOICE_MAILS: 'zabah_db_voice_mails',
  FAQS: 'zabah_db_faqs'
};

export interface VoiceMail {
  id: string;
  name: string;
  whatsapp: string;
  date: string;
  audio: string;
  status: 'new' | 'processed';
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'archived';
}

export interface SystemSettings {
  defaultLanguage: Language;
  defaultTheme: 'light' | 'dark';
  maintenanceMode: boolean;
  whatsapp: string;
  supportEmail: string;
  salesEmail: string;
  phone: string;
}

// Fixed: Changed to standard function declaration to avoid generic arrow function issues in some environments
function getStore<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

// Fixed: Changed to standard function declaration
function setStore(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

const seedDatabase = () => {
  // Users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStore(STORAGE_KEYS.USERS, [{ 
      id: 1, 
      name: 'Ahmad Fawad', 
      email: 'ahmad@zabahsoft.com', 
      phone: '+93799000000',
      whatsapp: '0799000000',
      role: UserRole.SUPER_ADMIN,
      permissions: ['MANAGE_USERS', 'VIEW_REPORTS', 'MANAGE_SERVICES', 'MANAGE_BILLING', 'SYSTEM_SETTINGS']
    }]);
  }
  // Services
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) setStore(STORAGE_KEYS.SERVICES, MOCK_SERVICES);
  // Blog
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) setStore(STORAGE_KEYS.POSTS, MOCK_POSTS);
  // Orders
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) setStore(STORAGE_KEYS.ORDERS, MOCK_ORDERS.map(o => ({ ...o, userId: 1 })));
  // System Settings
  if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS)) {
    setStore(STORAGE_KEYS.SYSTEM_SETTINGS, {
      defaultLanguage: 'fa',
      defaultTheme: 'dark',
      maintenanceMode: false,
      whatsapp: '93799000000',
      supportEmail: 'support@zabahsoft.com',
      salesEmail: 'sales@zabahsoft.com',
      phone: '+93 799 000 000'
    });
  }
  // Others
  if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) setStore(STORAGE_KEYS.BRANCHES, [{ id: '1', city: 'Kabul', address: 'Ansari Sq', phone: '0799000000', email: 'kabul@zabahsoft.com', mapQuery: 'Kabul' }]);
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) setStore(STORAGE_KEYS.TESTIMONIALS, [{ id: 1, name: 'Jamshid', role: 'CEO', company: 'Group', content: 'Great service', avatar: 'https://ui-avatars.com/api/?name=J', rating: 5 }]);
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) setStore(STORAGE_KEYS.REQUESTS, []);
  if (!localStorage.getItem(STORAGE_KEYS.VOICE_MAILS)) setStore(STORAGE_KEYS.VOICE_MAILS, []);
};

seedDatabase();

const delay = (ms = 100) => new Promise(res => setTimeout(res, ms));

export const api = {
  // Auth
  async login(email: string, pass: string) {
    await delay();
    // Fixed: relying on type inference from the fallback argument to resolve "Untyped function calls" error
    const users = getStore(STORAGE_KEYS.USERS, [] as User[]);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("Invalid credentials");
    const token = `zabah_token_${user.id}_${Date.now()}`;
    localStorage.setItem('zabah_token', token);
    localStorage.setItem('zabah_current_user_id', user.id.toString());
    return { user, token };
  },
  async register(data: any) {
    await delay();
    // Fixed: relying on type inference from the fallback argument
    const users = getStore(STORAGE_KEYS.USERS, [] as User[]);
    if (users.find(u => u.email === data.email)) throw new Error("User exists");
    const newUser: User = { id: Date.now(), role: UserRole.VIEWER, permissions: ['VIEW_REPORTS'], ...data };
    setStore(STORAGE_KEYS.USERS, [...users, newUser]);
    return this.login(data.email, '');
  },
  async getMe() {
    const id = localStorage.getItem('zabah_current_user_id');
    // Fixed: relying on type inference from the fallback argument
    const users = getStore(STORAGE_KEYS.USERS, [] as User[]);
    const user = users.find(u => u.id === parseInt(id || '0'));
    if (!user) throw new Error("User not found");
    return user;
  },

  // Generic CRUD Helpers
  // Fixed: removed explicit type parameter to getStore as it's correctly inferred
  async getAll<T>(key: string): Promise<T[]> { return getStore(key, [] as T[]); },
  async delete(key: string, id: any) { 
    const items = getStore(key, [] as any[]);
    setStore(key, items.filter(i => i.id !== id)); 
  },
  async save<T extends { id?: any }>(key: string, item: T) {
    const list = getStore(key, [] as any[]);
    if (item.id) setStore(key, list.map(i => i.id === item.id ? item : i));
    else setStore(key, [{ ...item, id: Date.now().toString() }, ...list]);
  },

  // Specialized
  // Fixed: using type assertion on 'this' to avoid generic call issues in object literal definition
  async getAllUsers() { return (this as any).getAll(STORAGE_KEYS.USERS) as Promise<User[]>; },
  async deleteUser(id: number) { return (this as any).delete(STORAGE_KEYS.USERS, id); },
  async getOrders() { return (this as any).getAll(STORAGE_KEYS.ORDERS) as Promise<Order[]>; },
  async deleteOrder(id: string) { return (this as any).delete(STORAGE_KEYS.ORDERS, id); },
  async updateOrder(o: Order) { return (this as any).save(STORAGE_KEYS.ORDERS, o); },
  async getServices() { return (this as any).getAll(STORAGE_KEYS.SERVICES) as Promise<Service[]>; },
  async updateService(s: Service) { return (this as any).save(STORAGE_KEYS.SERVICES, s); },
  async createService(s: Service) { return (this as any).save(STORAGE_KEYS.SERVICES, s); },
  async deleteService(id: number) { return (this as any).delete(STORAGE_KEYS.SERVICES, id); },
  async getPosts() { return (this as any).getAll(STORAGE_KEYS.POSTS) as Promise<BlogPost[]>; },
  async updatePost(p: BlogPost) { return (this as any).save(STORAGE_KEYS.POSTS, p); },
  async createPost(p: BlogPost) { return (this as any).save(STORAGE_KEYS.POSTS, p); },
  async deletePost(id: string) { return (this as any).delete(STORAGE_KEYS.POSTS, id); },
  async getBranches() { return (this as any).getAll(STORAGE_KEYS.BRANCHES) as Promise<Branch[]>; },
  async saveBranch(b: Branch) { return (this as any).save(STORAGE_KEYS.BRANCHES, b); },
  async deleteBranch(id: string) { return (this as any).delete(STORAGE_KEYS.BRANCHES, id); },
  async getTestimonials() { return (this as any).getAll(STORAGE_KEYS.TESTIMONIALS) as Promise<Testimonial[]>; },
  async saveTestimonial(t: Testimonial) { return (this as any).save(STORAGE_KEYS.TESTIMONIALS, t); },
  async deleteTestimonial(id: number) { return (this as any).delete(STORAGE_KEYS.TESTIMONIALS, id); },
  async getContactRequests() { return (this as any).getAll(STORAGE_KEYS.REQUESTS) as Promise<ContactRequest[]>; },
  async deleteContactRequest(id: string) { return (this as any).delete(STORAGE_KEYS.REQUESTS, id); },
  async updateContactStatus(id: string, status: any) { 
    const list = await this.getContactRequests();
    setStore(STORAGE_KEYS.REQUESTS, list.map(r => r.id === id ? { ...r, status } : r));
  },
  async submitContact(data: any) { 
    const list = await this.getContactRequests();
    setStore(STORAGE_KEYS.REQUESTS, [{ id: Date.now().toString(), ...data, date: new Date().toLocaleString(), status: 'new' }, ...list]);
  },
  async getVoiceMails() { return (this as any).getAll(STORAGE_KEYS.VOICE_MAILS) as Promise<VoiceMail[]>; },
  async deleteVoiceMail(id: string) { return (this as any).delete(STORAGE_KEYS.VOICE_MAILS, id); },
  async submitVoiceMail(audio: string, name: string, whatsapp: string) {
    const list = await this.getVoiceMails();
    setStore(STORAGE_KEYS.VOICE_MAILS, [{ id: Date.now().toString(), name, whatsapp, date: new Date().toLocaleString(), audio, status: 'new' }, ...list]);
  },
  async getContributions() { return (this as any).getAll(STORAGE_KEYS.CONTRIBUTIONS) as Promise<Contribution[]>; },
  async deleteContribution(id: string) { return (this as any).delete(STORAGE_KEYS.CONTRIBUTIONS, id); },
  async updateContributionStatus(id: string, status: any) {
    const list = await this.getContributions();
    setStore(STORAGE_KEYS.CONTRIBUTIONS, list.map(c => c.id === id ? { ...c, status } : c));
  },
  async getLegalContent(type: 'privacy' | 'terms') {
    const key = type === 'privacy' ? STORAGE_KEYS.LEGAL_PRIVACY : STORAGE_KEYS.LEGAL_TERMS;
    return getStore(key, { en: '<h1>Legal</h1>', fa: '<h1>حقوقی</h1>', ps: '<h1>حقوقی</h1>' });
  },
  async updateLegalContent(type: 'privacy' | 'terms', content: any) {
    const key = type === 'privacy' ? STORAGE_KEYS.LEGAL_PRIVACY : STORAGE_KEYS.LEGAL_TERMS;
    setStore(key, content);
  },
  async getSystemSettings() { return getStore(STORAGE_KEYS.SYSTEM_SETTINGS, {} as SystemSettings); },
  async updateSystemSettings(s: SystemSettings) { setStore(STORAGE_KEYS.SYSTEM_SETTINGS, s); },
  async getSiteConfig() { return getStore(STORAGE_KEYS.SITE_CONFIG, {}); },
  async updateSiteConfig(c: any) { setStore(STORAGE_KEYS.SITE_CONFIG, c); },
  async getFAQs() { return getStore(STORAGE_KEYS.FAQS, [] as FAQ[]); },
  async createOrder(sid: number, method: string, details: any) {
    const user = await this.getMe();
    const service = (await this.getServices()).find(s => s.id === sid);
    const order: Order = { id: `ORD-${Date.now().toString().slice(-6)}`, userId: user.id, service_id: sid, service_name: service?.name || '?', status: 'pending', payment_method: method as any, amount_paid: `$${service?.price_usd}`, date: new Date().toISOString().split('T')[0], license_key: 'PENDING' };
    setStore(STORAGE_KEYS.ORDERS, [order, ...getStore(STORAGE_KEYS.ORDERS, [] as Order[])]);
    return order;
  }
};
