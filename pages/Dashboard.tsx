
import React, { useEffect, useState } from 'react';
import { User, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

interface DashboardProps {
  user: User;
}

const data = [
  { name: 'Jan', spent: 0 },
  { name: 'Feb', spent: 0 },
  { name: 'Mar', spent: 0 },
  { name: 'Apr', spent: 0 },
  { name: 'May', spent: 0 },
  { name: 'Jun', spent: 0 },
  { name: 'Jul', spent: 0 },
  { name: 'Aug', spent: 0 },
  { name: 'Sep', spent: 0 },
  { name: 'Oct', spent: 350 },
  { name: 'Nov', spent: 200 },
  { name: 'Dec', spent: 0 },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t, dir } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await api.getOrders();
        setOrders(result);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar (Profile style) */}
      <div className="w-full md:w-1/4">
         <div className="flex flex-col gap-4">
             <div className="w-full aspect-square bg-gray-200 rounded-full overflow-hidden border border-gh-border relative group">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-gh-text">{user.name}</h2>
                <p className="text-gh-muted text-lg font-light">{user.email}</p>
             </div>
             <button className="w-full bg-gh-gray hover:bg-[#eef1f4] text-gh-text border border-gh-border font-medium py-1.5 rounded-md text-sm transition-colors">
                Edit profile
             </button>
             
             <div className="text-sm text-gh-muted space-y-2 mt-2">
                <div className="flex items-center gap-2">
                   <i className="fas fa-phone-alt w-4"></i> {user.phone}
                </div>
                <div className="flex items-center gap-2">
                   <i className="fas fa-map-marker-alt w-4"></i> Kabul, Afghanistan
                </div>
             </div>
         </div>
      </div>

      {/* Main Content (Tabs style) */}
      <div className="w-full md:w-3/4">
        {/* Fake Tabs */}
        <div className="border-b border-gh-border flex gap-6 mb-6 overflow-x-auto">
           <button className="flex items-center gap-2 py-3 border-b-2 border-[#fd8c73] font-semibold text-gh-text text-sm">
              <i className="fas fa-book-open"></i> {t.activeServices} <span className="bg-gh-gray text-gh-text rounded-full px-2 py-0.5 text-xs border border-gh-border">2</span>
           </button>
           <button className="flex items-center gap-2 py-3 border-b-2 border-transparent hover:border-gh-border text-gh-text text-sm">
              <i className="fas fa-box"></i> {t.recentOrders} <span className="bg-gh-gray text-gh-text rounded-full px-2 py-0.5 text-xs border border-gh-border">{orders.length}</span>
           </button>
           <button className="flex items-center gap-2 py-3 border-b-2 border-transparent hover:border-gh-border text-gh-text text-sm">
              <i className="fas fa-chart-bar"></i> {t.spendingOverview}
           </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
           <div className="border border-gh-border rounded-md p-4 bg-white animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <h4 className="text-xs text-gh-muted font-medium mb-1">{t.totalSpent} (YTD)</h4>
              <p className="text-2xl font-bold text-gh-text">$550.00</p>
           </div>
           <div className="border border-gh-border rounded-md p-4 bg-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h4 className="text-xs text-gh-muted font-medium mb-1">{t.openTickets}</h4>
              <p className="text-2xl font-bold text-gh-text">0</p>
           </div>
        </div>

        {/* Orders Table */}
        <div className="border border-gh-border rounded-md bg-white overflow-hidden mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="bg-gh-gray px-4 py-3 border-b border-gh-border flex justify-between items-center">
             <h3 className="font-semibold text-sm text-gh-text">{t.recentOrders}</h3>
             <button className="text-xs text-gh-blue hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" dir={dir}>
              <thead className="bg-white text-gh-muted border-b border-gh-border">
                <tr>
                  <th className={`px-4 py-3 font-semibold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.orderId}</th>
                  <th className={`px-4 py-3 font-semibold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>Service</th>
                  <th className={`px-4 py-3 font-semibold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>Date</th>
                  <th className={`px-4 py-3 font-semibold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>Amount</th>
                  <th className={`px-4 py-3 font-semibold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.status}</th>
                  <th className={`px-4 py-3 font-semibold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gh-border">
                {loading ? (
                    <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gh-muted">Loading orders...</td>
                    </tr>
                ) : (
                    orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gh-gray transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                        <td className="px-4 py-3 font-medium text-gh-text">{order.service_name}</td>
                        <td className="px-4 py-3 text-gh-muted">{order.date}</td>
                        <td className="px-4 py-3 text-gh-text">{order.amount_paid}</td>
                        <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            order.status === 'completed' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                            {order.status}
                        </span>
                        </td>
                        <td className="px-4 py-3">
                        {order.license_key ? (
                            <button onClick={() => alert(`License Key: ${order.license_key}`)} className="text-gh-blue hover:underline text-xs font-medium">
                            {t.viewKey}
                            </button>
                        ) : (
                            <span className="text-gh-muted">-</span>
                        )}
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contribution Chart */}
        <div className="border border-gh-border rounded-md bg-white p-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
           <h3 className="font-semibold text-sm text-gh-text mb-4">{t.spendingOverview}</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e4e8" />
                  <XAxis dataKey="name" tick={{fontSize: 10, fill: '#57606a'}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#57606a'}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{fill: '#f6f8fa'}}
                    contentStyle={{borderRadius: '6px', border: '1px solid #d0d7de', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="spent" fill="#40c463" radius={[2, 2, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
