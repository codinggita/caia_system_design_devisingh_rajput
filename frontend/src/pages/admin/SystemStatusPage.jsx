import { useEffect, useState } from 'react';
import { systemService } from '../../services/userServices';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { Dns, Memory, Speed, Storage, Refresh } from '@mui/icons-material';
import toast from 'react-hot-toast';

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

export default function SystemStatusPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [version, setVersion] = useState(null);

  const fetchSystemStatus = async () => {
    setLoading(true);
    try {
      const [statusRes, dbRes, uptimeRes, verRes] = await Promise.allSettled([
        systemService.status(),
        systemService.dbStatus(),
        systemService.uptime(),
        systemService.version(),
      ]);

      if (statusRes.status === 'fulfilled') setStatus(statusRes.value.data?.data || statusRes.value.data || {});
      if (dbRes.status === 'fulfilled') setDbStatus(dbRes.value.data?.data || dbRes.value.data || {});
      if (uptimeRes.status === 'fulfilled') setUptime(uptimeRes.value.data?.data || uptimeRes.value.data || {});
      if (verRes.status === 'fulfilled') setVersion(verRes.value.data?.data || verRes.value.data || {});
      
      toast.success('System diagnostics refreshed!');
    } catch (err) {
      toast.error('Failed to load system diagnostics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-24 w-full bg-white/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
          <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
          <div className="md:col-span-2 h-48 bg-white/5 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const memoryData = status?.processInfo?.memoryUsage || status?.memory || {};

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
            <Dns className="text-indigo-400 text-3xl" />
            System Performance Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Examine active API memory, CPU limits, database configurations, and caches.
          </p>
        </div>
        <Button onClick={fetchSystemStatus} className="self-start sm:self-center px-4 py-2.5 text-xs font-bold border border-white/5 bg-slate-950/40 hover:bg-slate-900 rounded-xl" variant="secondary">
          <Refresh fontSize="small" className="mr-1.5" />
          Refresh Info
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Node Process Memory */}
        <Card padding="p-6" className="flex flex-col bg-slate-900/40 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Memory className="text-indigo-400" />
            Node.js Process Memory
          </h4>
          <div className="space-y-5 flex-1">
            <div>
              <div className="flex justify-between text-xs text-slate-450 mb-1.5 font-bold">
                <span>RSS (Resident Set Size)</span>
                <span className="font-mono text-slate-205">{formatBytes(memoryData.rss)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-455 mb-1.5 font-bold">
                <span>Heap Total</span>
                <span className="font-mono text-slate-200">{formatBytes(memoryData.heapTotal)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-455 mb-1.5 font-bold">
                <span>Heap Used</span>
                <span className="font-mono text-slate-200">{formatBytes(memoryData.heapUsed)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.round((memoryData.heapUsed / memoryData.heapTotal) * 100))}%` }}></div>
              </div>
            </div>

            {memoryData.external && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>External C++ Bound</span>
                  <span className="font-mono text-slate-200">{formatBytes(memoryData.external)}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Database Connection */}
        <Card padding="p-6" className="flex flex-col bg-slate-900/40 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Storage className="text-indigo-400" />
            MongoDB Storage
          </h4>
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3 font-semibold">
              <span className="text-slate-400">Connection State</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border tracking-wider ${
                dbStatus?.connected || dbStatus?.status === 'connected' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-455 border-rose-500/20'
              }`}>
                {dbStatus?.connected || dbStatus?.status === 'connected' ? 'Connected' : 'Offline'}
              </span>
            </div>

            {dbStatus?.host && (
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3 font-semibold">
                <span className="text-slate-400">Database Host</span>
                <span className="font-mono text-slate-200">{dbStatus.host}</span>
              </div>
            )}

            {dbStatus?.name && (
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3 font-semibold">
                <span className="text-slate-400">Database Name</span>
                <span className="font-mono text-slate-200">{dbStatus.name}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs pb-1 font-semibold">
              <span className="text-slate-400">Mongoose Version</span>
              <span className="font-mono text-slate-200">v8.5.2</span>
            </div>
          </div>
        </Card>

        {/* API Platform Status */}
        <Card padding="p-6" className="flex flex-col md:col-span-2 bg-slate-900/40 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-indigo-500" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Speed className="text-indigo-400" />
            System Environmental Info
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl relative overflow-hidden">
              <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider">API Version</p>
              <h5 className="text-sm font-bold text-white mt-1.5 font-mono">v{version?.version || '1.0.0'}</h5>
            </div>
            
            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl relative overflow-hidden">
              <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider">System Uptime</p>
              <h5 className="text-sm font-bold text-white mt-1.5 font-mono">{uptime?.uptime || uptime?.formatted || 'N/A'}</h5>
            </div>

            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl relative overflow-hidden">
              <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider">Environment</p>
              <h5 className="text-sm font-bold text-white mt-1.5 capitalize font-mono">development</h5>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

