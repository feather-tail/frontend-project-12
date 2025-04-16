import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => localStorage.getItem('user'));

  const login = (newToken, username) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', username);
    setToken(newToken);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuth = Boolean(token);

  const value = {
    token,
    user,
    login,
    logout,
    isAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
