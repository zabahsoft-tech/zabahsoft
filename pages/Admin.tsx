
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Order, Service, BlogPost, Branch, Contribution, ServiceType, Testimonial, Language, BlogCategory } from '../types';
import { api, ContactRequest, SystemSettings, VoiceMail } from '../services/api';

const Admin: React.FC = () => {
  const { dir, t, language, refreshTranslations } = useLanguage();
  type AdminTab = 'overview' | 'users' | 'orders' | 'services' | 'blog' | 'testimonials' | 'branches' | 'requests' | 'voicemails' | 'contributions' | 'legal' | 'site_editor' | 'settings';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [data, setData] = useState<any>({ users: [], orders: [], requests: [], blog: [], branches: [], contributions: [], services: [], testimonials: [], voicemails: [], settings: null, overrides: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [u, o, r, p, b, c, s, tData, v, settings, config] = await Promise.all([
        api.getAllUsers(), api.getOrders(), api.getContactRequests(), api.getPosts(), api.getBranches(),
        api.getContributions(), api.getServices(), api.getTestimonials(), api.getVoiceMails(),
        api.getSystemSettings(), api.getSiteConfig()
      ]);
      setData({ users: u, orders: o, requests: r, blog: p, branches: b, contributions: c, services: s, testimonials: tData, voicemails: v, settings, overrides: config });
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [language]);

  const handleDelete = async (type: AdminTab, id: any) => {
    if (!confirm(`Delete item?`)) return;
    try {
      if (type === 'users') await api.deleteUser(id);
      else if (type === 'orders') await api.deleteOrder(id);
      else if (type === 'services') await api.deleteService(id);
      else if (type === 'blog') await api.deletePost(id);
      else if (type === 'branches') await api.deleteBranch(id);
      else if (type === 'testimonials') await api.deleteTestimonial(id);
      else if (type === 'requests') await api.deleteContactRequest(id);
      else if (type === 'voicemails') await api.deleteVoiceMail(id);
      else if (type === 'contributions') await api.deleteContribution(id);
      fetchAll();
    } catch (e) { alert("Fail"); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'services') await api.updateService(editItem);
      else if (activeTab === 'blog') await api.updatePost(editItem);
      else if (activeTab === 'testimonials') await api.saveTestimonial(editItem);
      else if (activeTab === 'branches') await api.saveBranch(editItem);
      setShowModal(false);
      fetchAll();
    } catch (e) { alert("Save failed"); }
    finally { setIsSaving(false); }
  };

  const openEdit = (item: any) => { setEditItem(item); setShowModal(true); };
  const openCreate = () => {
    const schemas: any = { services: { name: '', description: '', price_usd: 0, icon: 'fa-cube' }, blog: { title: '', excerpt: '', content: '', category: 'Tech' }, testimonials: { name: '', content: '', avatar: '' }, branches: { city: '', address: '' } };
    setEditItem(schemas[activeTab] || {});
    setShowModal(true);
  };

  const Stats = ({ title, val, icon, col }: any) => (
    <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${col}`}><i className={`fas ${icon}`}></i></div>
      <div><p className="text-[10px] font-black text-gray-400 uppercase">{title}</p><p className="text-xl font-black">{val}</p></div>
    </div>
  );

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i></div>;

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-6" dir={dir}>
      <div className="flex flex-col lg:flex-row justify-between mb-10 gap-6">
        <div><h1 className="text-3xl font-black">{t.adminTitle}</h1><p className="text-gray-500">{t.adminSub}</p></div>
        <div className="flex flex-wrap gap-2 p-1 bg-white dark:bg-[#161b22] border dark:border-white/10 rounded-2xl overflow-x-auto no-scrollbar">
          {([['overview', t.admOverview], ['users', t.admUsers], ['orders', t.admOrders], ['services', t.admServices], ['blog', t.admBlog], ['testimonials', t.admTestimonials], ['branches', t.admBranches], ['requests', t.admRequests], ['voicemails', t.admVoicemails], ['contributions', t.admContributions], ['legal', t.admLegal], ['site_editor', t.admSiteEditor], ['settings', t.admSettings]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Stats title="Users" val={data.users.length} icon="fa-users" col="bg-blue-600" />
            <Stats title="Orders" val={data.orders.length} icon="fa-shopping-cart" col="bg-purple-600" />
            <Stats title="Inbox" val={data.requests.length} icon="fa-envelope" col="bg-orange-500" />
            <Stats title="Services" val={data.services.length} icon="fa-box" col="bg-green-600" />
          </div>
        )}

        {['users', 'orders', 'services', 'blog', 'testimonials', 'branches', 'requests', 'voicemails', 'contributions'].includes(activeTab) && (
          <div className="bg-white dark:bg-[#161b22] border dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b dark:border-white/5 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase text-gray-400">{activeTab} RECORDS</h3>
              {['services', 'blog', 'testimonials', 'branches'].includes(activeTab) && (
                <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase"><i className="fas fa-plus mr-2"></i> New</button>
              )}
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 font-black uppercase">
                <tr><th className="px-8 py-4">Title / Name</th><th className="px-8 py-4">Status / Meta</th><th className="px-8 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5">
                {(data[activeTab === 'blog' ? 'blog' : activeTab] || []).map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-8 py-5">
                      <p className="font-black text-sm">{item.name || item.title || item.city || item.subject || `Voice from ${item.whatsapp}`}</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">{item.email || item.excerpt || item.address || item.id}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-[10px] font-black rounded uppercase">{item.status || item.role || item.category || 'Active'}</span>
                    </td>
                    <td className="px-8 py-5 text-right flex justify-end gap-3">
                      {['services', 'blog', 'testimonials', 'branches'].includes(activeTab) && <button onClick={() => openEdit(item)} className="text-blue-600"><i className="fas fa-edit"></i></button>}
                      <button onClick={() => handleDelete(activeTab, item.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && data.settings && (
          <div className="bg-white dark:bg-[#161b22] border dark:border-white/10 rounded-3xl p-10 max-w-4xl shadow-xl">
            <h3 className="font-black mb-8 uppercase text-blue-600">Site Settings</h3>
            <div className="grid grid-cols-2 gap-8 mb-10">
              {['whatsapp', 'phone', 'supportEmail', 'salesEmail'].map(f => (
                <div key={f}><label className="text-[10px] font-black text-gray-400 uppercase">{f}</label>
                <input value={(data.settings as any)[f]} onChange={e => setData({...data, settings: {...data.settings, [f]: e.target.value}})} className="w-full bg-gray-50 dark:bg-black/20 border dark:border-white/5 rounded-xl px-4 py-3 text-sm font-mono" /></div>
              ))}
            </div>
            <button onClick={async () => { await api.updateSystemSettings(data.settings); await refreshTranslations(); alert("Saved"); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-lg">Save Config</button>
          </div>
        )}

        {activeTab === 'site_editor' && (
          <div className="bg-white dark:bg-[#161b22] border dark:border-white/10 rounded-3xl p-10 shadow-xl">
            <h3 className="font-black mb-8 uppercase text-blue-600">Translation Overrides</h3>
            <div className="grid grid-cols-3 gap-8">
              {(['en', 'fa', 'ps'] as const).map(l => (
                <div key={l}><span className="font-black uppercase text-xs text-gray-400 mb-2 block">{l} JSON</span>
                <textarea rows={15} value={JSON.stringify(data.overrides[l] || {}, null, 2)} onChange={e => { try { const p = JSON.parse(e.target.value); setData({...data, overrides: {...data.overrides, [l]: p}}); } catch(err){} }} className="w-full bg-gray-50 dark:bg-black/20 border dark:border-white/5 rounded-2xl p-4 font-mono text-[10px]" /></div>
              ))}
            </div>
            <button onClick={async () => { await api.updateSiteConfig(data.overrides); await refreshTranslations(); alert("Site Updated"); }} className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-lg">Push Live</button>
          </div>
        )}
      </div>

      {showModal && editItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161b22] rounded-3xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto border dark:border-white/10">
            <div className="p-8 border-b dark:border-white/5 flex justify-between items-center"><h3 className="font-black uppercase tracking-tight">Manage {activeTab}</h3><button onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button></div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              {Object.keys(editItem).filter(k => k !== 'id' && typeof editItem[k] !== 'object').map(k => (
                <div key={k}><label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">{k}</label>
                <input value={editItem[k]} onChange={e => setEditItem({...editItem, [k]: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border dark:border-white/5 rounded-xl px-4 py-3 text-sm" /></div>
              ))}
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg">{isSaving ? 'Saving...' : 'Save Record'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
