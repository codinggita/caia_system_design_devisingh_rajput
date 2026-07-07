import { useEffect, useState } from 'react';
import { notificationService } from '../../services/userServices';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { motion } from 'framer-motion';
import { Notifications, Info, DoneAll, AccessTime } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.list();
      const resData = response.data?.data || response.data || {};
      const items = Array.isArray(resData) ? resData : (resData.items || resData.notifications || []);
      setNotifications(items);
    } catch (err) {
      toast.error('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      toast.success('Notification marked as read');
    } catch (_err) {
      toast.error('Failed to mark read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (_err) {
      toast.error('Failed to mark all as read');
    }
  };

  if (loading) {
    return <SkeletonLoader type="list" count={3} />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="page-header mb-0">
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Notifications className="text-indigo-400 text-3xl" />
            Notifications
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Stay updated on new architectural releases, daily challenges, and achievements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} className="self-start sm:self-center px-4 py-2 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md">
            <DoneAll fontSize="small" className="mr-1.5" />
            Mark All Read
          </Button>
        )}
      </motion.div>

      {notifications.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          message="You have no notifications at this time. Check back later for system recommendations!"
        />
      ) : (
        <motion.div variants={itemVariants} className="space-y-4">
          {notifications.map((notif) => (
            <Card
              key={notif._id}
              padding="p-4"
              className={`flex flex-col sm:flex-row items-start justify-between gap-4 border transition-all duration-200 ${
                notif.read
                  ? 'border-white/5 bg-slate-950/20 opacity-70'
                  : 'border-indigo-500/25 bg-slate-900/40 shadow-sm relative overflow-hidden'
              }`}
            >
              {!notif.read && (
                <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-indigo-500 to-purple-500" />
              )}
              <div className="flex items-start gap-3 flex-1 pl-1">
                <div className={`p-2 rounded-xl border ${notif.read ? 'bg-slate-950/30 text-slate-650 border-white/5' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                  <Info fontSize="small" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-400' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" title="Unread" />
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1.5 font-bold">
                    <AccessTime style={{ fontSize: 12 }} />
                    <span>
                      {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>

              {!notif.read && (
                <Button
                  onClick={() => handleMarkAsRead(notif._id)}
                  variant="ghost"
                  className="text-xs border border-white/5 hover:border-indigo-500/30 text-slate-300 py-1.5 px-3 self-end sm:self-center bg-slate-950/50 hover:text-indigo-400"
                >
                  Mark Read
                </Button>
              )}
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
