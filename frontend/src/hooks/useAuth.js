import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { ROLES } from '../utils/constants';

export const useAuth = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isUser  = user?.role === ROLES.USER;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return { user, token, isAuthenticated, loading, error, isAdmin, isUser, handleLogout };
};
