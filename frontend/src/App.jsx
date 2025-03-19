import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './slices/store';
import PageLogin from './PageLogin.jsx';
import { Page404 } from './Page404.jsx';
import { initializeAuth } from './slices/authSlice';
import ProtectedRoute from './ProtectedRoute.jsx';
import ChatPage from './ChatPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const savedToken = localStorage.getItem('token');
  store.dispatch(initializeAuth(savedToken));

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Page404 />} />
          <Route path='login' element={<PageLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
