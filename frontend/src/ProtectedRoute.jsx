import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();

  if (!isAuth) {
    navigate('/login');
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
