import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader message="Verificando credenciales de acceso..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toUpperCase();
    if (!userRole || !allowedRoles.map((r) => r.toUpperCase()).includes(userRole)) {
      // Redireccionar al dashboard correspondiente a su rol si no tiene permiso
      if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
      if (userRole === 'ORGANIZADOR') return <Navigate to="/organizador/dashboard" replace />;
      return <Navigate to="/usuario/dashboard" replace />;
    }
  }

  return children;
};
