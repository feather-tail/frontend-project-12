import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Page404 from './pages/Page404.jsx';
import SignupPage from './pages/SignupPage.jsx';
import store from './store/store.js';
import paths from './services/paths.js';

const App = ({ socket }) => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path={paths.notFound} element={<Page404 />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.signup} element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path={paths.root} element={<ChatPage socket={socket} />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </Provider>
);

export default App;
