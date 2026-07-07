import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../utils/constants';

export default function AdminRoute() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated)             return <Navigate to="/login" replace />;
  if (user?.role !== ROLES.ADMIN)   return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
