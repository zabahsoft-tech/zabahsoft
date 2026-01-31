
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import ChatWidget from './ChatWidget';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const ZabahLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" fill="url(#logoGradient)" />
    <path opacity="0.3" d="M50 5L90 25L50 45L10 25L50 5Z" fill="white" />
    <path opacity="0.2" d="M10 25L50 45V95L10 75V25Z" fill="black" />
    <path d="M35 35H65L45 55H65V65H35L55 45H35V35Z" fill="white" />
    <defs>
      <linearGradient id="logoGradient" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0969da" />
        <stop offset="1" stopColor="#388bfd" />
      </linearGradient>
    </defs>
  </svg>
);

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [delayedPos, setDelayedPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (!canHover) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') !== null || 
        target.closest('a') !== null ||
        target.getAttribute('role') === 'button'
      );
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const animate = () => {
      setDelayedPos(prev => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15
      }));
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block">
      <div 
        className={`fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-[9999] transition-all duration-300 ease-out flex items-center justify-center ${
          isHovering ? 'scale-[2.5] border-cyan-400 bg-cyan-400/10 backdrop-blur-[1px]' : 'scale-100 border-blue-500/50'
        }`}
        style={{ transform: `translate3d(${delayedPos.x - 16}px, ${delayedPos.y - 16}px, 0)` }}
      />
      <div 
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] transition-colors duration-300 ${
          isHovering ? 'bg-white' : 'bg-blue-600'
        }`}
        style={{ transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)` }}
      />
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const initTheme = async () => {
      const savedTheme = localStorage.getItem('zabah_theme') as 'light' | 'dark';
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const autoTheme = new Date().getHours() >= 6 && new Date().getHours() < 18 ? 'light' : 'dark';
        setTheme(autoTheme);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN');
  const navHeightClass = "h-[72px] lg:h-[88px]";
  
  const navBgClass = (scrolled || isMobileMenuOpen)
    ? "bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-white/10 shadow-xl"
    : "bg-white/80 dark:bg-gh-bg/80 backdrop-blur-md border-b border-transparent";

  const navLinks = [
    { name: t.home, path: '/' },
    { name: 'Domains', path: '/domains' },
    { name: t.services, path: '/services' },
    { name: t.blog, path: '/blog' },
    { name: t.helpCenter, path: '/help' },
    { name: t.contactNav, path: '/contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-500 font-sans selection:bg-blue-600 selection:text-white" dir={dir}>
      
      <CustomCursor />

      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${navBgClass}`}>
        <div className={`max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between ${navHeightClass}`}>
          
          <Link to="/" className="flex items-center gap-3 z-[110] relative group">
            <div className="transition-transform duration-300 group-hover:scale-110">
               <ZabahLogo className="w-10 h-10 lg:w-11 lg:h-11 shadow-lg" />
            </div>
            <div className="flex flex-col -gap-1 hidden min-[360px]:flex">
              <span className="font-black text-lg lg:text-xl tracking-tighter uppercase leading-none">
                {t.brandName}
              </span>
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] opacity-80">Technology</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
             {navLinks.map((link) => (
               <Link 
                 key={link.path} 
                 to={link.path} 
                 className={`text-[12px] font-black uppercase tracking-[0.2em] transition-all relative group py-2 ${
                   location.pathname === link.path 
                   ? 'text-blue-600 dark:text-blue-400' 
                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                 }`}
               >
                 {link.name}
                 <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
               </Link>
             ))}
             {isAdmin && (
               <Link to="/admin" className="px-3 py-1 rounded bg-orange-500/10 text-orange-500 font-black text-[9px] uppercase tracking-widest border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all ml-2">
                 Admin
               </Link>
             )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 z-[110] relative">
             <div className="hidden md:flex bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10">
                {(['en', 'fa', 'ps'] as const).map(l => (
                  <button 
                    key={l} 
                    onClick={() => setLanguage(l)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${language === l ? 'bg-white dark:bg-blue-600 shadow-md text-blue-600 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
             </div>

             <button 
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
               className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all active:scale-90"
               aria-label="Toggle Theme"
             >
               <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-blue-600'} text-sm`}></i>
             </button>

             {!user ? (
               <Link to="/login" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 transition-all">
                 {t.login}
               </Link>
             ) : (
               <Link to="/dashboard" className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Portal</span>
               </Link>
             )}

             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black active:scale-90 transition-all shadow-xl"
               aria-label="Menu"
             >
                <span className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                <span className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
             </button>
          </div>
        </div>

        <div className={`lg:hidden fixed inset-0 z-[105] bg-white dark:bg-[#0d1117] transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`} style={{ height: '100dvh' }}>
           <div className="flex flex-col h-full px-6 py-24 sm:px-12 overflow-y-auto">
              <div className="flex justify-between items-center mb-12">
                 <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10">
                    {(['en', 'fa', 'ps'] as const).map(l => (
                      <button 
                        key={l} 
                        onClick={() => setLanguage(l)}
                        className={`px-5 py-3 rounded-xl text-xs font-black transition-all ${language === l ? 'bg-white dark:bg-blue-600 shadow-xl text-blue-600 dark:text-white' : 'text-gray-400'}`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="flex flex-col gap-6 sm:gap-8">
                 {navLinks.map((item, i) => (
                   <Link 
                     key={item.path} 
                     to={item.path} 
                     className="text-4xl sm:text-6xl font-black tracking-tighter text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                   >
                     {item.name}
                   </Link>
                 ))}
              </div>
              <div className="mt-auto pt-12 pb-8">
                 {!user ? (
                   <Link to="/login" className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-center block shadow-2xl active:scale-95 transition-all text-xl uppercase tracking-widest">
                     {t.login}
                   </Link>
                 ) : (
                   <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-6 rounded-[32px] border border-gray-200 dark:border-white/10">
                      <Link to="/dashboard" className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">{user.name.charAt(0)}</div>
                         <div>
                            <p className="font-black text-xl text-gray-900 dark:text-white leading-tight">{user.name.split(' ')[0]}</p>
                            <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest mt-1">Authorized User</p>
                         </div>
                      </Link>
                      <button onClick={onLogout} className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center active:scale-90 transition-all">
                        <i className="fas fa-power-off text-xl"></i>
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </header>

      <main className="flex-grow w-full pt-[72px] lg:pt-[88px]">
        {children}
      </main>

      <footer className="bg-white dark:bg-[#0d1117] border-t border-gray-200 dark:border-white/5 pt-24 pb-12 transition-colors duration-300">
         <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
               <div className="space-y-10">
                  <Link to="/" className="flex items-center gap-4 group">
                    <ZabahLogo className="w-12 h-12 shadow-xl transition-transform group-hover:rotate-6" />
                    <span className="font-black text-3xl tracking-tighter uppercase">{t.brandName}</span>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed max-w-sm font-medium">
                    {t.footerMission}
                  </p>
                  <div className="flex gap-4">
                     {[
                       { icon: 'fab fa-linkedin-in', color: 'hover:text-blue-600', link: '#' },
                       { icon: 'fab fa-twitter', color: 'hover:text-blue-400', link: '#' },
                       { icon: 'fab fa-github', color: 'hover:text-gray-900 dark:hover:text-white', link: '#' }
                     ].map((social, i) => (
                       <a key={i} href={social.link} className={`w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 transition-all hover:bg-white dark:hover:bg-blue-600/10 active:scale-90 shadow-sm ${social.color}`}>
                          <i className={`${social.icon} text-lg`}></i>
                       </a>
                     ))}
                  </div>
               </div>

               <div>
                  <h4 className="font-black text-gray-900 dark:text-white mb-10 uppercase tracking-[0.2em] text-[11px] opacity-50">{t.footerSolutions}</h4>
                  <ul className="space-y-5 text-[13px] text-gray-500 dark:text-gray-400 font-bold">
                     <li><Link to="/solutions/web" className="hover:text-blue-600 transition-all">{t.navWeb}</Link></li>
                     <li><Link to="/domains" className="hover:text-blue-600 transition-all">Domain Search</Link></li>
                     <li><Link to="/solutions/hosting" className="hover:text-blue-600 transition-all">{t.navHosting}</Link></li>
                     <li><Link to="/help" className="hover:text-blue-600 transition-all">{t.helpCenter}</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-black text-gray-900 dark:text-white mb-10 uppercase tracking-[0.2em] text-[11px] opacity-50">{t.footerCompany}</h4>
                  <ul className="space-y-5 text-[13px] text-gray-500 dark:text-gray-400 font-bold">
                     <li><Link to="/blog" className="hover:text-blue-600 transition-all">{t.blog}</Link></li>
                     <li><Link to="/dashboard" className="hover:text-blue-600 transition-all">{t.dashboard}</Link></li>
                     <li><Link to="/contact" className="hover:text-blue-600 transition-all">{t.contactNav}</Link></li>
                     <li><Link to="/privacy" className="hover:text-blue-600 transition-all">{t.ftPrivacy}</Link></li>
                  </ul>
               </div>

               <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-10 rounded-[40px] shadow-sm">
                  <h4 className="font-black text-gray-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[11px] opacity-50">Operations</h4>
                  <ul className="space-y-6 text-sm text-gray-600 dark:text-gray-300 font-bold">
                     <li className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><i className="fab fa-whatsapp"></i></div>
                        <a href="https://wa.me/93799000000" target="_blank" className="hover:text-green-600 transition-colors font-mono tracking-tighter">+93 799 000 000</a>
                     </li>
                     <li className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20"><i className="fas fa-envelope"></i></div>
                        <a href="mailto:info@zabahsoft.com" className="hover:text-blue-600 transition-colors">info@zabahsoft.com</a>
                     </li>
                     <li className="flex items-center gap-3 pt-8 border-t border-gray-200 dark:border-white/5 mt-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <span className="text-[10px] uppercase font-black opacity-50 tracking-widest">SLA Active: 100% Uptime</span>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="pt-12 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
               <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">
                  © {new Date().getFullYear()} <span className="text-gray-900 dark:text-white">{t.brandName}</span> TECHNOLOGY GROUP • AFGHANISTAN
               </div>
               <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                  <Link to="/terms" className="hover:text-blue-600 transition-all">{t.ftTerms}</Link>
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                     <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon'}`}></i>
                     {theme.toUpperCase()} ENGINE
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
