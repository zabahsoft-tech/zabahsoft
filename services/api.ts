
import { MOCK_SERVICES, MOCK_ORDERS, MOCK_POSTS } from '../constants';
import { User, Service, Order, BlogPost, UserRole, Permission, Branch, Contribution, Testimonial, Language } from '../types';

/**
 * ZabahSoft Relational Storage Engine (LocalStorage-backed)
 */

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
  SYSTEM_SETTINGS: 'zabah_db_system_settings'
};

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
}

const seedDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      { 
        id: 1, 
        name: 'Ahmad Fawad', 
        email: 'ahmad@zabahsoft.com', 
        phone: '+93799000000',
        whatsapp: '0799000000',
        role: UserRole.SUPER_ADMIN,
        permissions: ['MANAGE_USERS', 'VIEW_REPORTS', 'MANAGE_SERVICES', 'MANAGE_BILLING', 'SYSTEM_SETTINGS']
      },
      { 
        id: 2, 
        name: 'Zabah Admin', 
        email: 'info@zabahsoft.com', 
        phone: '+93700000000',
        whatsapp: '0700000000',
        role: UserRole.SUPER_ADMIN,
        permissions: ['MANAGE_USERS', 'VIEW_REPORTS', 'MANAGE_SERVICES', 'MANAGE_BILLING', 'SYSTEM_SETTINGS']
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const seedOrders = MOCK_ORDERS.map(o => ({ ...o, userId: 1 }));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(seedOrders));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(MOCK_SERVICES));
  }

  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(MOCK_POSTS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) {
    const defaultBranches: Branch[] = [
      { id: 'kabul', nameKey: 'hq', city: 'Kabul, Afghanistan', address: 'Shahr-e-Naw, Ansari Square, Business Tower, 4th Floor', phone: '+93 799 000 000', email: 'kabul@zabahsoft.com', mapQuery: 'Shahr-e-Naw,Kabul,Afghanistan' },
      { id: 'herat', nameKey: 'regionalHub', city: 'Herat, Afghanistan', address: 'Jada-e-Bank Khoon, IT Center, Office #202', phone: '+93 700 111 222', email: 'herat@zabahsoft.com', mapQuery: 'Herat,Afghanistan' }
    ];
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(defaultBranches));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    const defaultTestimonials: Testimonial[] = [
      { id: 1, name: "Jamshid Alokozay", role: "CEO", company: "Alokozay Group", content: "ZabahSoft transformed our digital infrastructure with absolute precision.", avatar: "https://ui-avatars.com/api/?name=Jamshid+Alokozay&background=0D8ABC&color=fff", rating: 5 },
      { id: 2, name: "Sima Noori", role: "Operations Manager", company: "Red Crescent", content: "Their database clusters are incredibly secure and reliable for our critical data.", avatar: "https://ui-avatars.com/api/?name=Sima+Noori&background=e91e63&color=fff", rating: 5 },
      { id: 3, name: "Ahmad Shah", role: "Founder", company: "Kabul Tech Hub", content: "Best software development team in the region. Their attention to detail is unmatched.", avatar: "https://ui-avatars.com/api/?name=Ahmad+Shah&background=10b981&color=fff", rating: 5 }
    ];
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(defaultTestimonials));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS)) {
    const defaultSettings: SystemSettings = {
      defaultLanguage: 'fa',
      defaultTheme: 'dark',
      maintenanceMode: false
    };
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(defaultSettings));
  }
};

seedDatabase();

const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- Auth ---
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay();
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("Invalid credentials");
    const token = `zabah_token_${user.id}_${Date.now()}`;
    localStorage.setItem('zabah_token', token);
    localStorage.setItem('zabah_current_user_id', user.id.toString());
    return { user, token };
  },

  async register(data: any): Promise<{ user: User; token: string }> {
    await delay();
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find(u => u.email === data.email)) throw new Error("User exists");
    const newUser: User = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      role: UserRole.VIEWER,
      permissions: ['VIEW_REPORTS']
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, newUser]));
    return this.login(data.email, data.password);
  },

  async getMe(): Promise<User> {
    const userId = localStorage.getItem('zabah_current_user_id');
    if (!userId) throw new Error("Unauthorized");
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) throw new Error("User not found");
    return user;
  },

  // --- Users ---
  async getAllUsers(): Promise<User[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  async updateUser(updatedUser: User): Promise<User> {
    await delay();
    const users: User[] = await this.getAllUsers();
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
    return updatedUser;
  },

  async deleteUser(id: number): Promise<void> {
    await delay();
    const users: User[] = await this.getAllUsers();
    const newUsers = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
  },

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    await delay(200);
    const allOrders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const userId = localStorage.getItem('zabah_current_user_id');
    const currentUser = await this.getMe();
    if (currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ADMIN) {
      return allOrders;
    }
    return allOrders.filter(o => o.userId === currentUser.id);
  },

  async createOrder(serviceId: number, paymentMethod: string, details: any): Promise<Order> {
    const services = await this.getServices();
    const service = services.find(s => s.id === serviceId);
    const currentUser = await this.getMe();

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId: currentUser.id,
      service_id: serviceId,
      service_name: service?.name || 'Unknown',
      status: 'pending',
      payment_method: paymentMethod as any,
      amount_paid: paymentMethod === 'stripe' ? `$${service?.price_usd}` : `${service?.price_afn} AFN`,
      date: new Date().toISOString().split('T')[0]
    };
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([newOrder, ...orders]));
    return newOrder;
  },

  async updateOrder(updatedOrder: Order): Promise<Order> {
    await delay();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrders = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
    return updatedOrder;
  },

  async deleteOrder(id: string): Promise<void> {
    await delay();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrders = orders.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
  },

  // --- Services ---
  async getServices(): Promise<Service[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
  },

  async createService(newService: Service): Promise<Service> {
    await delay();
    const services = await this.getServices();
    const updated = [newService, ...services];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    return newService;
  },

  async updateService(updatedService: Service): Promise<Service> {
    await delay();
    const services = await this.getServices();
    const updated = services.map(s => s.id === updatedService.id ? updatedService : s);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    return updatedService;
  },

  async deleteService(id: number): Promise<void> {
    await delay();
    const services = await this.getServices();
    const updated = services.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  },

  // --- Blog ---
  async getPosts(): Promise<BlogPost[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
  },

  async createPost(post: BlogPost): Promise<BlogPost> {
    await delay();
    const posts = await this.getPosts();
    const updated = [post, ...posts];
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    return post;
  },

  async updatePost(post: BlogPost): Promise<BlogPost> {
    await delay();
    const posts = await this.getPosts();
    const updated = posts.map(p => p.id === post.id ? post : p);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    return post;
  },

  async deletePost(id: string): Promise<void> {
    await delay();
    const posts = await this.getPosts();
    const updated = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  },

  // --- Branches ---
  async getBranches(): Promise<Branch[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BRANCHES) || '[]');
  },

  async createBranch(branch: Branch): Promise<Branch> {
    await delay();
    const list = await this.getBranches();
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify([branch, ...list]));
    return branch;
  },

  async updateBranch(branch: Branch): Promise<Branch> {
    await delay();
    const list = await this.getBranches();
    const updated = list.map(b => b.id === branch.id ? branch : b);
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(updated));
    return branch;
  },

  async deleteBranch(id: string): Promise<void> {
    await delay();
    const list = await this.getBranches();
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(list.filter(b => b.id !== id)));
  },

  // --- Contributions ---
  async getContributions(): Promise<Contribution[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS) || '[]');
  },

  async submitContribution(contribution: Omit<Contribution, 'id' | 'date' | 'status'>): Promise<Contribution> {
    await delay();
    const list = await this.getContributions();
    const newEntry: Contribution = {
      ...contribution,
      id: `CON-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify([newEntry, ...list]));
    return newEntry;
  },

  async updateContributionStatus(id: string, status: Contribution['status']): Promise<void> {
    const list = await this.getContributions();
    const updated = list.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(updated));
  },

  async deleteContribution(id: string): Promise<void> {
    const list = await this.getContributions();
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(list.filter(c => c.id !== id)));
  },

  // --- Testimonials ---
  async getTestimonials(): Promise<Testimonial[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');
  },

  async createTestimonial(t: Testimonial): Promise<Testimonial> {
    await delay();
    const list = await this.getTestimonials();
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify([t, ...list]));
    return t;
  },

  async updateTestimonial(t: Testimonial): Promise<Testimonial> {
    await delay();
    const list = await this.getTestimonials();
    const updated = list.map(item => item.id === t.id ? t : item);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(updated));
    return t;
  },

  async deleteTestimonial(id: number): Promise<void> {
    await delay();
    const list = await this.getTestimonials();
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(list.filter(item => item.id !== id)));
  },

  // --- Contact Requests ---
  async getContactRequests(): Promise<ContactRequest[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
  },

  async submitContact(data: any): Promise<void> {
    await delay();
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const newRequest: ContactRequest = {
      id: `REQ-${Date.now()}`,
      ...data,
      date: new Date().toLocaleString(),
      status: 'new'
    };
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([newRequest, ...requests]));
  },

  async updateContactStatus(id: string, status: ContactRequest['status']): Promise<void> {
    const reqs = await this.getContactRequests();
    const updated = reqs.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
  },

  // --- System Settings ---
  async getSystemSettings(): Promise<SystemSettings> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS) || '{"defaultLanguage": "fa", "defaultTheme": "dark"}');
  },

  async updateSystemSettings(settings: SystemSettings): Promise<void> {
    await delay();
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
  },

  // --- Site Config ---
  async getSiteConfig(): Promise<any> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SITE_CONFIG) || '{}');
  },

  async updateSiteConfig(config: any): Promise<void> {
    await delay();
    const current = await this.getSiteConfig();
    localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify({ ...current, ...config }));
  }
};
