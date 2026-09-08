import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ rolesAutorises }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Redirection si non connecté
  if (!token || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Redirection si le rôle n'a pas accès
  if (rolesAutorises && !rolesAutorises.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;