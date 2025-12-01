
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

const langLabels = {
  en: { label: 'EN', full: 'English' },
  fa: { label: 'FA', full: 'فارسی' },
  ps: { label: 'PS', full: 'پښتو' }
};

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('zabah_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark'); 
    }
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // Define pages that handle their own layout (full width, custom padding)
  const isImmersivePage = 
    location.pathname === '/' || 
    location.pathname.startsWith('/solutions') || 
    location.pathname.startsWith('/blog') || 
    location.pathname === '/contact' ||
    location.pathname === '/login' ||
    location.pathname === '/register';
  
  // Styles
  const navBg = scrolled || isMobileMenuOpen
    ? "bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 py-3" 
    : "bg-transparent py-5";
  
  const navTextColor = "text-gray-900 dark:text-white"; 

  const getLinkClass = (path: string) => {
      const base = "transition-all duration-300 relative group ";
      const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path)) 
        ? "font-bold text-blue-600 dark:text-blue-400" 
        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white";
      
      return `${base} ${active}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${navBg}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center gap-2 md:gap-8">
               <Link to="/" className="flex-shrink-0 flex items-center gap-3 group relative z-50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                   <i className="fas fa-cube text-xl"></i> 
                </div>
                <span className={`font-bold text-2xl tracking-tight ${navTextColor}`}>{t.brandName}</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium mx-4">
                 <Link to="/" className={getLinkClass('/')}>
                    {t.home}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                 </Link>
                 
                 {/* Solutions Dropdown */}
                 <div className="relative group" onMouseEnter={() => setIsSolutionsOpen(true)} onMouseLeave={() => setIsSolutionsOpen(false)}>
                    <button className={`flex items-center gap-1 ${getLinkClass('/solutions')} focus:outline-none`}>
                       {t.navSolutions} <i className="fas fa-chevron-down text-xs mt-0.5 transition-transform group-hover:rotate-180"></i>
                    </button>
                    
                    <div className={`absolute top-full ${dir === 'rtl' ? 'right-0' : 'left-0'} pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2`}>
                       <div className="bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 w-64">
                          <Link to="/solutions/web" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                             <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <i className="fas fa-code"></i>
                             </div>
                             <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-white">{t.navWeb}</div>
                                <div className="text-[10px] text-gray-500">Websites & Apps</div>
                             </div>
                          </Link>
                          <Link to="/solutions/hosting" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                             <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <i className="fas fa-server"></i>
                             </div>
                             <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-white">{t.navHosting}</div>
                                <div className="text-[10px] text-gray-500">Cloud & VPS</div>
                             </div>
                          </Link>
                          <Link to="/solutions/official" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                             <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                <i className="fas fa-envelope"></i>
                             </div>
                             <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-white">{t.navEmails}</div>
                                <div className="text-[10px] text-gray-500">Professional Identity</div>
                             </div>
                          </Link>
                       </div>
                    </div>
                 </div>

                 <Link to="/blog" className={getLinkClass('/blog')}>
                    {t.blog}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                 </Link>
                 <Link to="/contact" className={getLinkClass('/contact')}>
                    {t.contactNav}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                 </Link>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-4">
               {/* Search Bar (Desktop) */}
               <div className="hidden xl:flex items-center relative group">
                  <div className={`flex items-center bg-gray-100 dark:bg-gray-800/50 border border-transparent group-focus-within:border-blue-500 group-focus-within:bg-white dark:group-focus-within:bg-black rounded-full px-3 py-1.5 transition-all w-48`}>
                     <i className="fas fa-search text-gray-400 text-xs mx-1"></i>
                     <input 
                       type="text" 
                       placeholder={t.search} 
                       className={`bg-transparent border-none text-sm w-full focus:ring-0 placeholder-gray-500 text-gray-900 dark:text-white outline-none h-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                     />
                  </div>
               </div>

               {/* Theme Toggle (Desktop) */}
               <button 
                onClick={toggleTheme}
                className={`hidden lg:flex w-9 h-9 rounded-full items-center justify-center transition-all border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:scale-110 ${navTextColor}`}
                title={theme === 'dark' ? t.light : t.dark}
               >
                 <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-blue-600'} text-sm`}></i>
               </button>

               {/* Language Switcher (Desktop) */}
               <div className="relative hidden lg:block">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-bold ${navTextColor}`}
                  >
                    <span className="uppercase">{langLabels[language].label}</span>
                    <i className={`fas fa-chevron-down text-[10px] transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {isLangMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsLangMenuOpen(false)}></div>
                      <div className={`absolute top-full mt-2 ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 w-40 z-40 animate-fade-in-up overflow-hidden`}>
                         <button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className={`flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${language === 'en' ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200'}`}>
                            <span>English</span>
                            {language === 'en' && <i className="fas fa-check text-xs"></i>}
                         </button>
                         <button onClick={() => { setLanguage('fa'); setIsLangMenuOpen(false); }} className={`flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-rtl ${language === 'fa' ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200'}`}>
                            <span>فارسی</span>
                            {language === 'fa' && <i className="fas fa-check text-xs"></i>}
                         </button>
                         <button onClick={() => { setLanguage('ps'); setIsLangMenuOpen(false); }} className={`flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-rtl ${language === 'ps' ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200'}`}>
                            <span>پښتو</span>
                            {language === 'ps' && <i className="fas fa-check text-xs"></i>}
                         </button>
                      </div>
                    </>
                  )}
               </div>

               {/* Auth Buttons (Desktop) */}
               {!user ? (
                 <Link to="/login" className="hidden lg:inline-block px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-transform hover:scale-105 shadow-md">
                   {t.login}
                 </Link>
               ) : (
                 <div className="hidden lg:flex items-center gap-3">
                   <Link to="/dashboard" className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-sm text-white font-bold border-2 border-white/20 shadow-md hover:scale-105 transition-transform">
                      {user.name.charAt(0)}
                   </Link>
                   <button onClick={onLogout} className="text-gray-500 hover:text-red-500 transition-colors" title={t.logout}>
                     <i className="fas fa-sign-out-alt"></i>
                   </button>
                 </div>
               )}

               {/* Mobile Menu Button */}
               <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${navTextColor}`}
                aria-label="Toggle Menu"
               >
                 <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}></i>
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer - GitHub style slide-down */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-visibility duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible delay-300'}`}>
          {/* Backdrop */}
          <div 
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Menu Content */}
          <div 
            className={`absolute top-0 left-0 w-full bg-white dark:bg-[#161b22] dark:text-gray-200 shadow-2xl transform transition-transform duration-300 ease-out border-b border-gray-200 dark:border-gray-800 flex flex-col ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
            style={{ maxHeight: '85vh' }}
          >
              {/* Spacer for Navbar */}
              <div className="h-16 shrink-0"></div>

              <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
                  
                  {/* Search Mobile */}
                  <div className="mb-6">
                     <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                        <i className="fas fa-search text-gray-400 mr-3"></i>
                        <input 
                          type="text" 
                          placeholder={t.search} 
                          className={`bg-transparent border-none text-base w-full focus:ring-0 placeholder-gray-500 text-gray-900 dark:text-white outline-none ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        />
                     </div>
                  </div>

                  {/* Links */}
                  <nav className="space-y-1">
                      <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center py-3 px-2 text-lg font-semibold border-b border-gray-100 dark:border-gray-800 hover:text-blue-600 transition-colors">
                          {t.home}
                      </Link>
                      
                      {/* Products Group */}
                      <div className="py-4 border-b border-gray-100 dark:border-gray-800">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">{t.navSolutions}</div>
                          <Link to="/solutions/web" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                  <i className="fas fa-code text-sm"></i>
                              </div>
                              <span className="font-medium">{t.navWeb}</span>
                          </Link>
                          <Link to="/solutions/hosting" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group">
                              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                  <i className="fas fa-server text-sm"></i>
                              </div>
                              <span className="font-medium">{t.navHosting}</span>
                          </Link>
                          <Link to="/solutions/official" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group">
                              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                  <i className="fas fa-envelope text-sm"></i>
                              </div>
                              <span className="font-medium">{t.navEmails}</span>
                          </Link>
                      </div>

                      <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center py-3 px-2 text-lg font-semibold border-b border-gray-100 dark:border-gray-800 hover:text-blue-600 transition-colors">
                          {t.blog}
                      </Link>
                      <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center py-3 px-2 text-lg font-semibold border-b border-gray-100 dark:border-gray-800 hover:text-blue-600 transition-colors">
                          {t.contactNav}
                      </Link>
                      {user && (
                          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center py-3 px-2 text-lg font-semibold border-b border-gray-100 dark:border-gray-800 text-blue-600 dark:text-blue-400">
                              {t.dashboard}
                          </Link>
                      )}
                  </nav>

                  {/* Bottom Controls */}
                  <div className="mt-8">
                      <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                          <div className="flex gap-2">
                              {['en', 'fa', 'ps'].map((lang) => (
                                  <button 
                                      key={lang}
                                      onClick={() => setLanguage(lang as any)}
                                      className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${language === lang ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                  >
                                      {langLabels[lang as keyof typeof langLabels].label}
                                  </button>
                              ))}
                          </div>
                          <button 
                              onClick={toggleTheme}
                              className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm"
                          >
                              <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-blue-600'}`}></i>
                          </button>
                      </div>

                      {!user ? (
                          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black text-center font-bold rounded-xl text-lg shadow-lg">
                              {t.login}
                          </Link>
                      ) : (
                          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="" className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700" />
                              <div className="flex-1">
                                  <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                              </div>
                              <button onClick={onLogout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors">
                                  <i className="fas fa-sign-out-alt"></i>
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Main Content */}
      <main className={`flex-grow w-full ${isImmersivePage ? '' : 'pt-24 max-w-[1400px] mx-auto p-4 md:p-6'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className={`border-t border-gray-200 dark:border-gray-800 ${isImmersivePage ? 'bg-white dark:bg-[#0d1117]' : 'mt-12'} py-16 text-gray-500 dark:text-gray-400`}>
         <div className="max-w-[1400px] mx-auto px-6 lg:px-8 text-sm">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
              <div>
                  <h4 className="font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider text-xs">{t.ftProduct}</h4>
                  <ul className="space-y-4">
                      <li><Link to="/solutions/web" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.navWeb}</Link></li>
                      <li><Link to="/solutions/hosting" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.navHosting}</Link></li>
                      <li><Link to="/solutions/official" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.navEmails}</Link></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider text-xs">{t.ftPlatform}</h4>
                  <ul className="space-y-4">
                      <li className="hover:text-blue-600 cursor-pointer">{t.ftAPI}</li>
                      <li className="hover:text-blue-600 cursor-pointer">{t.ftPartners}</li>
                      <li className="hover:text-blue-600 cursor-pointer">Status</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider text-xs">{t.ftSupport}</h4>
                  <ul className="space-y-4">
                      <li className="hover:text-blue-600 cursor-pointer">{t.ftDocs}</li>
                      <li className="hover:text-blue-600 cursor-pointer">{t.ftCommunity}</li>
                      <li className="hover:text-blue-600 cursor-pointer">{t.contactNav}</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider text-xs">{t.ftCompany}</h4>
                  <ul className="space-y-4">
                      <li className="hover:text-blue-600 cursor-pointer">{t.ftAbout}</li>
                      <li className="hover:text-blue-600 cursor-pointer">{t.blog}</li>
                      <li className="hover:text-blue-600 cursor-pointer">{t.ftCareers}</li>
                  </ul>
              </div>
           </div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black">
                    <i className="fas fa-cube text-sm"></i>
                 </div>
                 <span className="font-medium">© {new Date().getFullYear()} {t.brandName}, Inc.</span>
              </div>
              <div className="flex gap-8 text-xs font-medium">
                 <span className="hover:text-blue-600 cursor-pointer transition-colors">{t.ftTerms}</span>
                 <span className="hover:text-blue-600 cursor-pointer transition-colors">{t.ftPrivacy}</span>
                 <span className="hover:text-blue-600 cursor-pointer transition-colors">{t.ftSitemap}</span>
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
