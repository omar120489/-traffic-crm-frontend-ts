/**
 * Protected route wrapper
 * Sprint 3: FE-AUTH-03
 * 
 * Redirects to /login if user is not authenticated
 * Preserves the intended destination in location state
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the location they were trying to go to
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render child routes
  return <Outlet />;
}

