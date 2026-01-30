
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import ChatWidget from './ChatWidget';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const { hasPermission } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const initTheme = async () => {
      const savedTheme = localStorage.getItem('zabah_theme') as 'light' | 'dark';
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Automatic theme based on time of day
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 18; // 6 AM to 6 PM
        const autoTheme = isDayTime ? 'light' : 'dark';
        
        try {
          const settings = await api.getSystemSettings();
          // Use system default if set, otherwise use time-based detection
          setTheme(settings.defaultTheme || autoTheme);
        } catch (e) {
          setTheme(autoTheme);
        }
      }
    };
    initTheme();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('zabah_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navBg = scrolled || isMobileMenuOpen
    ? "bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800 py-3" 
    : "bg-transparent py-5";

  const getLinkClass = (path: string) => {
      const base = "transition-all duration-300 relative group ";
      const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path)) 
        ? "font-bold text-blue-600 dark:text-blue-400" 
        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white";
      return `${base} ${active}`;
  };

  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-300 font-sans" dir={dir}>
      <nav className={`fixed w-full z-[100] top-0 transition-all duration-300 ${navBg}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 z-50">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                 <i className="fas fa-cube text-lg"></i> 
              </div>
              <span className="font-bold text-xl md:text-2xl tracking-tight text-gray-900 dark:text-white">{t.brandName}</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium">
               <Link to="/" className={getLinkClass('/')}>{t.home}</Link>
               <Link to="/services" className={getLinkClass('/services')}>{t.services}</Link>
               <Link to="/blog" className={getLinkClass('/blog')}>{t.blog}</Link>
               <Link to="/contact" className={getLinkClass('/contact')}>{t.contactNav}</Link>
               {isAdmin && (
                 <Link to="/admin" className="text-orange-500 font-bold border-l border-gray-700 pl-6 ml-2">Admin</Link>
               )}
            </div>

            <div className="flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-1 mr-2 text-xs font-bold text-gray-500">
                  <button onClick={() => setLanguage('en')} className={language === 'en' ? 'text-blue-600' : ''}>EN</button>
                  <span>/</span>
                  <button onClick={() => setLanguage('fa')} className={language === 'fa' ? 'text-blue-600' : ''}>FA</button>
                  <span>/</span>
                  <button onClick={() => setLanguage('ps')} className={language === 'ps' ? 'text-blue-600' : ''}>PS</button>
               </div>

               <button onClick={toggleTheme} className="hidden lg:flex w-9 h-9 rounded-full items-center justify-center transition-all border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                 <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-blue-600'} text-sm`}></i>
               </button>

               {!user ? (
                 <Link to="/login" className="px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hidden lg:inline-block">
                   {t.login}
                 </Link>
               ) : (
                 <div className="hidden lg:flex items-center gap-3">
                   <Link to="/dashboard" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm text-white font-bold border-2 border-white/20">
                      {user.name.charAt(0)}
                   </Link>
                   <button onClick={onLogout} className="text-gray-500 hover:text-red-500"><i className="fas fa-sign-out-alt"></i></button>
                 </div>
               )}

               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-900 dark:text-white">
                 <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[64px] bg-white dark:bg-[#0d1117] z-40 p-6 flex flex-col gap-6 animate-fade-in overflow-y-auto">
             <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex gap-4">
                  <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>EN</button>
                  <button onClick={() => setLanguage('fa')} className={`px-3 py-1 rounded ${language === 'fa' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>FA</button>
                  <button onClick={() => setLanguage('ps')} className={`px-3 py-1 rounded ${language === 'ps' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>PS</button>
                </div>
                <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                   <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-blue-600'}`}></i>
                </button>
             </div>
             <Link to="/" className="text-xl font-bold">{t.home}</Link>
             <Link to="/services" className="text-xl font-bold">{t.services}</Link>
             <Link to="/blog" className="text-xl font-bold">{t.blog}</Link>
             <Link to="/contact" className="text-xl font-bold">{t.contactNav}</Link>
             {isAdmin && <Link to="/admin" className="text-xl font-bold text-orange-500">Admin Panel</Link>}
             <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                {!user ? (
                   <Link to="/login" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center block shadow-lg">{t.login}</Link>
                ) : (
                   <div className="flex items-center justify-between">
                      <Link to="/dashboard" className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>
                         <span className="font-bold">{user.name}</span>
                      </Link>
                      <button onClick={onLogout} className="text-red-500 font-bold">{t.logout}</button>
                   </div>
                )}
             </div>
          </div>
        )}
      </nav>

      <main className="flex-grow w-full pt-20">
        {children}
      </main>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="bg-white dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800 pt-20 pb-10 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
               {/* Brand & Mission */}
               <div className="space-y-6">
                  <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                        <i className="fas fa-cube"></i> 
                    </div>
                    <span className="font-bold text-2xl tracking-tight">{t.brandName}</span>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {t.footerMission}
                  </p>
                  <div className="flex gap-4">
                     <a href="#" className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:hover:text-white transition-all">
                        <i className="fab fa-linkedin-in text-sm"></i>
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-blue-400 dark:hover:text-white transition-all">
                        <i className="fab fa-twitter text-sm"></i>
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-all">
                        <i className="fab fa-github text-sm"></i>
                     </a>
                  </div>
               </div>

               {/* Solutions Column */}
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-xs">{t.footerSolutions}</h4>
                  <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                     <li><Link to="/solutions/web" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.navWeb}</Link></li>
                     <li><Link to="/solutions/official" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.navEmails}</Link></li>
                     <li><Link to="/solutions/hosting" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.navHosting}</Link></li>
                     <li><Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Catalog & Pricing</Link></li>
                  </ul>
               </div>

               {/* Company Column */}
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-xs">{t.footerCompany}</h4>
                  <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                     <li><Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.blog}</Link></li>
                     <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.dashboard}</Link></li>
                     <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.contactNav}</Link></li>
                     <li><Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Join Team</Link></li>
                  </ul>
               </div>

               {/* Support Column */}
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-xs">{t.footerSupport}</h4>
                  <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                     <li className="flex items-center gap-3">
                        <i className="fab fa-whatsapp text-green-500"></i>
                        <a href="https://wa.me/93799000000" target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+93 799 000 000</a>
                     </li>
                     <li className="flex items-center gap-3">
                        <i className="fas fa-envelope-open-text text-blue-500"></i>
                        <a href="mailto:info@zabahsoft.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">info@zabahsoft.com</a>
                     </li>
                     <li className="flex items-center gap-3">
                        <i className="fas fa-shield-alt text-purple-500"></i>
                        <span className="cursor-help border-b border-dotted border-gray-400">System Status: 100%</span>
                     </li>
                  </ul>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-xs text-gray-400 font-medium">
                  © {new Date().getFullYear()} <span className="text-gray-900 dark:text-white font-bold">{t.brandName}</span> • {t.allRights}
               </div>
               <div className="flex gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.ftPrivacy}</Link>
                  <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.ftTerms}</Link>
                  <button onClick={toggleTheme} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-white transition-colors">
                     <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-500' : 'fa-moon text-blue-600'}`}></i>
                     {theme.toUpperCase()}
                  </button>
               </div>
            </div>
         </div>
      </footer>
      <ChatWidget />
    </div>
  );
};

export default Layout;
