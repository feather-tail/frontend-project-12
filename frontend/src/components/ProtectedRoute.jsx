import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import routes from '../services/clientRoutes.js';
import { useAuthState } from '../AuthContext.jsx';

const ProtectedRoute = () => {
  const { isAuth } = useAuthState();
  return isAuth ? <Outlet /> : <Navigate to={routes.login} replace />;
};

export default ProtectedRoute;
