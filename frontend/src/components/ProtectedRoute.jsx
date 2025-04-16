import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import routes from '../services/clientRoutes.js';

const ProtectedRoute = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  if (!isAuth) {
    return <Navigate to={routes.login} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
