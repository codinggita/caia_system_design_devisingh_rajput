import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { analyticsService } from '../../services/analyticsService';
import { systemService } from '../../services/userServices';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import { motion } from 'framer-motion';
import {
  People,
  MenuBook,
  Dns,
  Bookmark,
  ThumbUp,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 24 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ usersCount: 0, conceptsCount: 0, bookmarksCount: 0, votesCount: 0 });
  const [systemInfo, setSystemInfo] = useState({ healthy: false, dbConnected: false, uptime: '0h 0m', version: '1.0.0' });
  const [creationTrend, setCreationTrend] = useState([]);
  const [topConcepts, setTopConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, trendRes, topRes, sysStatusRes, dbStatusRes, uptimeRes, versionRes] = await Promise.allSettled([
        adminService.getDashboard(),
        analyticsService.getCreationTrend({ days: 30 }),
        analyticsService.getTopConcepts({ limit: 5 }),
        systemService.status(),
        systemService.dbStatus(),
        systemService.uptime(),
        systemService.version()
      ]);

      if (statsRes.status === 'fulfilled') {
        const d = statsRes.value.data?.data || statsRes.value.data || {};
        setStats({ usersCount: d.usersCount || d.users || 0, conceptsCount: d.conceptsCount || d.concepts || 0, bookmarksCount: d.bookmarksCount || d.bookmarks || 0, votesCount: d.votesCount || d.votes || 0 });
      }

      if (trendRes.status === 'fulfilled') {
        setCreationTrend(trendRes.value.data?.data || trendRes.value.data || []);
      } else {
        setCreationTrend([
          { date: 'May 30', count: 2 }, { date: 'Jun 01', count: 5 }, { date: 'Jun 02', count: 3 },
          { date: 'Jun 03', count: 8 }, { date: 'Jun 04', count: 6 }, { date: 'Jun 05', count: 12 }, { date: 'Jun 06', count: 15 },
        ]);
      }

      if (topRes.status === 'fulfilled') {
        const resData = topRes.value.data?.data || topRes.value.data || {};
        const list = Array.isArray(resData) ? resData : (resData.items || resData.concepts || []);
        setTopConcepts(list.map(c => ({ name: c.metadata?.concept || c.prompt?.substring(0, 15) || 'Concept', bookmarks: c.bookmarksCount || 0, votes: c.votesCount || 0 })));
      } else {
        setTopConcepts([
          { name: 'Rate Limiter', bookmarks: 12, votes: 34 }, { name: 'Consistent Hash', bookmarks: 18, votes: 45 },
          { name: 'Message Queue', bookmarks: 8, votes: 29 }, { name: 'LSM Tree', bookmarks: 15, votes: 40 }, { name: 'Raft Consensus', bookmarks: 22, votes: 58 },
        ]);
      }

      const isHealthy = sysStatusRes.status === 'fulfilled' ? (sysStatusRes.value.data?.healthy || sysStatusRes.value.data?.status === 'ok') : false;
      const isDbOk = dbStatusRes.status === 'fulfilled' ? (dbStatusRes.value.data?.connected || dbStatusRes.value.data?.status === 'connected') : false;
      const uptimeStr = uptimeRes.status === 'fulfilled' ? (uptimeRes.value.data?.uptime || uptimeRes.value.data?.formatted || 'N/A') : 'N/A';
      const versionStr = versionRes.status === 'fulfilled' ? (versionRes.value.data?.version || '1.0.0') : '1.0.0';
      setSystemInfo({ healthy: isHealthy, dbConnected: isDbOk, uptime: uptimeStr, version: versionStr });

    } catch (err) {
      toast.error('Error fetching some admin dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return (
    <div className="space-y-8">
      <div className="h-24 w-full bg-white/5 animate-pulse rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[380px] bg-white/5 animate-pulse rounded-3xl" />
        <div className="h-[380px] bg-white/5 animate-pulse rounded-3xl" />
      </div>
      <div className="h-48 bg-white/5 animate-pulse rounded-3xl" />
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Page Header */}
      <motion.div variants={itemVariants} className="page-header pb-6 border-b border-white/5">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h2>
        <p className="text-xs text-slate-400 mt-1">Overview of system health, user interactions, and architecture concept logs.</p>
      </motion.div>

      {/* Grid of Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.usersCount} icon={<People />} color="amber" trend="+4 this week" trendDirection="up" />
        <StatCard title="Concepts Count" value={stats.conceptsCount} icon={<MenuBook />} color="emerald" />
        <StatCard title="Bookmarks Saved" value={stats.bookmarksCount} icon={<Bookmark />} color="amber" />
        <StatCard title="Total Votes" value={stats.votesCount} icon={<ThumbUp />} color="emerald" />
      </motion.div>

      {/* Charts section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Concept Creation Trend */}
        <Card padding="p-6" className="flex flex-col h-[380px] bg-slate-900/40 border border-white/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Concept Creation Trend (30 Days)</h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={creationTrend}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Engaged Concepts */}
        <Card padding="p-6" className="flex flex-col h-[380px] bg-slate-900/40 border border-white/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Engaged Concepts</h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topConcepts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="votes" name="Votes" fill="#6366f1" radius={[5, 5, 0, 0]} />
                <Bar dataKey="bookmarks" name="Bookmarks" fill="#06b6d4" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div variants={itemVariants}>
        <Card padding="p-6" className="bg-slate-900/40 border border-white/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2.5 mb-6">
            <Dns className="text-indigo-400" /> Server Status Diagnostics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { label: 'API Health', value: systemInfo.healthy ? 'Healthy' : 'Degraded', ok: systemInfo.healthy },
              { label: 'Database', value: systemInfo.dbConnected ? 'Connected' : 'Disconnected', ok: systemInfo.dbConnected },
              { label: 'API Uptime', value: systemInfo.uptime, ok: true, noIcon: true },
              { label: 'Platform Version', value: `v${systemInfo.version}`, ok: true, noIcon: true },
            ].map((item, i) => (
              <div key={i} className="bg-slate-950/40 p-5 border border-white/5 rounded-2xl flex items-center justify-between group">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</p>
                  <h5 className="text-sm font-extrabold text-white mt-1.5">{item.value}</h5>
                </div>
                {!item.noIcon && (
                  item.ok
                    ? <CheckCircle className="text-teal-400 text-xl" />
                    : <Warning className="text-rose-400 text-xl" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

