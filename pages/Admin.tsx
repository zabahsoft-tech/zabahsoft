
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission, User, Order, Service, BlogPost, Branch, Contribution, ServiceType, Testimonial, Language } from '../types';
import { api, ContactRequest, SystemSettings } from '../services/api';

const Admin: React.FC = () => {
  const { dir, t, language, refreshTranslations } = useLanguage();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'services' | 'requests' | 'blog' | 'branches' | 'contributions' | 'site_editor' | 'testimonials' | 'settings'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Site Editor State
  const [siteOverrides, setSiteOverrides] = useState<any>({
    heroTitle: t.heroTitle,
    heroSubtitle: t.heroSubtitle,
    heroBadge: t.heroBadge
  });

  // Edit Modals State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingBranch, setEditingBranch] = useState<Partial<Branch> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allUsers, allOrders, allReqs, allPosts, allBranches, allContribs, allServices, allTestimonials, sysSettings] = await Promise.all([
        api.getAllUsers(),
        api.getOrders(),
        api.getContactRequests(),
        api.getPosts(),
        api.getBranches(),
        api.getContributions(),
        api.getServices(),
        api.getTestimonials(),
        api.getSystemSettings()
      ]);
      setUsers(allUsers);
      setOrders(allOrders);
      setRequests(allReqs);
      setPosts(allPosts);
      setBranches(allBranches);
      setContributions(allContribs);
      setServices(allServices);
      setTestimonials(allTestimonials);
      setSystemSettings(sysSettings);
      
      const config = await api.getSiteConfig();
      if (config[language]) setSiteOverrides(config[language]);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [language]);

  const handleSaveSiteConfig = async () => {
    const config = await api.getSiteConfig();
    config[language] = siteOverrides;
    await api.updateSiteConfig(config);
    await refreshTranslations();
    alert("Home page content updated successfully!");
  };

  const handleSaveSystemSettings = async () => {
    if (!systemSettings) return;
    await api.updateSystemSettings(systemSettings);
    alert("System defaults updated successfully!");
  };

  // Generic Save Handlers
  const saveUser = async (user: User) => {
    await api.updateUser(user);
    setUsers(users.map(u => u.id === user.id ? user : u));
    setEditingUser(null);
  };

  const saveOrder = async (order: Order) => {
    await api.updateOrder(order);
    setOrders(orders.map(o => o.id === order.id ? order : o));
    setEditingOrder(null);
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete order permanently?')) return;
    await api.deleteOrder(id);
    setOrders(orders.filter(o => o.id !== id));
  };

  const savePost = async () => {
    if (!editingPost || !editingPost.title) return;
    const finalPost = {
      ...editingPost,
      id: editingPost.id || `post-${Date.now()}`,
      author: editingPost.author || { name: currentUser?.name || 'Admin', avatar: '', role: 'Staff' },
      publishedAt: editingPost.publishedAt || new Date().toLocaleDateString()
    } as BlogPost;
    
    if (posts.find(p => p.id === finalPost.id)) {
      await api.updatePost(finalPost);
      setPosts(posts.map(p => p.id === finalPost.id ? finalPost : p));
    } else {
      await api.createPost(finalPost);
      setPosts([finalPost, ...posts]);
    }
    setEditingPost(null);
  };

  const saveBranch = async () => {
    if (!editingBranch || !editingBranch.city) return;
    const finalBranch = { ...editingBranch, id: editingBranch.id || `br-${Date.now()}` } as Branch;
    if (branches.find(b => b.id === finalBranch.id)) {
      await api.updateBranch(finalBranch);
      setBranches(branches.map(b => b.id === finalBranch.id ? finalBranch : b));
    } else {
      await api.createBranch(finalBranch);
      setBranches([finalBranch, ...branches]);
    }
    setEditingBranch(null);
  };

  const handleSaveService = async () => {
    if (!editingService || !editingService.name) return;
    const finalService: Service = {
      id: editingService.id || Date.now(),
      name: editingService.name,
      description: editingService.description || '',
      type: editingService.type || ServiceType.WEB,
      price_afn: Number(editingService.price_afn) || 0,
      price_usd: Number(editingService.price_usd) || 0,
      features: editingService.features || [],
      icon: editingService.icon || 'fas fa-box',
      specs: editingService.specs || [],
    };
    if (services.find(s => s.id === finalService.id)) {
      await api.updateService(finalService);
      setServices(services.map(s => s.id === finalService.id ? finalService : s));
    } else {
      await api.createService(finalService);
      setServices([finalService, ...services]);
    }
    setEditingService(null);
  };

  const saveTestimonial = async () => {
    if (!editingTestimonial || !editingTestimonial.name) return;
    const finalTestimonial: Testimonial = {
      id: editingTestimonial.id || Date.now(),
      name: editingTestimonial.name,
      role: editingTestimonial.role || '',
      company: editingTestimonial.company || '',
      content: editingTestimonial.content || '',
      avatar: editingTestimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editingTestimonial.name)}&background=random`,
      rating: editingTestimonial.rating || 5
    };
    if (testimonials.find(t => t.id === finalTestimonial.id)) {
      await api.updateTestimonial(finalTestimonial);
      setTestimonials(testimonials.map(t => t.id === finalTestimonial.id ? finalTestimonial : t));
    } else {
      await api.createTestimonial(finalTestimonial);
      setTestimonials([finalTestimonial, ...testimonials]);
    }
    setEditingTestimonial(null);
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Remove testimonial?')) return;
    await api.deleteTestimonial(id);
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const StatsCard = ({ title, value, change, icon, color }: any) => (
    <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gh-border p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white shadow-lg`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">
          {change}
        </span>
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-8 min-h-screen bg-gray-50 dark:bg-[#0d1117]" dir={dir}>
      
      {/* Admin Nav */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <i className="fas fa-user-shield text-blue-600"></i> {t.adminTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t.adminSub}</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gh-border shadow-sm overflow-x-auto">
           {([
             { id: 'overview', icon: 'fa-chart-line' },
             { id: 'users', icon: 'fa-users' },
             { id: 'orders', icon: 'fa-shopping-cart' },
             { id: 'services', icon: 'fa-box' },
             { id: 'blog', icon: 'fa-newspaper' },
             { id: 'testimonials', icon: 'fa-quote-left' },
             { id: 'branches', icon: 'fa-map-marker-alt' },
             { id: 'requests', icon: 'fa-envelope' },
             { id: 'contributions', icon: 'fa-star' },
             { id: 'site_editor', icon: 'fa-pencil-alt' },
             { id: 'settings', icon: 'fa-cog' }
           ] as const).map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
             >
               <i className={`fas ${tab.icon} opacity-70`}></i>
               {tab.id.replace('_', ' ').toUpperCase()}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-fade-in">
        
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Total Users" value={users.length} change="+12" icon="fa-users" color="bg-blue-600" />
              <StatsCard title="Total Orders" value={orders.length} change="+5" icon="fa-shopping-cart" color="bg-purple-600" />
              <StatsCard title="Total Revenue" value="120,000 AFN" change="+25%" icon="fa-wallet" color="bg-green-600" />
              <StatsCard title="Feedback Items" value={contributions.length} change="Live" icon="fa-star" color="bg-orange-500" />
            </div>
            <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gh-border p-8 rounded-2xl shadow-sm">
               <h3 className="text-xl font-bold mb-6">Recent System Operations</h3>
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-600"><i className="fas fa-history"></i></div>
                          <div>
                             <p className="text-sm font-bold">Admin updated system parameters</p>
                             <p className="text-[10px] text-gray-500 uppercase">Automated Log</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-gray-400">SUCCESS</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Dynamic Tables for Models */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gh-border">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <img src={`https://ui-avatars.com/api/?name=${u.name}`} className="w-8 h-8 rounded-full" />
                               <div><p className="text-sm font-bold">{u.name}</p><p className="text-[10px] text-gray-500">{u.email}</p></div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === UserRole.SUPER_ADMIN ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{u.role}</span>
                         </td>
                         <td className="px-6 py-4 text-xs font-mono text-gray-400">{u.whatsapp}</td>
                         <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditingUser(u)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><i className="fas fa-edit"></i></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Testimonials Management */}
        {activeTab === 'testimonials' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg">Testimonials Registry</h3>
                <button onClick={() => setEditingTestimonial({ rating: 5 })} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><i className="fas fa-plus"></i> Add Testimonial</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gh-border">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Author</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rating</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Content</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {testimonials.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <img src={item.avatar} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" />
                               <div>
                                  <p className="text-sm font-bold">{item.name}</p>
                                  <p className="text-[10px] text-gray-500 uppercase">{item.role}, {item.company}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex gap-0.5 text-yellow-400 text-[10px]">
                               {[...Array(5)].map((_, i) => <i key={i} className={`${i < item.rating ? 'fas' : 'far'} fa-star`}></i>)}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic max-w-md">"{item.content}"</p>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingTestimonial(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><i className="fas fa-edit"></i></button>
                               <button onClick={() => deleteTestimonial(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'settings' && systemSettings && (
           <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="bg-white dark:bg-[#161b22] p-8 rounded-2xl border border-gray-200 dark:border-gh-border shadow-sm">
                 <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <i className="fas fa-sliders-h text-blue-600"></i> Global System Configuration
                 </h3>
                 
                 <div className="space-y-8">
                    {/* Default Language Setting */}
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.lblDefaultLang}</label>
                       <div className="grid grid-cols-3 gap-4">
                          {(['en', 'fa', 'ps'] as Language[]).map(l => (
                             <button
                                key={l}
                                onClick={() => setSystemSettings({...systemSettings, defaultLanguage: l})}
                                className={`py-4 rounded-xl border-2 font-bold transition-all ${systemSettings.defaultLanguage === l ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-100 dark:border-gh-border text-gray-400 hover:border-gray-300'}`}
                             >
                                {l.toUpperCase()}
                             </button>
                          ))}
                       </div>
                    </div>

                    {/* Default Theme Setting */}
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.lblDefaultTheme}</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button
                             onClick={() => setSystemSettings({...systemSettings, defaultTheme: 'light'})}
                             className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 font-bold transition-all ${systemSettings.defaultTheme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 dark:border-gh-border text-gray-400 hover:border-gray-300'}`}
                          >
                             <i className="fas fa-sun"></i> {t.themeLight}
                          </button>
                          <button
                             onClick={() => setSystemSettings({...systemSettings, defaultTheme: 'dark'})}
                             className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 font-bold transition-all ${systemSettings.defaultTheme === 'dark' ? 'border-blue-600 bg-blue-900/20 text-blue-600' : 'border-gray-100 dark:border-gh-border text-gray-400 hover:border-gray-300'}`}
                          >
                             <i className="fas fa-moon"></i> {t.themeDark}
                          </button>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                       <button 
                         onClick={handleSaveSystemSettings}
                         className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
                       >
                          {t.btnSaveSettings}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 p-6 rounded-2xl flex gap-4">
                 <i className="fas fa-info-circle text-blue-600 text-xl mt-1"></i>
                 <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                    Changing the <b>Default Language</b> will affect the initial experience for new visitors who haven't selected a preference. 
                    <b> Default Theme</b> determines the initial visual state of the application.
                 </p>
              </div>
           </div>
        )}

        {/* Rest of the Tabs... */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gh-border">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {orders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">#{o.id}</td>
                         <td className="px-6 py-4 text-sm font-bold">{o.service_name}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{o.status}</span>
                         </td>
                         <td className="px-6 py-4 text-xs font-bold">{o.amount_paid}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingOrder(o)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><i className="fas fa-edit"></i></button>
                               <button onClick={() => deleteOrder(o.id)} className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Site Content Editor */}
        {activeTab === 'site_editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-[#161b22] p-8 rounded-2xl border border-gray-200 dark:border-gh-border shadow-sm">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                   <i className="fas fa-edit text-blue-600"></i> Localized Content Editor ({language.toUpperCase()})
                </h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hero Title</label>
                      <input 
                        type="text" 
                        value={siteOverrides.heroTitle} 
                        onChange={e => setSiteOverrides({...siteOverrides, heroTitle: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hero Subtitle</label>
                      <textarea 
                        rows={4}
                        value={siteOverrides.heroSubtitle} 
                        onChange={e => setSiteOverrides({...siteOverrides, heroSubtitle: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                      ></textarea>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hero Badge</label>
                      <input 
                        type="text" 
                        value={siteOverrides.heroBadge} 
                        onChange={e => setSiteOverrides({...siteOverrides, heroBadge: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      />
                   </div>
                   <button 
                     onClick={handleSaveSiteConfig}
                     className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
                   >
                      Save Home Page Updates
                   </button>
                </div>
             </div>
             
             {/* Live Preview Simulation */}
             <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-2xl p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-4"><span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded">LIVE PREVIEW</span></div>
                <div className="h-full flex flex-col justify-center text-center px-6">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 text-[10px] font-bold uppercase mx-auto mb-6">
                      {siteOverrides.heroBadge}
                   </div>
                   <h2 className="text-3xl font-bold mb-4">{siteOverrides.heroTitle}</h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{siteOverrides.heroSubtitle}</p>
                </div>
             </div>
          </div>
        )}

        {/* Blog Management */}
        {activeTab === 'blog' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold">Article Manager</h3>
                <button onClick={() => setEditingPost({})} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><i className="fas fa-plus"></i> New Post</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Post Title</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {posts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4 font-bold text-sm">{p.title}</td>
                         <td className="px-6 py-4 text-xs">{p.category}</td>
                         <td className="px-6 py-4 text-right">
                            <button onClick={() => setEditingPost(p)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><i className="fas fa-edit"></i></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

      </div>

      {/* Edit Modals Implementation */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in">
              <h3 className="text-xl font-bold mb-6">Edit User Access</h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Account Role</label>
                    <select 
                      value={editingUser.role} 
                      onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                      className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 outline-none"
                    >
                       {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                 </div>
                 <div className="flex gap-3 pt-6">
                    <button onClick={() => setEditingUser(null)} className="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
                    <button onClick={() => saveUser(editingUser)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save Changes</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {editingTestimonial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-xl p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in">
              <h3 className="text-2xl font-bold mb-8">Testimonial Editor</h3>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Author Name</label>
                        <input type="text" value={editingTestimonial.name || ''} onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Rating (1-5)</label>
                        <select value={editingTestimonial.rating || 5} onChange={e => setEditingTestimonial({...editingTestimonial, rating: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm">
                           {[1,2,3,4,5].map(num => <option key={num} value={num}>{num} Stars</option>)}
                        </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Role / Title</label>
                        <input type="text" value={editingTestimonial.role || ''} onChange={e => setEditingTestimonial({...editingTestimonial, role: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Company</label>
                        <input type="text" value={editingTestimonial.company || ''} onChange={e => setEditingTestimonial({...editingTestimonial, company: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Testimonial Content</label>
                    <textarea rows={4} value={editingTestimonial.content || ''} onChange={e => setEditingTestimonial({...editingTestimonial, content: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm resize-none"></textarea>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setEditingTestimonial(null)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                    <button onClick={saveTestimonial} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold">Save Registry</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in">
              <h3 className="text-xl font-bold mb-6">Order Control Panel</h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">License Status</label>
                    <select 
                      value={editingOrder.status} 
                      onChange={e => setEditingOrder({...editingOrder, status: e.target.value as any})}
                      className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 outline-none"
                    >
                       <option value="pending">Pending Delivery</option>
                       <option value="completed">Active License</option>
                       <option value="cancelled">Cancelled/Refunded</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">License Key</label>
                    <input 
                      type="text" 
                      value={editingOrder.license_key || ''} 
                      onChange={e => setEditingOrder({...editingOrder, license_key: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 outline-none font-mono text-xs"
                      placeholder="ZBH-XXXX-XXXX"
                    />
                 </div>
                 <div className="flex gap-3 pt-6">
                    <button onClick={() => setEditingOrder(null)} className="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
                    <button onClick={() => saveOrder(editingOrder)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Deploy Update</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Blog Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-4xl p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold mb-8">Article Composer</h3>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Title</label>
                        <input type="text" value={editingPost.title || ''} onChange={e => setEditingPost({...editingPost, title: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Slug</label>
                        <input type="text" value={editingPost.slug || ''} onChange={e => setEditingPost({...editingPost, slug: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 outline-none font-mono" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Content (HTML)</label>
                    <textarea rows={10} value={editingPost.content || ''} onChange={e => setEditingPost({...editingPost, content: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 outline-none font-mono text-sm resize-none"></textarea>
                 </div>
                 <div className="flex justify-end gap-3 pt-6">
                    <button onClick={() => setEditingPost(null)} className="px-6 py-3 text-gray-500 font-bold">Discard</button>
                    <button onClick={savePost} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Publish Article</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
