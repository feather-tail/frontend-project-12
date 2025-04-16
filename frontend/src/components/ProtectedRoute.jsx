import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import routes from '../services/clientRoutes.js';
import { useAuth } from '../AuthContext.jsx';

const ProtectedRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to={routes.login} replace />;
};

export default ProtectedRoute;
