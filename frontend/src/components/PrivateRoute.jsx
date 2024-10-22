import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const PrivateRoute = ({ children }) => {
  const { state } = useAppContext();
  const isAuthenticated = !!state.user;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;