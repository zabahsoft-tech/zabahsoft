
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { User } from '../types';

interface RegisterProps {
    onRegister: (user: User, token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      setError("Passwords do not match");
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
        const { user, token } = await api.register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        onRegister(user, token);
        navigate('/dashboard');
    } catch (err) {
        setError("Registration failed. Please try again.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Globe Simulation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-10 dark:opacity-20 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-tr from-purple-300 to-blue-300 dark:from-purple-500 dark:to-blue-500 rounded-full blur-[100px] animate-pulse"></div>
         {/* Rings */}
         <div className="absolute inset-0 border border-gray-400/20 dark:border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
         <div className="absolute inset-10 border border-gray-400/20 dark:border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
         <div className="absolute inset-32 border border-gray-400/10 dark:border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[340px]">
        {/* Logo Area */}
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-[#0d1117] text-2xl shadow-xl dark:shadow-glow">
              <i className="fas fa-cube"></i>
           </div>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">
            {t.createAccount}
          </h2>
          <p className="text-gray-500 dark:text-[#8b949e] text-sm mt-2">{t.authDesc}</p>
        </div>
        
        {/* Register Card */}
        <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-gray-200 dark:border-[#30363d] shadow-lg dark:shadow-xl animate-fade-in-up">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-xs">
                      {error}
                  </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-normal text-gray-900 dark:text-white mb-2">{t.lblFullName}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 border border-gray-300 dark:border-[#30363d] rounded-md shadow-sm placeholder-gray-400 dark:placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-normal text-gray-900 dark:text-white mb-2">{t.email}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 border border-gray-300 dark:border-[#30363d] rounded-md shadow-sm placeholder-gray-400 dark:placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors"
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-normal text-gray-900 dark:text-white mb-2">{t.password}</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 border border-gray-300 dark:border-[#30363d] rounded-md shadow-sm placeholder-gray-400 dark:placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors"
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-normal text-gray-900 dark:text-white mb-2">{t.confirmPassword}</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 border border-gray-300 dark:border-[#30363d] rounded-md shadow-sm placeholder-gray-400 dark:placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors"
                  dir="ltr"
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-[#8b949e]">
                 {t.termsAgree} <a href="#" className="text-blue-600 dark:text-[#58a6ff] hover:underline">{t.authFooterTerms}</a>.
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-1.5 px-4 border border-transparent dark:border-[rgba(240,246,252,0.1)] text-sm font-bold rounded-md text-white bg-green-600 dark:bg-[#238636] hover:bg-green-700 dark:hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-[#238636] shadow-sm transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? t.createAccount + "..." : t.createAccount}
                </button>
              </div>
            </form>
        </div>
        
        <div className="mt-4 p-4 rounded-md border border-gray-200 dark:border-[#30363d] text-center text-sm text-gray-600 dark:text-[#c9d1d9] bg-white dark:bg-transparent animate-fade-in-up" style={{animationDelay: '0.1s'}}>
           {t.alreadyHaveAccount} <Link to="/login" className="text-blue-600 dark:text-[#58a6ff] hover:underline hover:text-[#58a6ff]">{t.signIn}</Link>.
        </div>

        <div className="mt-8 flex justify-center gap-4 text-xs text-gray-500 dark:text-[#8b949e] animate-fade-in-up" style={{animationDelay: '0.2s'}}>
           <a href="#" className="hover:text-blue-600 dark:hover:text-[#58a6ff] hover:underline">{t.authFooterTerms}</a>
           <a href="#" className="hover:text-blue-600 dark:hover:text-[#58a6ff] hover:underline">{t.authFooterPrivacy}</a>
           <a href="#" className="hover:text-blue-600 dark:hover:text-[#58a6ff] hover:underline">{t.authFooterSecurity}</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
