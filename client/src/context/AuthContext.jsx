import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('ev_auth_token');
    const savedUser = localStorage.getItem('ev_auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ev_auth_token');
        localStorage.removeItem('ev_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { user: loggedInUser, token: authToken } = response.data;
    setUser(loggedInUser);
    setToken(authToken);
    localStorage.setItem('ev_auth_token', authToken);
    localStorage.setItem('ev_auth_user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const { user: registeredUser, token: authToken } = response.data;
    setUser(registeredUser);
    setToken(authToken);
    localStorage.setItem('ev_auth_token', authToken);
    localStorage.setItem('ev_auth_user', JSON.stringify(registeredUser));
    return registeredUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ev_auth_token');
    localStorage.removeItem('ev_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
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
