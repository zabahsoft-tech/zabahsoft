import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { User } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

// Pages
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import WebSolutions from './pages/WebSolutions';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Simulate persistent session for demo purposes
  useEffect(() => {
    const savedUser = localStorage.getItem('zabah_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('zabah_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zabah_user');
  };

  return (
    <LanguageProvider>
      <HashRouter>
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage user={user} />} />
            <Route path="/solutions/web" element={<WebSolutions />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
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