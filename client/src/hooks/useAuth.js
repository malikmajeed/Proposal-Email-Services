import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated (stored in localStorage)
    const storedToken = localStorage.getItem('bluewolf_token');
    if (storedToken) {
      setToken(storedToken);
      // Verify token with backend
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const data = await authAPI.verify();
      setIsAuthenticated(true);
      setToken(tokenToVerify);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('bluewolf_token');
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);

      if (data.success) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('bluewolf_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Network error' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('bluewolf_token');
    }
  };

  return {
    isAuthenticated,
    isLoading,
    token,
    login,
    logout
  };
};

export default useAuth;
