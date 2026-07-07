import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import Notifications from '@mui/icons-material/Notifications';
import Person from '@mui/icons-material/Person';
import Settings from '@mui/icons-material/Settings';
import ExitToApp from '@mui/icons-material/ExitToApp';
import KeyboardCommandKey from '@mui/icons-material/KeyboardCommandKey';
import { motion } from 'framer-motion';
import { toggleSidebar } from '../../features/ui/uiSlice';
import api from '../../services/api';
import CommandPalette from '../common/CommandPalette';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { user, isAdmin, handleLogout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    // Fetch notifications to show count
    const fetchNotificationsCount = async () => {
      try {
        const response = await api.get('/notifications');
        const notifications = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
      } catch {
        // silently ignore — notification count is non-critical
      }
    };
    
    if (user) {
      fetchNotificationsCount();
      const interval = setInterval(fetchNotificationsCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Global key listener for Ctrl+K
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate(isAdmin ? '/admin/profile' : '/dashboard/profile');
  };

  const handleSettingsClick = () => {
    setShowDropdown(false);
    navigate(isAdmin ? '/admin/settings' : '/dashboard/settings');
  };

  return (
    <header className="fixed top-6 left-[calc(var(--sidebar-width)+2rem)] right-6 z-30 transition-all duration-500">
      <div 
        className={`flex items-center justify-between h-20 px-8 glass-morphism rounded-[2rem] border-white/5 shadow-2xl transition-all duration-500 ${
          !sidebarOpen ? 'left-[calc(var(--sidebar-collapsed)+2rem)]' : ''
        }`}
      >
        <div className="flex items-center gap-6">
          {/* Toggle Button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-3 rounded-2xl text-text-muted hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer group"
          >
            <Menu className={`text-2xl transition-transform duration-500 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Global Search Bar Trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden md:flex items-center justify-between gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 w-80 text-text-muted transition-all duration-300 group cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-3">
              <Search className="text-xl group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Search Command...</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold font-mono">
              <KeyboardCommandKey className="text-[12px]" /> K
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button 
            onClick={() => navigate(isAdmin ? '/admin/notifications' : '/dashboard/notifications')}
            className="relative p-3 rounded-2xl text-text-muted hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
          >
            <Notifications className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-bg-surface animate-pulse" />
            )}
          </button>

          {/* User Profile Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl hover:bg-white/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                {user?.username?.[0] || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-bold text-white leading-none mb-1">{user?.username}</div>
                <div className="text-[10px] font-black text-primary-light uppercase tracking-widest">{user?.role}</div>
              </div>
            </button>

            {/* Premium Dropdown */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-4 w-64 glass-morphism rounded-[2rem] border-white/5 shadow-2xl p-3 z-50 overflow-hidden"
              >
                <div className="px-4 py-4 mb-2 border-b border-white/5">
                  <div className="text-sm font-bold text-white">{user?.username}</div>
                  <div className="text-xs text-text-muted truncate">{user?.email}</div>
                </div>
                
                <div className="space-y-1">
                  <button onClick={handleProfileClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                    <Person className="text-lg text-primary" /> Profile
                  </button>
                  <button onClick={handleSettingsClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                    <Settings className="text-lg text-primary" /> Settings
                  </button>
                </div>
                
                <div className="mt-2 pt-2 border-t border-white/5">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors">
                    <ExitToApp className="text-lg" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}

