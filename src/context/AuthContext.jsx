import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

const AuthContext = createContext();

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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success('Login successful!');
      
      // Navigate to the intended page or home
      const intendedPath = location.state?.from || '/';
      navigate(intendedPath, { replace: true });
      return true;
    } catch (error) {
<<<<<<< HEAD
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message === 'Network Error') {
        toast.error('Unable to connect to the server. Please check your connection.');
      } else {
        toast.error('Login failed. Please try again.');
      }
=======
      toast.error(error.response?.data?.message || 'Login failed');
>>>>>>> origin/main
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
