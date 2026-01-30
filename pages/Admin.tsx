
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission, User, Order, Service, BlogPost, Branch, Contribution, ServiceType, Testimonial, Language, ContributionType } from '../types';
import { api, ContactRequest, SystemSettings, VoiceMail } from '../services/api';

const Admin: React.FC = () => {
  const { dir, t, language, refreshTranslations } = useLanguage();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'services' | 'requests' | 'blog' | 'branches' | 'contributions' | 'site_editor' | 'testimonials' | 'legal' | 'voicemails' | 'settings'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [voicemails, setVoicemails] = useState<VoiceMail[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Legal Editor State
  const [legalType, setLegalType] = useState<'privacy' | 'terms'>('privacy');
  const [privacyContent, setPrivacyContent] = useState<Record<Language, string>>({ en: '', fa: '', ps: '' });
  const [termsContent, setTermsContent] = useState<Record<Language, string>>({ en: '', fa: '', ps: '' });

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
  const [editingRequest, setEditingRequest] = useState<Partial<ContactRequest> | null>(null);
  const [editingContribution, setEditingContribution] = useState<Partial<Contribution> | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allUsers, allOrders, allReqs, allPosts, allBranches, allContribs, allServices, allTestimonials, sysSettings, privacy, terms, allVoices] = await Promise.all([
        api.getAllUsers(),
        api.getOrders(),
        api.getContactRequests(),
        api.getPosts(),
        api.getBranches(),
        api.getContributions(),
        api.getServices(),
        api.getTestimonials(),
        api.getSystemSettings(),
        api.getLegalContent('privacy'),
        api.getLegalContent('terms'),
        api.getVoiceMails()
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
      setPrivacyContent(privacy);
      setTermsContent(terms);
      setVoicemails(allVoices);
      
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

  const handleSaveLegal = async () => {
    if (legalType === 'privacy') {
      await api.updateLegalContent('privacy', privacyContent);
    } else {
      await api.updateLegalContent('terms', termsContent);
    }
    alert("Legal content updated successfully!");
  };

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

  const deleteVoiceMail = async (id: string) => {
    if (!confirm('Delete this voice mail?')) return;
    await api.deleteVoiceMail(id);
    setVoicemails(voicemails.filter(v => v.id !== id));
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

  const deleteBranch = async (id: string) => {
    if (!confirm('Remove this branch?')) return;
    await api.deleteBranch(id);
    setBranches(branches.filter(b => b.id !== id));
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
      badge: editingService.badge || undefined
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

  const deleteService = async (id: number) => {
    if (!confirm('Delete service from catalog?')) return;
    await api.deleteService(id);
    setServices(services.filter(s => s.id !== id));
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

  const saveRequest = async () => {
    if (!editingRequest || !editingRequest.name) return;
    const finalRequest: ContactRequest = {
      id: editingRequest.id || `REQ-${Date.now()}`,
      name: editingRequest.name || '',
      email: editingRequest.email || '',
      subject: editingRequest.subject || '',
      message: editingRequest.message || '',
      date: editingRequest.date || new Date().toLocaleString(),
      status: editingRequest.status || 'new'
    };
    if (requests.find(r => r.id === finalRequest.id)) {
      await api.updateContactRequest(finalRequest);
      setRequests(requests.map(r => r.id === finalRequest.id ? finalRequest : r));
    } else {
      await api.createContactRequest(finalRequest);
      setRequests([finalRequest, ...requests]);
    }
    setEditingRequest(null);
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Remove contact request?')) return;
    await api.deleteContactRequest(id);
    setRequests(requests.filter(r => r.id !== id));
  };

  const saveContribution = async () => {
    if (!editingContribution || !editingContribution.title) return;
    const finalContribution: Contribution = {
      id: editingContribution.id || `CON-${Date.now()}`,
      userId: editingContribution.userId || 0,
      userName: editingContribution.userName || 'Unknown',
      type: editingContribution.type || 'FEEDBACK',
      title: editingContribution.title || '',
      content: editingContribution.content || '',
      status: editingContribution.status || 'pending',
      date: editingContribution.date || new Date().toLocaleDateString()
    };
    if (contributions.find(c => c.id === finalContribution.id)) {
      await api.updateContribution(finalContribution);
      setContributions(contributions.map(c => c.id === finalContribution.id ? finalContribution : c));
    } else {
      await api.createContribution(finalContribution);
      setContributions([finalContribution, ...contributions]);
    }
    setEditingContribution(null);
  };

  const deleteContribution = async (id: string) => {
    if (!confirm('Delete this contribution?')) return;
    await api.deleteContribution(id);
    setContributions(contributions.filter(c => c.id !== id));
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
             { id: 'voicemails', icon: 'fa-microphone' },
             { id: 'contributions', icon: 'fa-star' },
             { id: 'legal', icon: 'fa-balance-scale' },
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
              <StatsCard title="Voice Mails" value={voicemails.length} change="Live" icon="fa-microphone" color="bg-red-500" />
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

        {/* Voice Mails Management Tab */}
        {activeTab === 'voicemails' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg">{t.adminVoiceMails}</h3>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gh-border">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">WhatsApp</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Player</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {voicemails.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4 text-xs font-mono text-gray-500">{v.date}</td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <i className="fab fa-whatsapp text-green-500"></i>
                               <span className="font-bold text-sm">{v.whatsapp}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <audio controls className="h-8 max-w-[200px]">
                               <source src={v.audio} type="audio/ogg" />
                            </audio>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <a href={`https://wa.me/${v.whatsapp}`} target="_blank" rel="noreferrer" className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><i className="fas fa-external-link-alt"></i></a>
                               <button onClick={() => deleteVoiceMail(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                   {voicemails.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">No voice mails received yet.</td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
        )}

        {/* Legal Editor Tab */}
        {activeTab === 'legal' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-[#161b22] p-8 rounded-2xl border border-gray-200 dark:border-gh-border shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold flex items-center gap-3">
                      <i className="fas fa-balance-scale text-blue-600"></i> Legal Documents Editor
                   </h3>
                   <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <button onClick={() => setLegalType('privacy')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${legalType === 'privacy' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'}`}>Privacy</button>
                      <button onClick={() => setLegalType('terms')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${legalType === 'terms' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'}`}>Terms</button>
                   </div>
                </div>
                
                <div className="space-y-6">
                   {(['en', 'fa', 'ps'] as Language[]).map(l => (
                      <div key={l} className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{l.toUpperCase()} Version</label>
                         <textarea 
                           rows={8}
                           value={legalType === 'privacy' ? privacyContent[l] : termsContent[l]} 
                           onChange={e => {
                              if (legalType === 'privacy') setPrivacyContent({...privacyContent, [l]: e.target.value});
                              else setTermsContent({...termsContent, [l]: e.target.value});
                           }}
                           className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-4 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                           placeholder="<h1>Title</h1><p>Content...</p>"
                         ></textarea>
                      </div>
                   ))}
                   <button 
                     onClick={handleSaveLegal}
                     className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
                   >
                      Save Global Legal Update
                   </button>
                </div>
             </div>
             
             {/* Live Preview */}
             <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-2xl p-8 relative overflow-hidden shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded">DOCUMENT PREVIEW ({language.toUpperCase()})</span>
                </div>
                <div className="flex-1 prose prose-sm dark:prose-invert max-w-none overflow-y-auto">
                   <div dangerouslySetInnerHTML={{ __html: legalType === 'privacy' ? privacyContent[language] : termsContent[language] }} />
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
                               <button onClick={() => deleteTestimonial(item.id)} className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Services Management */}
        {activeTab === 'services' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold">Services Catalog</h3>
                <button onClick={() => setEditingService({ features: [], specs: [], type: ServiceType.WEB, icon: 'fas fa-box' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><i className="fas fa-plus"></i> Add Service</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price (USD/AFN)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {services.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-600"><i className={s.icon}></i></div>
                               <span className="font-bold text-sm">{s.name}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 uppercase">{s.type}</span>
                         </td>
                         <td className="px-6 py-4 text-xs font-bold">
                            ${s.price_usd} / {s.price_afn.toLocaleString()} AFN
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingService(s)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><i className="fas fa-edit"></i></button>
                               <button onClick={() => deleteService(s.id)} className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Requests Management */}
        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold">Contact Requests</h3>
                <button onClick={() => setEditingRequest({ status: 'new' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><i className="fas fa-plus"></i> New Request</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sender</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subject</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {requests.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4">
                            <p className="text-sm font-bold">{r.name}</p>
                            <p className="text-[10px] text-gray-500">{r.email}</p>
                         </td>
                         <td className="px-6 py-4 text-xs font-medium text-gray-700 dark:text-gray-300">{r.subject}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.status === 'new' ? 'bg-blue-500/10 text-blue-500' : r.status === 'read' ? 'bg-gray-500/10 text-gray-500' : 'bg-orange-500/10 text-orange-500'}`}>{r.status}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingRequest(r)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><i className="fas fa-edit"></i></button>
                               <button onClick={() => deleteRequest(r.id)} className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Contributions Management */}
        {activeTab === 'contributions' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold">Community Contributions</h3>
                <button onClick={() => setEditingContribution({ status: 'pending', type: 'FEEDBACK' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><i className="fas fa-plus"></i> Add Item</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Title</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {contributions.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4 text-sm font-bold">{c.userName}</td>
                         <td className="px-6 py-4 text-[10px] font-bold uppercase text-blue-500">{c.type}</td>
                         <td className="px-6 py-4 text-xs font-medium max-w-xs truncate">{c.title}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingContribution(c)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><i className="fas fa-edit"></i></button>
                               <button onClick={() => deleteContribution(c.id)} className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Branches Management */}
        {activeTab === 'branches' && (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gh-border overflow-hidden shadow-sm">
             <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold">Global Branch Network</h3>
                <button onClick={() => setEditingBranch({})} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><i className="fas fa-plus"></i> {t.adminBtnNewBranch}</button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">City</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Address</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact Info</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {branches.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gh-border/10">
                         <td className="px-6 py-4 font-bold text-sm">{b.city}</td>
                         <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{b.address}</td>
                         <td className="px-6 py-4 text-xs text-gray-500">
                            <p>{b.phone}</p>
                            <p className="text-blue-500">{b.email}</p>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingBranch(b)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><i className="fas fa-edit"></i></button>
                               <button onClick={() => deleteBranch(b.id)} className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg"><i className="fas fa-trash"></i></button>
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

        {/* Orders Table */}
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

      {/* Edit User Modal */}
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

      {/* Service Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold mb-8">Service Registry Editor</h3>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Service Name</label>
                        <input type="text" value={editingService.name || ''} onChange={e => setEditingService({...editingService, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Service Type</label>
                        <select value={editingService.type || ServiceType.WEB} onChange={e => setEditingService({...editingService, type: e.target.value as ServiceType})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm outline-none">
                           {Object.values(ServiceType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Price (AFN)</label>
                        <input type="number" value={editingService.price_afn || 0} onChange={e => setEditingService({...editingService, price_afn: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Price (USD)</label>
                        <input type="number" value={editingService.price_usd || 0} onChange={e => setEditingService({...editingService, price_usd: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm outline-none" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Class (FA)</label>
                        <input type="text" value={editingService.icon || ''} onChange={e => setEditingService({...editingService, icon: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm outline-none" placeholder="fas fa-laptop-code" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Badge (Optional)</label>
                        <input type="text" value={editingService.badge || ''} onChange={e => setEditingService({...editingService, badge: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm outline-none" placeholder="Best Seller" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Short Description</label>
                    <textarea rows={2} value={editingService.description || ''} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none resize-none"></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Features (One per line)</label>
                        <textarea rows={4} value={editingService.features?.join('\n') || ''} onChange={e => setEditingService({...editingService, features: e.target.value.split('\n').filter(f => f.trim())})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-xs font-mono outline-none resize-none" placeholder="Responsive Design&#10;SSL Included"></textarea>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Specs (Label: Value per line)</label>
                        <textarea rows={4} value={editingService.specs?.map(s => `${s.label}: ${s.value}`).join('\n') || ''} onChange={e => {
                           const newSpecs = e.target.value.split('\n').map(line => {
                              const [label, ...rest] = line.split(':');
                              return { label: label.trim(), value: rest.join(':').trim() };
                           }).filter(s => s.label);
                           setEditingService({...editingService, specs: newSpecs});
                        }} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-xs font-mono outline-none resize-none" placeholder="Stack: React&#10;Uptime: 99.9%"></textarea>
                    </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => setEditingService(null)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                    <button onClick={handleSaveService} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">Save Service</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Request Editor Modal */}
      {editingRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-xl p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in">
              <h3 className="text-2xl font-bold mb-8">Contact Request Editor</h3>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Sender Name</label>
                        <input type="text" value={editingRequest.name || ''} onChange={e => setEditingRequest({...editingRequest, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
                        <select value={editingRequest.status || 'new'} onChange={e => setEditingRequest({...editingRequest, status: e.target.value as any})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm">
                           <option value="new">New</option>
                           <option value="read">Read</option>
                           <option value="archived">Archived</option>
                        </select>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
                    <input type="email" value={editingRequest.email || ''} onChange={e => setEditingRequest({...editingRequest, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Subject</label>
                    <input type="text" value={editingRequest.subject || ''} onChange={e => setEditingRequest({...editingRequest, subject: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Message Body</label>
                    <textarea rows={4} value={editingRequest.message || ''} onChange={e => setEditingRequest({...editingRequest, message: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm resize-none"></textarea>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setEditingRequest(null)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                    <button onClick={saveRequest} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold">Save Request</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Contribution Editor Modal */}
      {editingContribution && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-xl p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in">
              <h3 className="text-2xl font-bold mb-8">Contribution Editor</h3>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Username</label>
                        <input type="text" value={editingContribution.userName || ''} onChange={e => setEditingContribution({...editingContribution, userName: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
                        <select value={editingContribution.status || 'pending'} onChange={e => setEditingContribution({...editingContribution, status: e.target.value as any})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm">
                           <option value="pending">Pending</option>
                           <option value="approved">Approved</option>
                           <option value="implemented">Implemented</option>
                           <option value="archived">Archived</option>
                        </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
                        <select value={editingContribution.type || 'FEEDBACK'} onChange={e => setEditingContribution({...editingContribution, type: e.target.value as ContributionType})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm">
                           <option value="SUCCESS_STORY">Success Story</option>
                           <option value="FEATURE_REQUEST">Feature Request</option>
                           <option value="FEEDBACK">Feedback</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">User ID</label>
                        <input type="number" value={editingContribution.userId || 0} onChange={e => setEditingContribution({...editingContribution, userId: parseInt(e.target.value)})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Title</label>
                    <input type="text" value={editingContribution.title || ''} onChange={e => setEditingContribution({...editingContribution, title: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Content</label>
                    <textarea rows={4} value={editingContribution.content || ''} onChange={e => setEditingContribution({...editingContribution, content: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm resize-none"></textarea>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setEditingContribution(null)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                    <button onClick={saveContribution} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold">Save Contribution</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Testimonial Editor Modal */}
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

      {/* Branch Editor Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-[#161b22] rounded-2xl w-full max-w-xl p-8 shadow-2xl border border-gray-200 dark:border-gh-border animate-scale-in">
              <h3 className="text-2xl font-bold mb-8">Branch Network Editor</h3>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">City / Region</label>
                        <input type="text" value={editingBranch.city || ''} onChange={e => setEditingBranch({...editingBranch, city: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" placeholder="e.g. Kabul, Afghanistan" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Phone</label>
                        <input type="text" value={editingBranch.phone || ''} onChange={e => setEditingBranch({...editingBranch, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" placeholder="+93..." />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Physical Address</label>
                    <input type="text" value={editingBranch.address || ''} onChange={e => setEditingBranch({...editingBranch, address: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
                        <input type="email" value={editingBranch.email || ''} onChange={e => setEditingBranch({...editingBranch, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Map Query</label>
                        <input type="text" value={editingBranch.mapQuery || ''} onChange={e => setEditingBranch({...editingBranch, mapQuery: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gh-border rounded-xl p-3 text-sm" placeholder="e.g. Ansari Square, Kabul" />
                    </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setEditingBranch(null)} className="px-6 py-2 text-gray-500 font-bold">Discard</button>
                    <button onClick={saveBranch} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Register Branch</button>
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
