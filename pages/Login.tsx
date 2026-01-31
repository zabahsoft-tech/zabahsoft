
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
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="flex justify-center gap-4 mb-10">
          {(['en', 'fa', 'ps'] as const).map(l => (
            <button key={l} onClick={() => setLanguage(l)} className={`text-[10px] font-black px-4 py-1.5 rounded-full transition-all border ${language === l ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-110' : 'text-gray-400 border-gray-200 dark:border-white/10 hover:text-gray-900 dark:hover:text-white'}`}>{l.toUpperCase()}</button>
          ))}
        </div>

        <div className="text-center mb-10">
          <Link to="/" className="inline-flex w-16 h-16 bg-gray-900 dark:bg-white rounded-[20px] items-center justify-center text-white dark:text-black text-4xl shadow-2xl mb-6 hover:scale-105 transition-transform">
             <i className="fas fa-cube"></i>
          </Link>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t.authTitle}</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">{t.authDesc}</p>
        </div>
        
        <div className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-2xl p-10 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-2xl animate-scale-in">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black flex items-center gap-3 animate-shake">
                      <i className="fas fa-exclamation-triangle"></i> {error}
                  </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t.email}</label>
                <div className="relative">
                  <i className={`fas fa-envelope absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-5' : 'left-5'} text-gray-400`}></i>
                  <input
                    required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className={`block w-full ${dir === 'rtl' ? 'pr-14 pl-4' : 'pl-14 pr-4'} py-4 border dark:border-white/5 rounded-2xl shadow-inner bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm`}
                    placeholder="demo@zabahsoft.com" dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t.password}</label>
                <div className="relative">
                  <i className={`fas fa-lock absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-5' : 'left-5'} text-gray-400`}></i>
                  <input
                    required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className={`block w-full ${dir === 'rtl' ? 'pr-14 pl-14' : 'pl-14 pr-14'} py-4 border dark:border-white/5 rounded-2xl shadow-inner bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm`}
                    placeholder="••••••••" dir="ltr"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-5' : 'right-5'} text-gray-400 hover:text-blue-600 transition-colors`}>
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button disabled={isLoading} className="w-full flex justify-center items-center gap-3 py-4 border border-transparent text-xs font-black uppercase tracking-widest rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50">
                {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <>{t.signIn} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i></>}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t dark:border-white/5 text-center">
              <p className="text-[11px] text-gray-500 font-bold mb-4">Demo Admin: <span className="text-blue-600 font-mono">ahmad@zabahsoft.com</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                {t.dontHaveAccount} <Link to="/register" className="text-blue-600 dark:text-blue-400 font-black hover:underline">{t.createAccount}</Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
