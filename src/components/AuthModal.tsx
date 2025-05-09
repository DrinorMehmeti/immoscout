import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialView = 'login'
}) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  
  if (!isOpen) return null;
  
  const toggleView = () => {
    setView(view === 'login' ? 'register' : 'login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          <button
            className="absolute top-2 right-2 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
          
          {view === 'login' ? (
            <LoginForm onToggleForm={toggleView} />
          ) : (
            <RegisterForm onToggleForm={toggleView} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;