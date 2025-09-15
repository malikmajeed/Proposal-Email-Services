import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('bluewolf_token');
    if (storedToken) {
      setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      await authAPI.verify(tokenToVerify);
      setIsAuthenticated(true);
      setToken(tokenToVerify);
    } catch (error) {
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
      if (data.success && data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('bluewolf_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout(token);
      }
    } catch (error) {
      // Optionally handle error
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