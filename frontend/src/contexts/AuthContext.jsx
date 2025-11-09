import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') {
      setUser({ role: 'admin', token });
    }
    setLoading(false);
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ role, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, getToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

