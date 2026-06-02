import React, { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();


const token = sessionStorage.getItem('token');
const role = sessionStorage.getItem('role');

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    token && role ? { token, role } : null
  );
  const [loading, setLoading] = useState(false);



  const login = (token, role) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    setAuth({ token, role });
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
