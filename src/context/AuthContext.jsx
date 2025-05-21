import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkLogin = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setUser(res.data);
    } catch (e) {
      setUser(null);
    }
  };

  const logout = async () => {
    await axios.get('/api/auth/logout');
    setUser(null);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
