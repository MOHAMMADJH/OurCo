import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();
  
  // التحقق مما إذا كان المستخدم مسؤولاً استناداً إلى حقل role أو is_admin
  const isAdmin = user?.is_admin || user?.role === "admin";
  
  useEffect(() => {
    console.log('ProtectedRoute render');
    console.log('Path:', window.location.pathname);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('requireAdmin:', requireAdmin);
    console.log('isAdmin computed value:', isAdmin);
  }, [isAuthenticated, user, requireAdmin, isAdmin]);

  if (!isAuthenticated) {
    console.log('Redirecting to login: Not authenticated');
    return <Navigate to="/auth/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('Redirecting to dashboard: Not admin');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Rendering protected content');
  return element;
};

export default ProtectedRoute;