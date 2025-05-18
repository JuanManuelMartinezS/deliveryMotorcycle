import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../services/authService';

const RoleBasedRedirect = () => {
  const { currentUser } = useAuth();
  const currentRole = localStorage.getItem('currentRole');

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  switch (currentRole) {
    case USER_ROLES.CUSTOMER:
      return <Navigate to="/customers" replace />;
    case USER_ROLES.RESTAURANT:
      return <Navigate to="/restaurants" replace />;
    case USER_ROLES.DRIVER:
      return <Navigate to="/drivers" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;