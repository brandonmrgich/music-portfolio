import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status on mount
  useEffect(() => {
    fetch('/admin/status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setIsAdmin(!!data.isAdmin);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    setIsAdmin(true);
  };

  const logout = async () => {
    await fetch('/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext); 