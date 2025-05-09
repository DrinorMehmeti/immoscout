import React, { createContext, useState, useContext, ReactNode, FC } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, userType: User['userType']) => Promise<boolean>;
  logout: () => void;
  redirectToDashboard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For now, we're simulating a successful login
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: '123',
        name: 'Mock User',
        email,
        password: '',
        userType: 'buyer',
        isPremium: false,
        properties: []
      };
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
      });
      
      // Redirect to dashboard after successful login
      redirectToDashboard();
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    userType: User['userType']
  ): Promise<boolean> => {
    // In a real app, this would be an API call
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser: User = {
        id: '123',
        name,
        email,
        password: '',
        userType,
        isPremium: false,
        properties: []
      };
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
      });
      
      // Redirect to dashboard after successful registration
      redirectToDashboard();
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    
    // Redirect to home page after logout
    window.location.href = '/';
  };
  
  const redirectToDashboard = () => {
    // In a real app with routing, you'd use a router to navigate
    // For this demo, we'll use window.location
    window.location.href = '/dashboard.html';
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, redirectToDashboard }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};