import initSocket from './services/initSocket.js';
import initI18n from './services/i18n.js';
import initProfanity from './services/initProfanity.js';
import { initializeAuth } from './store/authSlice.js';
import store from './store/store.js';

const initApp = () => {
  initI18n();
  initProfanity();

  const savedToken = localStorage.getItem('token');
  store.dispatch(initializeAuth(savedToken));

  return initSocket();
};

export default initApp;
