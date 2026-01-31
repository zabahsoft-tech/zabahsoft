
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import PortalLayout from './components/PortalLayout';
import CustomCursor from './components/CustomCursor';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { behaviorTracker } from './services/behaviorTracker';

// Pages
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import WebSolutions from './pages/WebSolutions';
import DomainRegistration from './pages/DomainRegistration';
import OfficialServices from './pages/OfficialServices';
import HostingSolutions from './pages/HostingSolutions';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const BehaviorManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Use cookies for better suggestions by tracking page interest
    behaviorTracker.trackPageVisit(pathname);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { user, isLoading, logout, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1117]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="text-gray-500 font-mono text-sm">Authenticating ZabahSafe...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      <Routes>
        {/* Public Routes with Corporate Branding Header/Footer */}
        <Route element={<PublicLayout user={user} onLogout={logout} />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage user={user} />} />
          <Route path="/domains" element={<DomainRegistration />} />
          <Route path="/solutions/web" element={<WebSolutions />} />
          <Route path="/solutions/official" element={<OfficialServices />} />
          <Route path="/solutions/hosting" element={<HostingSolutions />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register onRegister={login} />} 
          />
        </Route>

        {/* Management Routes with Professional Sidebar/Workspace Layout */}
        <Route element={user ? <PortalLayout user={user} onLogout={logout} /> : <Navigate to="/login" />}>
          <Route 
            path="/dashboard" 
            element={<Dashboard user={user!} />} 
          />
          <Route 
            path="/admin/*" 
            element={user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? <Admin /> : <Navigate to="/" />} 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <BehaviorManager />
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
