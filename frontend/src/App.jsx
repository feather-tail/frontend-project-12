import 'react-toastify/dist/ReactToastify.css';
import './services/i18n.js';

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { Page404 } from './pages/Page404.jsx';
import SignupPage from './pages/SignupPage.jsx';
import profanityInit from './services/initProfanity.js';
import { initializeAuth } from './store/authSlice.js';
import { store } from './store/store.js';

const App = () => {
  profanityInit();

  const savedToken = localStorage.getItem('token');
  store.dispatch(initializeAuth(savedToken));

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
