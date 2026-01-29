
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Permission, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (u: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  isRole: (role: UserRole) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('zabah_token');
      if (token) {
        try {
          const userData = await api.getMe();
          // Mocking roles for development if not provided by API
          if (!userData.role) {
            userData.role = UserRole.VIEWER;
            userData.permissions = ['VIEW_REPORTS'];
          }
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('zabah_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (u: User, token: string) => {
    localStorage.setItem('zabah_token', token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('zabah_token');
    setUser(null);
  };

  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    if (user.role === UserRole.SUPER_ADMIN) return true;
    return user.permissions.includes(permission);
  };

  const isRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
