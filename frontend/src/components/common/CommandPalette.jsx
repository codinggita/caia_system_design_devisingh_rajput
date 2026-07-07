import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import Dashboard from '@mui/icons-material/Dashboard';
import Explore from '@mui/icons-material/Explore';
import Bookmark from '@mui/icons-material/Bookmark';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';
import Notifications from '@mui/icons-material/Notifications';
import BarChart from '@mui/icons-material/BarChart';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Help from '@mui/icons-material/Help';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { conceptService } from '../../services/conceptService';

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [search, setSearch] = useState('');
  const [concepts, setConcepts] = useState([]);
  const inputRef = useRef(null);

  // Load concepts for searching
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      conceptService.list({ limit: 100 })
        .then((res) => {
          const resData = res.data?.data || res.data || {};
          setConcepts(resData.concepts || resData.data || []);
        })
        .catch((err) => console.error(err));
      
      // Auto focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isAuthenticated]);

  const defaultActions = [
    { label: 'Go to Dashboard', icon: <Dashboard />, path: '/dashboard', category: 'Navigation' },
    { label: 'Explore All Concepts', icon: <Explore />, path: '/dashboard/concepts', category: 'Navigation' },
    { label: 'My Bookmarked Concepts', icon: <Bookmark />, path: '/dashboard/bookmarks', category: 'Navigation' },
    { label: 'Achievements & Milestones', icon: <EmojiEvents />, path: '/dashboard/achievements', category: 'Navigation' },
    { label: 'Notifications', icon: <Notifications />, path: '/dashboard/notifications', category: 'Navigation' },
    { label: 'Edit Profile Details', icon: <Person />, path: '/dashboard/profile', category: 'Settings' },
    { label: 'Account Settings', icon: <Settings />, path: '/dashboard/settings', category: 'Settings' },
  ];

  const adminActions = [
    { label: 'Admin Overview', icon: <AdminPanelSettings />, path: '/admin', category: 'Admin Tools' },
    { label: 'Manage All Concepts', icon: <Explore />, path: '/admin/concepts', category: 'Admin Tools' },
    { label: 'Manage Users & Permissions', icon: <Person />, path: '/admin/users', category: 'Admin Tools' },
    { label: 'System Analytics Logs', icon: <BarChart />, path: '/admin/analytics', category: 'Admin Tools' },
  ];

  const allActions = [
    ...defaultActions,
    ...(user?.role === 'admin' ? adminActions : [])
  ];

  const filteredActions = allActions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  const matchedConcepts = concepts.filter(c => 
    (c.metadata?.concept || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.metadata?.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setSearch('');
  };

  // Close palette on Esc press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Overlay backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050816]/80 backdrop-blur-xl"
          />

          {/* Command Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl glass-morphism rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden relative z-10 flex flex-col"
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-4 px-8 py-6 border-b border-white/5 bg-white/5">
              <Search className="text-2xl text-primary" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands, concepts, pages..."
                className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-text-muted font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-text-muted transition-colors"
              >
                <Close />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] no-scrollbar p-4 space-y-8">
              {/* Navigation Actions */}
              {filteredActions.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-4 mb-4">Command Actions</h3>
                  <div className="space-y-1">
                    {filteredActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(action.path)}
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-primary/10 group transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-secondary group-hover:text-primary-light transition-colors">
                            {action.icon}
                          </div>
                          <span className="text-sm font-bold text-text-secondary group-hover:text-white transition-colors">{action.label}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowForward className="text-xs text-primary-light" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Concepts Matching */}
              {matchedConcepts.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-4 mb-4">Architecture Blueprints</h3>
                  <div className="space-y-1">
                    {matchedConcepts.slice(0, 5).map((concept, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(`/dashboard/concepts/${concept._id}`)}
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-secondary/10 group transition-all duration-300 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-secondary group-hover:text-secondary transition-colors">
                            <Explore className="text-xl" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-text-secondary group-hover:text-white transition-colors">
                              {concept.metadata?.concept}
                            </div>
                            <div className="text-[10px] text-text-muted uppercase font-black">{concept.metadata?.category}</div>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black text-text-muted group-hover:bg-secondary/20 group-hover:text-secondary transition-all">
                           {concept.metadata?.difficulty}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredActions.length === 0 && matchedConcepts.length === 0 && (
                <div className="py-20 text-center">
                   <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Help className="text-4xl text-text-muted opacity-20" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
                   <p className="text-text-muted max-w-xs mx-auto text-sm">We couldn't find anything matching your search. Try a different keyword.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/10">ESC</span>
                    <span>Close</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/10">↵</span>
                    <span>Select</span>
                 </div>
              </div>
              <div className="text-[10px] font-black text-primary-light uppercase tracking-widest">CACI COMMAND v2.0</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

