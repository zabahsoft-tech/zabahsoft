
import React, { useEffect, useState } from 'react';
import { User, Order, Contribution, Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const chartData = [
  { name: 'Jun', spend: 400 },
  { name: 'Jul', spend: 300 },
  { name: 'Aug', spend: 900 },
  { name: 'Sep', spend: 500 },
  { name: 'Oct', spend: 1200 },
  { name: 'Nov', spend: 850 },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t, dir, language, setLanguage, siteSettings } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'billing' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const orderData = await api.getOrders();
        setOrders(orderData);
        const savedTheme = localStorage.getItem('zabah_theme') as 'light' | 'dark';
        if (savedTheme) setCurrentTheme(savedTheme);
      } catch (err) {
        console.error("Dashboard init error", err);
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
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (order: Order) => {
    const message = `Salam ZabahSoft Support. I need help with ${order.service_name} (ID: ${order.id}).`;
    const num = siteSettings?.whatsapp || '93799000000';
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const totalInvestment = orders.reduce((acc, curr) => {
    const val = parseFloat(curr.amount_paid.replace(/[^0-9.]/g, '')) || 0;
    return acc + (curr.amount_paid.includes('$') ? val : val / 70); 
  }, 0);

  const StatCard = ({ label, value, icon, color, subtext }: any) => (
    <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${color} text-white group-hover:scale-110 transition-transform`}>
          <i className={`fas ${icon}`}></i>
        </div>
        {subtext && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{subtext}</span>}
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* Header Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <p className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Workspace Management</p>
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
              {t.welcomeBack}, {user.name.split(' ')[0]}
           </h1>
        </div>
        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 shadow-inner">
           {(['overview', 'deployments', 'billing', 'settings'] as const).map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
             >
                {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
           {/* Primary Stats */}
           <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard label="Total Investment" value={`$${totalInvestment.toFixed(0)}`} icon="fa-wallet" color="bg-blue-600" subtext="USD EQUIV" />
                <StatCard label="Active Deployments" value={orders.length} icon="fa-server" color="bg-purple-600" subtext="Live Now" />
                <StatCard label="System Health" value="100%" icon="fa-shield-heart" color="bg-green-600" subtext="Optimal" />
              </div>

              {/* Chart Section */}
              <div className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                       <h3 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">Spending Trend</h3>
                       <p className="text-xs text-gray-400 font-medium">Visualizing your monthly technology investment</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-600/10 px-3 py-1.5 rounded-full">
                       <i className="fas fa-arrow-trend-up"></i> +14% vs LAST QTR
                    </div>
                 </div>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData}>
                          <defs>
                             <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" opacity={0.1} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                          <YAxis hide />
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '12px' }}
                             itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* Sidebar Actions */}
           <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[32px] text-white shadow-brand relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                 <h4 className="text-xl font-black mb-4 tracking-tighter">Expand Your Infrastructure</h4>
                 <p className="text-blue-100 text-xs mb-8 leading-relaxed font-medium">Ready for high-speed cloud hosting or a new .af domain registration?</p>
                 <Link to="/services" className="inline-block w-full text-center bg-white text-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    Browse Marketplace
                 </Link>
              </div>

              <div className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
                 <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Quick Tools</h4>
                 <div className="space-y-3">
                    {[
                       { label: 'Register .AF Domain', icon: 'fa-globe', link: '/domains' },
                       { label: 'Cloud Hosting', icon: 'fa-cloud', link: '/solutions/hosting' },
                       { label: 'Official Emails', icon: 'fa-envelope-open', link: '/solutions/official' }
                    ].map((tool, i) => (
                       <Link key={i} to={tool.link} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-blue-500/30 hover:bg-white dark:hover:bg-white/10 transition-all group">
                          <div className="flex items-center gap-4">
                             <i className={`fas ${tool.icon} text-gray-400 group-hover:text-blue-600`}></i>
                             <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{tool.label}</span>
                          </div>
                          <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
                       </Link>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'deployments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
           {orders.length === 0 ? (
              <div className="col-span-full py-32 text-center">
                 <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-server text-gray-400 text-2xl"></i>
                 </div>
                 <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No Active Deployments</h3>
                 <p className="text-gray-500 mb-10">Start your first project with ZabahSoft today.</p>
                 <Link to="/services" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Get Started</Link>
              </div>
           ) : orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm hover:border-blue-500/50 transition-all group flex flex-col justify-between h-[340px]">
                 <div>
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-14 h-14 bg-gray-50 dark:bg-gh-bg border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-center text-blue-600 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <i className="fas fa-cube"></i>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              order.status === 'completed' 
                              ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                          }`}>
                             {order.status}
                          </span>
                       </div>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors leading-tight">{order.service_name}</h4>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                       <i className="far fa-calendar-check text-blue-600"></i> Deployed: {order.date}
                    </p>
                 </div>

                 <div className="pt-8 border-t border-gray-50 dark:border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gh-bg rounded-xl border border-gray-100 dark:border-white/5 font-mono text-[10px] text-gray-500 flex-1">
                          <span className="truncate">{order.license_key || 'GENERATING...'}</span>
                          <button onClick={() => handleCopy(order.license_key || '')} className="hover:text-blue-600 transition-colors">
                             <i className={`fas ${copiedId === order.license_key ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                          </button>
                       </div>
                       <button onClick={() => openWhatsApp(order)} className="ml-2 w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-xl hover:scale-105 transition-all shadow-lg">
                          <i className="fab fa-whatsapp"></i>
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
