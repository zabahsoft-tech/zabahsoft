
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { User, UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ZabahLogo } from './ZabahLogo';

interface PortalLayoutProps {
  user: User | null;
  onLogout: () => void;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ user, onLogout }) => {
  const { t, dir, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) return null;

  const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
  
  const userLinks = [
    { name: t.dashboard, path: '/dashboard', icon: 'fa-th-large' },
    { name: t.activeServices, path: '/dashboard', icon: 'fa-server' },
    { name: t.helpCenter, path: '/help', icon: 'fa-question-circle' },
  ];

  const adminLinks = [
    { name: 'System Overview', path: '/admin', icon: 'fa-chart-line' },
    { name: 'User Management', path: '/admin', icon: 'fa-users' },
    { name: 'Deployments', path: '/admin', icon: 'fa-box' },
    { name: 'Support Queue', path: '/admin', icon: 'fa-headset' },
  ];

  const activeLinks = location.pathname.startsWith('/admin') ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex font-sans" dir={dir}>
      
      {/* Persistent Portal Sidebar */}
      <aside className={`fixed lg:static inset-y-0 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 lg:w-20 opacity-0 lg:opacity-100'} bg-white dark:bg-[#161b22] border-r border-gray-200 dark:border-white/5 flex flex-col shadow-2xl lg:shadow-none overflow-hidden`}>
         <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
               <ZabahLogo className="w-8 h-8 shrink-0" />
               <span className="font-black tracking-tighter uppercase whitespace-nowrap text-gray-900 dark:text-white">Portal</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400"><i className="fas fa-times"></i></button>
         </div>

         <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-hide">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/30 px-4 mb-4">Workspace</p>
               <nav className="space-y-1">
                  {activeLinks.map((link, i) => (
                    <Link 
                      key={i} 
                      to={link.path} 
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${location.pathname === link.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                       <i className={`fas ${link.icon} w-5 text-center text-lg`}></i>
                       <span className={!isSidebarOpen ? 'lg:hidden' : ''}>{link.name}</span>
                    </Link>
                  ))}
               </nav>
            </div>

            {isAdmin && !location.pathname.startsWith('/admin') && (
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-orange-500/50 px-4 mb-4">Control Plane</p>
                 <Link to="/admin" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-orange-500 bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-all">
                    <i className="fas fa-user-shield w-5 text-center text-lg"></i>
                    <span className={!isSidebarOpen ? 'lg:hidden' : ''}>Admin Console</span>
                 </Link>
              </div>
            )}
         </div>

         <div className="p-4 border-t border-gray-100 dark:border-white/5 space-y-4 shrink-0">
            <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 transition-all">
               <i className="fas fa-arrow-left w-5 text-center text-lg"></i>
               <span className={!isSidebarOpen ? 'lg:hidden' : ''}>Back to Website</span>
            </Link>
            <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all">
               <i className="fas fa-power-off w-5 text-center text-lg"></i>
               <span className={!isSidebarOpen ? 'lg:hidden' : ''}>Sign Out</span>
            </button>
         </div>
      </aside>

      {/* Workspace Main Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
         <header className="h-20 shrink-0 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <i className={`fas ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} rotate-180`}></i>
               </button>
               <div className="hidden sm:flex items-center gap-2 text-sm font-bold">
                  <span className="text-gray-400">Portal</span>
                  <i className="fas fa-chevron-right text-[10px] text-gray-300"></i>
                  <span className="text-gray-900 dark:text-white capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden md:flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                  {(['en', 'fa', 'ps'] as const).map(l => (
                    <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${language === l ? 'bg-white dark:bg-blue-600 shadow-sm text-blue-600 dark:text-white' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                  ))}
               </div>
               <div className="w-px h-6 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
               <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-black text-gray-900 dark:text-white leading-none">{user.name}</p>
                     <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`} className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm" alt="Profile" />
               </div>
            </div>
         </header>

         <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 animate-fade-in custom-scrollbar">
            <Outlet />
         </main>
      </div>

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] animate-fade-in"></div>
      )}
    </div>
  );
};

export default PortalLayout;
