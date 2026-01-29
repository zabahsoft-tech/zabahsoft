
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { User } from '../types';

interface RegisterProps {
    onRegister: (user: User, token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const { t, dir, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '', // Added WhatsApp
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsMismatch);
      return;
    }
    if (formData.whatsapp.length < 9) {
      setError(t.whatsappRequired);
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
        const { user, token } = await api.register({
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            password: formData.password
        });
        onRegister(user, token);
        navigate('/dashboard');
    } catch (err) {
        setError(t.registrationFailed);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/5 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 border border-gray-900 dark:border-white rounded-full animate-[spin_120s_linear_infinite]"></div>
          <div className="absolute inset-32 border border-gray-900 dark:border-white rounded-full animate-[spin_90s_linear_infinite_reverse]"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Language Switcher */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setLanguage('en')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>EN</button>
          <button onClick={() => setLanguage('fa')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === 'fa' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>FA</button>
          <button onClick={() => setLanguage('ps')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === 'ps' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>PS</button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
           <Link to="/" className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-[#0d1117] text-3xl shadow-2xl transition-transform hover:scale-110 active:scale-95">
              <i className="fas fa-cube"></i>
           </Link>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t.createAccount}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t.authDesc}</p>
        </div>
        
        {/* Register Card */}
        <div className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-scale-in">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3 animate-shake">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                  </div>
              )}
              
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblFullName}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-gray-400`}>
                    <i className="fas fa-user"></i>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm`}
                    placeholder="Ahmad Fawad"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.email}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-gray-400`}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm`}
                    placeholder="ahmad@company.com"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* WhatsApp Field */}
              <div className="space-y-1.5">
                <label htmlFor="whatsapp" className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.whatsappNumber}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-green-500`}>
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className={`block w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm`}
                    placeholder={t.whatsappPlaceholder}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.password}</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.confirmPassword}</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0d1117] border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 leading-relaxed">
                 {t.termsAgree} <a href="#" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t.authFooterTerms}</a> & <a href="#" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t.authFooterPrivacy}</a>.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    {t.createAccount}...
                  </>
                ) : (
                  <>
                    {t.createAccount}
                    <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs`}></i>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.alreadyHaveAccount} <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t.signIn}</Link>
              </p>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest animate-fade-in animation-delay-500">
           <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.authFooterTerms}</a>
           <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.authFooterPrivacy}</a>
           <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.authFooterSecurity}</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
