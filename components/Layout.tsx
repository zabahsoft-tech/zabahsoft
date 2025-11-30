import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import ChatWidget from './ChatWidget';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Check system preference or localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('zabah_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark'); // Default to dark for high-end feel
    }
  }, []);

  // Update HTML class when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('zabah_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Landing pages with transparent header
  // Note: We expect these pages to have dark heroes to support white text
  const isLanding = location.pathname === '/' || location.pathname === '/solutions/web';

  const isActive = (path: string) => location.pathname === path ? "font-semibold text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400";
  const isLandingActive = (path: string) => location.pathname === path ? "font-semibold text-white" : "text-gray-200 hover:text-white";

  // Dynamic classes for Light/Dark
  const bgClass = "bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-300";
  
  // Navbar Logic
  const isTransparent = isLanding && !scrolled;

  const navBg = isTransparent
    ? "bg-transparent border-transparent" 
    : "bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm";
  
  // If transparent, we assume dark background (Hero) -> White text
  // If not transparent (scrolled or other pages) -> Theme dependent text
  const navTextColor = isTransparent
    ? "text-white"
    : "text-gray-900 dark:text-white";

  const getLinkClass = (path: string) => isTransparent ? isLandingActive(path) : isActive(path);

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      {/* Navbar */}
      <nav className={`fixed w-full z-40 top-0 transition-all duration-300 ${navBg} py-4`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`sm:hidden ${navTextColor} hover:opacity-80 focus:outline-none`}
              >
                 <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <div className={`rounded-full p-0.5 group-hover:scale-105 transition-transform ${isTransparent ? 'bg-white text-black' : 'bg-black text-white dark:bg-white dark:text-black'}`}>
                   <i className="fab fa-github text-3xl"></i> 
                </div>
                <span className={`font-bold text-xl tracking-tight ${navTextColor}`}>ZabahSoft</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center gap-6 text-[15px] font-medium">
                 <Link to="/" className={`${getLinkClass('/')} transition-colors`}>{t.home}</Link>
                 <Link to="/services" className={`${getLinkClass('/services')} transition-colors`}>{t.services}</Link>
                 <Link to="/solutions/web" className={`${getLinkClass('/solutions/web')} transition-colors`}>Web Solutions</Link>
                 {user && <Link to="/dashboard" className={`${getLinkClass('/dashboard')} transition-colors`}>{t.dashboard}</Link>}
              </div>
            </div>

            <div className="flex items-center gap-3">
               {/* Search Bar */}
               <div className="hidden md:flex items-center relative group">
                  <div className={`flex items-center bg-transparent border border-gray-400/50 rounded-md px-2 py-1 transition-all group-focus-within:bg-white group-focus-within:border-white w-64`}>
                     <i className={`fas fa-search ${navTextColor} opacity-60 text-xs mx-1`}></i>
                     <input 
                       type="text" 
                       placeholder={t.search} 
                       className={`bg-transparent border-none ${navTextColor} text-sm w-full focus:ring-0 placeholder-gray-400 outline-none h-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                     />
                  </div>
               </div>

               {/* Theme Toggle */}
               <button 
                onClick={toggleTheme}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${navTextColor} hover:bg-white/10`}
                title={theme === 'dark' ? t.light : t.dark}
               >
                 <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
               </button>

               {/* Language Switcher */}
               <div className="relative group">
                  <button className={`${navTextColor} opacity-90 hover:opacity-100 text-sm font-medium border border-gray-400/50 rounded-md px-2 py-1 flex items-center gap-1 transition-colors`}>
                    {language.toUpperCase()} <i className="fas fa-caret-down text-xs"></i>
                  </button>
                  <div className={`absolute top-full mt-2 ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1 w-32 z-50 hidden group-hover:block`}>
                     <button onClick={() => setLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white">English</button>
                     <button onClick={() => setLanguage('fa')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white font-rtl">فارسی</button>
                     <button onClick={() => setLanguage('ps')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white font-rtl">پښتو</button>
                  </div>
               </div>

               {/* Auth Buttons */}
               {!user ? (
                 <Link to="/login" className={`hidden sm:inline-block text-[15px] font-medium ${navTextColor} opacity-90 hover:opacity-100 ml-2`}>
                   {t.login}
                 </Link>
               ) : (
                 <div className="flex items-center gap-3 ml-2">
                   <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs text-white font-bold border border-white/20 shadow-md">
                      {user.name.charAt(0)}
                   </div>
                   <button onClick={onLogout} className={`${navTextColor} hover:opacity-70`}>
                     <i className="fas fa-sign-out-alt"></i>
                   </button>
                 </div>
               )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-700 bg-[#0d1117] absolute left-0 w-full px-4 pb-4 shadow-xl rounded-b-xl z-50">
              <div className="space-y-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">{t.home}</Link>
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">{t.services}</Link>
                <Link to="/solutions/web" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">Web Solutions</Link>
                {user && <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">{t.dashboard}</Link>}
                <div className="border-t border-gray-700 my-2 pt-2">
                   <Link to="/login" className="block px-3 py-2 text-white">{t.login}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-grow w-full ${isLanding ? '' : 'pt-24 max-w-[1280px] mx-auto p-4 md:p-6'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className={`${isLanding ? 'bg-gray-100 dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800' : 'mt-12 border-t border-gray-200 dark:border-gray-800'} py-12 text-gray-500 dark:text-gray-400`}>
         <div className="max-w-[1280px] mx-auto px-4 text-xs md:text-sm">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                  <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Product</h4>
                  <ul className="space-y-2">
                      <li className="hover:text-blue-500 cursor-pointer">Features</li>
                      <li className="hover:text-blue-500 cursor-pointer">Security</li>
                      <li className="hover:text-blue-500 cursor-pointer">Team</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Platform</h4>
                  <ul className="space-y-2">
                      <li className="hover:text-blue-500 cursor-pointer">Developer API</li>
                      <li className="hover:text-blue-500 cursor-pointer">Partners</li>
                      <li className="hover:text-blue-500 cursor-pointer">Electron</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Support</h4>
                  <ul className="space-y-2">
                      <li className="hover:text-blue-500 cursor-pointer">Docs</li>
                      <li className="hover:text-blue-500 cursor-pointer">Community</li>
                      <li className="hover:text-blue-500 cursor-pointer">Professional Services</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Company</h4>
                  <ul className="space-y-2">
                      <li className="hover:text-blue-500 cursor-pointer">About</li>
                      <li className="hover:text-blue-500 cursor-pointer">Blog</li>
                      <li className="hover:text-blue-500 cursor-pointer">Careers</li>
                  </ul>
              </div>
           </div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                 <i className="fab fa-github text-xl"></i>
                 <span>© {new Date().getFullYear()} ZabahSoft, Inc.</span>
              </div>
              <div className="flex gap-6">
                 <span className="hover:text-blue-500 cursor-pointer">Terms</span>
                 <span className="hover:text-blue-500 cursor-pointer">Privacy</span>
                 <span className="hover:text-blue-500 cursor-pointer">Sitemap</span>
              </div>
           </div>
         </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Layout;