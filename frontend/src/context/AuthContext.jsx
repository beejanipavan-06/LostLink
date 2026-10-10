import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('lostlink_user');
    const token = localStorage.getItem('lostlink_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('lostlink_user');
        localStorage.removeItem('lostlink_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;
    const userData = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      studentId: data.studentId,
      role: data.role,
      recoveryScore: data.recoveryScore
    };
    localStorage.setItem('lostlink_token', data.token);
    localStorage.setItem('lostlink_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (fullName, email, studentId, password, role = 'STUDENT') => {
    const response = await api.post('/auth/register', { fullName, email, studentId, password, role });
    const data = response.data;
    const userData = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      studentId: data.studentId,
      role: data.role,
      recoveryScore: data.recoveryScore
    };
    localStorage.setItem('lostlink_token', data.token);
    localStorage.setItem('lostlink_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('lostlink_token');
    localStorage.removeItem('lostlink_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
