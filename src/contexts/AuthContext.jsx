import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear auth state on error
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Set token in localStorage and API headers
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(userData);
      toast.success('Login successful!');
      
      // Navigate to the intended page or home
      const intendedPath = location.state?.from || '/';
      navigate(intendedPath, { replace: true });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await api.post('/auth/register', userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    initialized,
    login,
    register,
    logout,
    checkAuthStatus
  };

  // Only show loading indicator on initial load
  if (loading && !initialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 