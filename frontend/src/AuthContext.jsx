import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const AuthStateContext = createContext(null);

const AuthActionsContext = createContext(null);

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

  return (
    <AuthStateContext.Provider value={{ token, user, isAuth }}>
      <AuthActionsContext.Provider value={{ login, logout }}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === null) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (context === null) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return context;
};
