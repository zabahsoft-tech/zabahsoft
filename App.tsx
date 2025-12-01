
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { User } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { api } from './services/api';

// Pages
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import WebSolutions from './pages/WebSolutions';
import OfficialServices from './pages/OfficialServices';
import HostingSolutions from './pages/HostingSolutions';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Utility to ensure page starts at top on route change (UX/SEO factor)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('zabah_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Session expired or invalid", error);
          localStorage.removeItem('zabah_token');
        }
      }
      setIsAuthChecking(false);
    };

    initAuth();
  }, []);

  const handleLogin = (u: User, token: string) => {
    setUser(u);
    localStorage.setItem('zabah_token', token);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn("Logout failed on server, clearing local state anyway.");
    }
    setUser(null);
    localStorage.removeItem('zabah_token');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1117]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage user={user} />} />
            <Route path="/solutions/web" element={<WebSolutions />} />
            <Route path="/solutions/official" element={<OfficialServices />} />
            <Route path="/solutions/hosting" element={<HostingSolutions />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
