
import React, { useEffect, useState } from 'react';
import { User, Order, Contribution, ContributionType, Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t, dir, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'deployments' | 'billing' | 'spending' | 'contributions' | 'preferences'>('deployments');
  const [orders, setOrders] = useState<Order[]>([]);
  const [myContributions, setMyContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Theme state to local dashboard override
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  // Contribution Form State
  const [contribForm, setContribForm] = useState({
    type: 'FEEDBACK' as ContributionType,
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderData, contribData] = await Promise.all([
          api.getOrders(),
          api.getContributions()
        ]);
        setOrders(orderData);
        setMyContributions(contribData.filter(c => c.userId === user.id));
        
        const savedTheme = localStorage.getItem('zabah_theme') as 'light' | 'dark';
        if (savedTheme) setCurrentTheme(savedTheme);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setCurrentTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('zabah_theme', newTheme);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (order: Order) => {
    const message = `Salam ZabahSoft Support Team. I need help with my deployment: ${order.service_name} (Order ID: ${order.id}). My WhatsApp on record is ${user.whatsapp}.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/93799000000?text=${encoded}`, '_blank');
  };

  const handleContribSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newEntry = await api.submitContribution({
        userId: user.id,
        userName: user.name,
        ...contribForm
      });
      setMyContributions([newEntry, ...myContributions]);
      setContribForm({ type: 'FEEDBACK', title: '', content: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalInvestment = orders.reduce((acc, curr) => {
    const val = parseFloat(curr.amount_paid.replace(/[^0-9.]/g, '')) || 0;
    return acc + (curr.amount_paid.includes('$') ? val : val / 70); 
  }, 0);

  const StatBox = ({ label, value, icon, color }: any) => (
    <div className="dashboard-card p-6 rounded-2xl flex items-center gap-5 border border-gh-border/50">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${color} text-white`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 md:px-8">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in-up">
        <div>
           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              {t.welcomeBack}, {user.name.split(' ')[0]} <span className="text-2xl animate-bounce">👋</span>
           </h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('preferences')}
              className="bg-white dark:bg-gh-dark border border-gray-200 dark:border-gh-border text-gray-900 dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:border-gh-blue transition-all flex items-center gap-2 shadow-lg group"
            >
               <i className="fas fa-cog group-hover:rotate-90 transition-transform text-blue-600"></i> {t.adminActions}
            </button>
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-extrabold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
               <i className="fas fa-plus"></i> New Service
            </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <StatBox label={t.totalSpent} value={`$${totalInvestment.toFixed(2)}`} icon="fa-wallet" color="bg-blue-600" />
        <StatBox label={t.activeServices} value={orders.length} icon="fa-rocket" color="bg-purple-600" />
        <StatBox label="WhatsApp Status" value="Online" icon="fa-headset" color="bg-green-600" />
        <StatBox label="Security Layer" value="Hardened" icon="fa-shield-alt" color="bg-orange-500" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 shrink-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
           <div className="bg-white dark:bg-[#161b22] rounded-2xl p-2 sticky top-24 border border-gray-200 dark:border-gh-border/50 shadow-sm">
               <nav className="flex flex-col gap-1">
                  <button 
                    onClick={() => setActiveTab('deployments')}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${activeTab === 'deployments' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gh-border/30'}`}
                  >
                     <div className="flex items-center gap-3">
                        <i className="fas fa-server w-5 text-center"></i> 
                        {t.activeServices}
                     </div>
                     {activeTab === 'deployments' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
                  </button>
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${activeTab === 'billing' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gh-border/30'}`}
                  >
                     <div className="flex items-center gap-3">
                        <i className="fas fa-receipt w-5 text-center"></i> 
                        {t.recentOrders}
                     </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('spending')}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${activeTab === 'spending' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gh-border/30'}`}
                  >
                     <div className="flex items-center gap-3">
                        <i className="fas fa-chart-pie w-5 text-center"></i> 
                        {t.spendingOverview}
                     </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('contributions')}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${activeTab === 'contributions' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gh-border/30'}`}
                  >
                     <div className="flex items-center gap-3">
                        <i className="fas fa-star w-5 text-center"></i> 
                        {t.contribute}
                     </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('preferences')}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${activeTab === 'preferences' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gh-border/30'}`}
                  >
                     <div className="flex items-center gap-3">
                        <i className="fas fa-sliders-h w-5 text-center"></i> 
                        Settings
                     </div>
                  </button>
               </nav>
               
               <div className="mt-8 px-4 py-5 border-t border-gray-100 dark:border-gh-border">
                  <div className="flex items-center gap-3 mb-4">
                     <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gh-border shadow-sm" alt="User" />
                     <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                     </div>
                  </div>
                  
                  <div className="mb-4 bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <i className="fab fa-whatsapp text-green-500 text-sm"></i>
                        <span className="text-[10px] font-bold text-gray-700 dark:text-white font-mono">{user.whatsapp}</span>
                     </div>
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                  </div>

                  <button className="w-full text-xs font-bold text-red-500 hover:bg-red-500/10 py-2.5 rounded-xl transition-all border border-red-500/20 active:scale-95">
                     <i className="fas fa-sign-out-alt mr-2"></i> {t.logout}
                  </button>
               </div>
           </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 min-w-0 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          
          {activeTab === 'deployments' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.activeServices}</h3>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gh-dark/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gh-border shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {orders.filter(o => o.status === 'completed').length} Systems Online
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {loading ? (
                       [1,2,3,4].map(i => <div key={i} className="bg-white dark:bg-[#161b22] h-52 rounded-2xl animate-pulse border border-gray-200 dark:border-gh-border"></div>)
                   ) : orders.length === 0 ? (
                       <div className="col-span-2 py-20 text-center bg-white dark:bg-gh-dark border border-gray-200 dark:border-gh-border rounded-2xl border-dashed">
                          <i className="fas fa-cloud-upload-alt text-4xl text-gray-300 dark:text-gh-muted-dark mb-4"></i>
                          <p className="text-gray-900 dark:text-white font-bold">No deployments yet</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Start by choosing a package from our solutions catalog.</p>
                       </div>
                   ) : (
                       orders.map((order) => (
                       <div key={order.id} className="bg-white dark:bg-[#161b22] p-6 rounded-2xl group flex flex-col justify-between border border-gray-200 dark:border-gh-border/50 hover:border-blue-500 transition-all shadow-md hover:shadow-xl">
                          <div className="flex justify-between items-start mb-6">
                             <div className="w-12 h-12 bg-gray-50 dark:bg-gh-dark border border-gray-200 dark:border-gh-border rounded-xl flex items-center justify-center text-blue-600 dark:text-accent-blue group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <i className="fas fa-cube text-xl"></i>
                             </div>
                             <div className="flex flex-col items-end gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                                    order.status === 'completed' 
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' 
                                    : order.status === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                }`}>
                                   {order.status}
                                </span>
                                <button 
                                   onClick={() => openWhatsApp(order)}
                                   className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                   <i className="fab fa-whatsapp"></i> Support
                                </button>
                             </div>
                          </div>
                          <div>
                             <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors leading-tight">{order.service_name}</h4>
                             <p className="text-gray-500 dark:text-gray-400 text-[11px] mb-6 flex items-center gap-2">
                                <i className="far fa-calendar-alt text-blue-600"></i> Deployed: {order.date}
                             </p>
                          </div>
                          <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gh-border/50">
                             <div className="text-xs">
                                <p className="text-gray-400 dark:text-gray-500 font-bold mb-1.5 uppercase tracking-tighter text-[9px]">License Key</p>
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gh-bg/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gh-border font-mono text-[10px] text-blue-600 dark:text-accent-blue group-hover:bg-white dark:group-hover:bg-gh-dark transition-colors">
                                   {order.license_key || 'ZBH-PENDING-XXXX'}
                                   <button onClick={() => handleCopy(order.license_key || '')} className="hover:text-blue-600 dark:hover:text-white transition-colors p-1" title="Copy Key">
                                      <i className={`fas ${copiedId === order.license_key ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                                   </button>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-gray-400 dark:text-gray-500 font-bold mb-1.5 uppercase tracking-tighter text-[9px]">Investment</p>
                                <p className="text-gray-900 dark:text-white font-extrabold text-sm">{order.amount_paid}</p>
                             </div>
                          </div>
                       </div>
                       ))
                   )}
                </div>
             </div>
          )}

          {activeTab === 'preferences' && (
             <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="bg-white dark:bg-[#161b22] rounded-2xl p-8 border border-gray-200 dark:border-gh-border/50 shadow-xl">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                      <i className="fas fa-user-cog text-blue-600"></i> {t.userPreferences}
                   </h3>

                   <div className="space-y-10">
                      {/* Language Preference */}
                      <div className="space-y-4">
                         <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t.lblDefaultLang}</label>
                         <div className="grid grid-cols-3 gap-3">
                            {(['en', 'fa', 'ps'] as Language[]).map(l => (
                               <button
                                  key={l}
                                  onClick={() => setLanguage(l)}
                                  className={`py-4 rounded-xl border-2 font-bold transition-all text-sm ${language === l ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-md' : 'border-gray-100 dark:border-gh-border text-gray-400 hover:border-gray-300'}`}
                               >
                                  {l === 'en' ? 'English' : l === 'fa' ? 'Farsi' : 'Pashto'}
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* Theme Preference */}
                      <div className="space-y-4">
                         <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t.lblDefaultTheme}</label>
                         <div className="grid grid-cols-2 gap-3">
                            <button
                               onClick={() => handleThemeChange('light')}
                               className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 font-bold transition-all ${currentTheme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' : 'border-gray-100 dark:border-gh-border text-gray-400 hover:border-gray-300'}`}
                            >
                               <i className="fas fa-sun"></i> {t.themeLight}
                            </button>
                            <button
                               onClick={() => handleThemeChange('dark')}
                               className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 font-bold transition-all ${currentTheme === 'dark' ? 'border-blue-600 bg-blue-900/20 text-blue-600 shadow-md' : 'border-gray-100 dark:border-gh-border text-gray-400 hover:border-gray-300'}`}
                            >
                               <i className="fas fa-moon"></i> {t.themeDark}
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                      <p className="text-xs text-gray-500 italic">Preferences are saved automatically to your browser.</p>
                   </div>
                </div>
             </div>
          )}

          {/* Rest of Tabs (billing, spending, contributions)... */}
          {activeTab === 'billing' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.recentOrders}</h3>
                   <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">Download All Invoices</button>
                </div>
                {/* ... existing table code ... */}
             </div>
          )}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
