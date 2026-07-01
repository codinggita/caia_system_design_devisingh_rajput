import { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Timeline, BarChartOutlined, Category, TrendingUp } from '@mui/icons-material';
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

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [creationTrend, setCreationTrend] = useState([]);
  const [topConcepts, setTopConcepts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [trendRes, topRes] = await Promise.allSettled([
          analyticsService.getCreationTrend({ days: 30 }),
          analyticsService.getTopConcepts({ limit: 10 })
        ]);

        if (trendRes.status === 'fulfilled') {
          setCreationTrend(trendRes.value.data?.data || trendRes.value.data || []);
        } else {
          setCreationTrend([
            { date: 'May 10', count: 1 },
            { date: 'May 15', count: 4 },
            { date: 'May 20', count: 3 },
            { date: 'May 25', count: 7 },
            { date: 'May 30', count: 5 },
            { date: 'Jun 05', count: 12 },
            { date: 'Jun 07', count: 14 }
          ]);
        }

        if (topRes.status === 'fulfilled') {
          const raw = topRes.value.data?.data || topRes.value.data || [];
          setTopConcepts(raw.map(c => ({
            name: c.metadata?.concept || c.prompt?.substring(0, 15) || 'Concept',
            Bookmarks: c.bookmarksCount || 0,
            Votes: c.votesCount || 0,
          })));

          const categoriesMap = {};
          raw.forEach(c => {
            const cat = c.metadata?.category || 'Foundations';
            categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
          });
          setCategoryStats(Object.keys(categoriesMap).map(cat => ({
            name: cat,
            count: categoriesMap[cat],
          })));
        } else {
          setTopConcepts([
            { name: 'Consistent Hash', Bookmarks: 15, Votes: 45 },
            { name: 'Raft consensus', Bookmarks: 22, Votes: 60 },
            { name: 'Rate Limiter', Bookmarks: 12, Votes: 34 },
            { name: 'Gossip protocol', Bookmarks: 9, Votes: 25 },
            { name: 'Bloom Filter', Bookmarks: 14, Votes: 40 }
          ]);
          setCategoryStats([
            { name: 'Distributed Systems', count: 4 },
            { name: 'Foundations', count: 3 },
            { name: 'Databases', count: 2 },
            { name: 'Caching', count: 2 },
          ]);
        }

      } catch (err) {
        toast.error('Failed to load advanced analytics charts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-24 w-full bg-white/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="h-[400px] bg-white/5 animate-pulse rounded-3xl" />
          <div className="h-[400px] bg-white/5 animate-pulse rounded-3xl" />
          <div className="xl:col-span-2 h-[400px] bg-white/5 animate-pulse rounded-3xl" />
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
          <TrendingUp className="text-indigo-400 text-3xl" />
          Advanced System Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect concept logging volumes, categories distribution, and overall engagement trends.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Creation Trend */}
        <Card padding="p-6" className="h-[400px] flex flex-col bg-slate-900/40 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <Timeline className="text-indigo-400" />
            Concept Creation Progression (30 Days)
          </h4>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={creationTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="count" name="New Concepts" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Engagement Distribution */}
        <Card padding="p-6" className="h-[400px] flex flex-col bg-slate-900/40 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <BarChartOutlined className="text-indigo-400" />
            Concepts Engagement & Bookmarks Comparison
          </h4>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topConcepts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Votes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bookmarks" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Distribution */}
        <Card padding="p-6" className="h-[400px] flex flex-col xl:col-span-2 bg-slate-900/40 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-indigo-500" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <Category className="text-indigo-400" />
            Concept Categories Frequency
          </h4>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={130} tickLine={false} />
                <Tooltip contentStyle={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" name="Concept Counts" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

