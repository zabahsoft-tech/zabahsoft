import React, { useState } from 'react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock User Data
      const mockUser: User = {
        id: 101,
        name: "Ahmad Fawad",
        email: email || "client@zabahsoft.com",
        phone: "+93 799 123 456"
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gh-gray">
      <div className="mb-6">
         <i className="fab fa-github text-5xl text-gh-dark"></i>
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-light text-gh-text">
          {t.signIn} to ZabahSoft
        </h2>
      </div>
      
      <div className="max-w-xs w-full">
        <div className="bg-white p-5 rounded-md border border-gh-border shadow-sm">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-gh-text mb-2">{t.email}</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-1.5 border border-gh-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gh-blue focus:border-gh-blue sm:text-sm bg-gh-gray focus:bg-white"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label htmlFor="password" className="block text-sm font-semibold text-gh-text">{t.password}</label>
                   <a href="#" className="text-xs text-gh-blue hover:underline">Forgot password?</a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-1.5 border border-gh-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gh-blue focus:border-gh-blue sm:text-sm bg-gh-gray focus:bg-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-1.5 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-gh-green hover:bg-gh-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gh-green shadow-sm transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? t.signIn + "..." : t.signIn}
                </button>
              </div>
            </form>
        </div>
        
        <div className="mt-6 border p-4 rounded-md border-gh-border text-center text-sm">
           New to ZabahSoft? <a href="#" className="text-gh-blue hover:underline">Create an account</a>.
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gh-muted space-x-4">
         <a href="#" className="hover:text-gh-blue hover:underline">Terms</a>
         <a href="#" className="hover:text-gh-blue hover:underline">Privacy</a>
         <a href="#" className="hover:text-gh-blue hover:underline">Security</a>
         <a href="#" className="hover:text-gh-blue hover:underline">Contact ZabahSoft</a>
      </div>
    </div>
  );
};

export default Login;