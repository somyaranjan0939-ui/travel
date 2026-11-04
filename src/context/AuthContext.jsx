import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travelease_user');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      role: 'traveler',
      memberSince: '2024'
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (user) {
      localStorage.setItem('travelease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('travelease_user');
    }
  }, [user]);

  const login = (email, password) => {
    const isAdminEmail = email.toLowerCase().includes('admin');
    const newUser = {
      name: isAdminEmail ? 'Marcus Vance' : email.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
      email,
      avatar: isAdminEmail 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      role: isAdminEmail ? 'admin' : 'traveler',
      memberSince: '2024'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginAsAdmin = () => {
    const adminUser = {
      name: 'Marcus Vance',
      email: 'admin@travelease.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      role: 'admin',
      title: 'Platform Administrator',
      memberSince: '2023'
    };
    setUser(adminUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const switchRole = (newRole) => {
    setUser(prev => prev ? { ...prev, role: newRole } : null);
  };

  const register = (name, email, password) => {
    const isAdminEmail = email.toLowerCase().includes('admin');
    const newUser = {
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      role: isAdminEmail ? 'admin' : 'traveler',
      memberSince: '2026'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginAsAdmin,
      switchRole,
      register,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode,
      openLoginModal,
      openRegisterModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
