
import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { User } from '../types';
import ChatWidget from './ChatWidget';
import { useLanguage } from '../contexts/LanguageContext';
import { ZabahLogo } from './ZabahLogo';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

const PublicLayout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, dir, siteSettings } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('zabah_theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('zabah_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t.home, path: '/' },
    { name: t.navDomains, path: '/domains' },
    { name: t.services, path: '/services' },
    { name: t.blog, path: '/blog' },
    { name: t.helpCenter, path: '/help' },
    { name: t.contactNav, path: '/contact' }
  ];

  const navBgClass = (scrolled || isMobileMenuOpen)
    ? "bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-white/10 shadow-xl"
    : "bg-white/80 dark:bg-gh-bg/80 backdrop-blur-md border-b border-transparent";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-500" dir={dir}>
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${navBgClass}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between h-[72px] lg:h-[88px]">
          <Link to="/" className="flex items-center gap-3 z-[110] relative group">
            <ZabahLogo className="w-10 h-10 lg:w-11 lg:h-11 shadow-lg" />
            <div className="flex flex-col hidden min-[360px]:flex">
              <span className="font-black text-lg lg:text-xl tracking-tighter uppercase leading-none">{t.brandName}</span>
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] opacity-80">{t.brandSubtitle}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
             {navLinks.map((link) => (
               <Link 
                 key={link.path} 
                 to={link.path} 
                 className={`text-[12px] font-black uppercase tracking-[0.2em] transition-all relative group py-2 ${location.pathname === link.path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
               >
                 {link.name}
                 <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
               </Link>
             ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 z-[110] relative">
             <div className="hidden md:flex bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10">
                {(['en', 'fa', 'ps'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${language === l ? 'bg-white dark:bg-blue-600 shadow-md text-blue-600 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>{l.toUpperCase()}</button>
                ))}
             </div>

             <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all">
               <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-blue-600'} text-sm`}></i>
             </button>

             {!user ? (
               <Link to="/login" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest hover:shadow-brand transition-all">
                 {t.login}
               </Link>
             ) : (
               <Link to="/dashboard" className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">{user.name.charAt(0)}</div>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Portal</span>
               </Link>
             )}

             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black active:scale-90 transition-all">
                <span className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                <span className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full pt-[72px] lg:pt-[88px] animate-fade-in">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-[#0d1117] border-t border-gray-200 dark:border-white/5 pt-24 pb-12">
         <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
               <div className="space-y-10">
                  <Link to="/" className="flex items-center gap-4 group">
                    <ZabahLogo className="w-12 h-12 shadow-xl transition-transform group-hover:rotate-6" />
                    <span className="font-black text-3xl tracking-tighter uppercase">{t.brandName}</span>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed max-w-sm font-medium">{t.footerMission}</p>
               </div>
               <div>
                  <h4 className="font-black text-gray-900 dark:text-white mb-10 uppercase tracking-[0.2em] text-[11px] opacity-50">{t.footerSolutions}</h4>
                  <ul className="space-y-5 text-[13px] text-gray-500 dark:text-gray-400 font-bold">
                     <li><Link to="/solutions/web" className="hover:text-blue-600 transition-all">{t.footerWebSolutions}</Link></li>
                     <li><Link to="/domains" className="hover:text-blue-600 transition-all">{t.footerDomainSearch}</Link></li>
                     <li><Link to="/help" className="hover:text-blue-600 transition-all">{t.helpCenter}</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-black text-gray-900 dark:text-white mb-10 uppercase tracking-[0.2em] text-[11px] opacity-50">{t.footerCompany}</h4>
                  <ul className="space-y-5 text-[13px] text-gray-500 dark:text-gray-400 font-bold">
                     <li><Link to="/blog" className="hover:text-blue-600 transition-all">{t.blog}</Link></li>
                     <li><Link to="/privacy" className="hover:text-blue-600 transition-all">{t.ftPrivacy}</Link></li>
                  </ul>
               </div>
               <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-10 rounded-[40px] shadow-sm">
                  <h4 className="font-black text-gray-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[11px] opacity-50">{t.footerOperations}</h4>
                  <ul className="space-y-6 text-sm text-gray-600 dark:text-gray-300 font-bold">
                     <li className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><i className="fab fa-whatsapp"></i></div>
                        <a href={`https://wa.me/${siteSettings?.whatsapp || '93799000000'}`} target="_blank" className="hover:text-green-600 transition-colors font-mono tracking-tighter" dir="ltr">
                           {siteSettings?.phone || '+93 799 000 000'}
                        </a>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="pt-12 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">© {new Date().getFullYear()} <span className="text-gray-900 dark:text-white">{t.brandName}</span> {t.footerTechGroup}</div>
               <div className="flex gap-10 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                  <Link to="/terms" className="hover:text-blue-600 transition-all">{t.ftTerms}</Link>
               </div>
            </div>
         </div>
      </footer>
      <ChatWidget />
    </div>
  );
};

export default PublicLayout;
