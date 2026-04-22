import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios';
import { useToast } from '@/components/ui/use-toast';

export interface User {
  name?: string;
  email?: string;
  role?: string;
  id?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          setIsAdmin(user.role === 'admin');
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    try {
      await api.post('/auth/register', { email, password, name, role: 'user' });
      toast({
        title: "Account created successfully!",
        description: "Welcome to CampusCare, please login",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role, name } = response.data;
      
      const user = { email, name, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAdmin(role === 'admin');
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setIsAdmin(false);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    toast({
      title: "Not Implemented",
      description: "Password reset is not yet implemented in the backend",
      variant: "destructive",
    });
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
