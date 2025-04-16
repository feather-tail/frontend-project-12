import i18n from './services/i18n.js';
import socket from './services/initSocket.js';
import profanityInit from './services/initProfanity.js';
import { initializeAuth } from './store/authSlice.js';
import store from './store/store.js';

const initApp = () => {
  i18n.t();
  profanityInit();
  const savedToken = localStorage.getItem('token');
  store.dispatch(initializeAuth(savedToken));

  return { socket };
};

export default initApp;
