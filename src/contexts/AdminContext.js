import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminStatus, loginAdmin, logoutAdmin } from '../services/admin';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status on mount
  useEffect(() => {
    getAdminStatus()
      .then(data => {
        setIsAdmin(!!data.isAdmin);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    await loginAdmin(username, password);
    setIsAdmin(true);
  };

  const logout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext); 