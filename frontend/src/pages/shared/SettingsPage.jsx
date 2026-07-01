import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/ui/uiSlice';
import { preferenceService } from '../../services/userServices';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { Settings, LightMode, DarkMode, Notifications } from '@mui/icons-material';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
};

export default function SettingsPage() {
  const dispatch = useDispatch();
  const activeTheme = useSelector((state) => state.ui.theme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: { email: true, push: false },
    language: 'en',
    interests: [],
  });

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await preferenceService.get();
      setPreferences(response.data?.data || response.data || {
        notifications: { email: true, push: false },
        language: 'en',
        interests: [],
      });
    } catch (err) {
      console.error('Failed to fetch preferences', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleTogglePreference = (channel) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [channel]: !prev.notifications[channel],
      },
    }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await preferenceService.update(preferences);
      toast.success('Preferences saved successfully!');
    } catch (_err) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-24 w-full bg-white/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
          <div className="h-96 bg-white/5 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="page-header border-b border-white/5 pb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Settings className="text-indigo-400 text-3xl" />
          Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your preferred visual theme, notifications channels, and access keys.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Settings */}
        <Card padding="p-6" className="flex flex-col bg-slate-900/40 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            {activeTheme === 'dark' ? <DarkMode className="text-indigo-400" /> : <LightMode className="text-indigo-400" />}
            Theme Configurations
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Select standard light or high-contrast dark modes for comfortable reading.
          </p>
          <div className="mt-auto flex items-center">
            <Button onClick={() => dispatch(toggleTheme())} variant="secondary" className="w-full justify-center py-2.5 px-4 font-bold border border-white/5 bg-slate-950/40 hover:bg-slate-900">
              Toggle Theme: <span className="font-extrabold capitalize text-indigo-400 ml-1.5">{activeTheme}</span>
            </Button>
          </div>
        </Card>

        {/* Notifications Channel Settings */}
        <Card padding="p-6" className="flex flex-col bg-slate-900/40 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-indigo-500" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <Notifications className="text-indigo-400" />
            Notification Subscriptions
          </h4>
          <div className="space-y-4 flex-1 mb-6">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5 cursor-pointer hover:bg-slate-950/60 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-200">Email Notifications</span>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Weekly progress reports and daily study items.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={() => handleTogglePreference('email')}
                className="rounded bg-slate-850 border-white/10 text-indigo-500 focus:ring-indigo-500/20 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5 cursor-pointer hover:bg-slate-950/60 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-200">Push Notifications</span>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Instant messages on milestone unlocks.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={() => handleTogglePreference('push')}
                className="rounded bg-slate-850 border-white/10 text-indigo-500 focus:ring-indigo-500/20 w-4 h-4"
              />
            </label>
          </div>

          <div className="border-t border-white/5 pt-4">
            <Button
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full justify-center py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md text-xs font-bold"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

