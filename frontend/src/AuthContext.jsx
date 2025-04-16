import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

const AuthStateContext = createContext(null);
const AuthActionsContext = createContext(null);

const createLogin = (setToken, setUser) => (newToken, username) => {
  localStorage.setItem('token', newToken);
  localStorage.setItem('user', username);
  setToken(newToken);
  setUser(username);
};

const createLogout = (setToken, setUser) => () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setToken(null);
  setUser(null);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => localStorage.getItem('user'));

  const login = createLogin(setToken, setUser);
  const logout = createLogout(setToken, setUser);

  const isAuth = Boolean(token);
  const stateValue = { token, user, isAuth };
  const actionsValue = { login, logout };

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  const { t } = useTranslation();
  if (context === null) {
    throw new Error(t('auth.errors.outsideProviderState'));
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  const { t } = useTranslation();
  if (context === null) {
    throw new Error(t('auth.errors.outsideProviderActions'));
  }
  return context;
};
