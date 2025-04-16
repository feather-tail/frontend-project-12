import i18n from './services/i18n.js';
import socket from './services/initSocket.js';
import profanityInit from './services/initProfanity.js';

const initApp = () => {
  i18n.t();
  profanityInit();
  return { socket };
};

export default initApp;
