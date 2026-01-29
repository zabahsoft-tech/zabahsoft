
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t, dir, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
        const { user, token } = await api.login(email, password);
        onLogin(user, token);
        navigate('/dashboard');
    } catch (err) {
        setError(t.invalidCredentials);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/5 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 border border-gray-900 dark:border-white rounded-full animate-[spin_100s_linear_infinite]"></div>
          <div className="absolute inset-20 border border-gray-900 dark:border-white rounded-full animate-[spin_80s_linear_infinite_reverse]"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Language Switcher on Auth Page */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setLanguage('en')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>EN</button>
          <button onClick={() => setLanguage('fa')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === 'fa' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>FA</button>
          <button onClick={() => setLanguage('ps')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${language === 'ps' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>PS</button>
        </div>

        {/* Logo Area */}
        <div className="flex justify-center mb-6">
           <Link to="/" className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-[#0d1117] text-3xl shadow-2xl transition-transform hover:scale-110 active:scale-95">
              <i className="fas fa-cube"></i>
           </Link>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t.authTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t.authDesc}</p>
        </div>
        
        {/* Login Card with Glassmorphism */}
        <div className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-scale-in">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3 animate-shake">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                  </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email-address" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.email}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-gray-400`}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white transition-all text-sm`}
                    placeholder="name@company.com"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label htmlFor="password" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.password}</label>
                   <a href="#" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">{t.passForgot}</a>
                </div>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-gray-400`}>
                    <i className="fas fa-lock"></i>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full ${dir === 'rtl' ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white transition-all text-sm`}
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-4' : 'right-4'} flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors`}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    {t.signIn}...
                  </>
                ) : (
                  <>
                    {t.signIn}
                    <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs`}></i>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.dontHaveAccount} <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t.createAccount}</Link>
              </p>
            </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest animate-fade-in animation-delay-500">
           <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.authFooterTerms}</a>
           <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.authFooterPrivacy}</a>
           <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.authFooterSecurity}</a>
           <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.authFooterContact}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
