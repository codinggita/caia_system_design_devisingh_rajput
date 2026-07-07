
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import Dashboard from '@mui/icons-material/Dashboard';
import MenuBook from '@mui/icons-material/MenuBook';
import Bookmark from '@mui/icons-material/Bookmark';
import TrendingUp from '@mui/icons-material/TrendingUp';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import Explore from '@mui/icons-material/Explore';
import Notifications from '@mui/icons-material/Notifications';
import Person from '@mui/icons-material/Person';
import Settings from '@mui/icons-material/Settings';
import People from '@mui/icons-material/People';
import BarChart from '@mui/icons-material/BarChart';
import History from '@mui/icons-material/History';
import Dns from '@mui/icons-material/Dns';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Psychology from '@mui/icons-material/Psychology';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { isAdmin, handleLogout } = useAuth();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const navigate = useNavigate();

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { to: '/dashboard/concepts', label: 'Explore Concepts', icon: <MenuBook /> },
    { to: '/dashboard/bookmarks', label: 'Bookmarks', icon: <Bookmark /> },
    { to: '/dashboard/progress', label: 'My Progress', icon: <TrendingUp /> },
    { to: '/dashboard/achievements', label: 'Achievements', icon: <EmojiEvents /> },
    { to: '/dashboard/discovery', label: 'Discovery Paths', icon: <Explore /> },
    { to: '/dashboard/notifications', label: 'Notifications', icon: <Notifications /> },
    { to: '/dashboard/profile', label: 'Profile', icon: <Person /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings /> },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Overview', icon: <Dashboard /> },
    { to: '/admin/concepts', label: 'Manage Concepts', icon: <MenuBook /> },
    { to: '/admin/users', label: 'Manage Users', icon: <People /> },
    { to: '/admin/analytics', label: 'System Analytics', icon: <BarChart /> },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: <History /> },
    { to: '/admin/system', label: 'System Status', icon: <Dns /> },
    { to: '/admin/profile', label: 'Profile', icon: <Person /> },
    { to: '/admin/settings', label: 'Settings', icon: <Settings /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside
      className={`fixed top-6 left-6 z-40 h-[calc(100vh-3rem)] transition-all duration-500 rounded-[2rem] glass-morphism border-white/5 shadow-2xl ${
        sidebarOpen ? 'w-64' : 'w-24'
      } flex flex-col overflow-hidden`}
    >
      {/* Brand Header */}
      <div className="flex items-center h-24 px-6 mb-4">
        <div className="flex items-center gap-4 overflow-hidden group cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Psychology className="text-white text-2xl" />
          </div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-black tracking-tighter text-white"
            >
              CACI
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-primary/10 text-white border border-primary/20'
                  : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <div className={`flex-shrink-0 transition-colors duration-300 group-hover:text-primary-light`}>
              {link.icon}
            </div>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold tracking-tight"
              >
                {link.label}
              </motion.span>
            )}
            {!sidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-bg-surface border border-white/10 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                {link.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="p-4 mt-auto border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-text-muted hover:text-danger hover:bg-danger/10 transition-all duration-300 group"
        >
          <div className="flex-shrink-0">
            <ExitToApp className="text-xl" />
          </div>
          {sidebarOpen && <span className="text-sm font-bold">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

