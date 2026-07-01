import { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { History, FilterList } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

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

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getAuditLogs({
        page,
        limit: 15,
        action: action || undefined,
        status: status || undefined,
      });

      const resData = response.data?.data || response.data || {};
      setLogs(resData.items || []);
      setTotalPages(resData.pagination?.totalPages || 1);
    } catch (_err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [page, action, status]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearFilters = () => {
    setAction('');
    setStatus('');
    setPage(1);
  };

  const columns = [
    {
      header: 'Action',
      key: 'action',
      render: (row) => (
        <span className="font-mono text-[10px] text-indigo-400 font-extrabold bg-indigo-500/10 px-2.5 py-1 border border-indigo-500/20 rounded-lg">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Actor',
      key: 'actor',
      render: (row) => {
        const username = row.actor?.username || 'System/Cron';
        const role = row.actor?.role || '';
        return (
          <div>
            <div className="font-bold text-white text-xs">{username}</div>
            {role && <div className="text-[9px] text-indigo-400 font-extrabold uppercase mt-0.5 tracking-wider">{role}</div>}
          </div>
        );
      },
    },
    {
      header: 'Resource Target',
      key: 'target',
      render: (row) => {
        const res = row.target?.resource || 'N/A';
        const id = row.target?.id || 'N/A';
        return (
          <div>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-400">{res}</span>
            <div className="text-[9px] text-slate-500 font-mono mt-1 truncate max-w-[130px]">{id}</div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => {
        const st = row.status || 'success';
        return (
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
            st === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {st}
          </span>
        );
      },
    },
    {
      header: 'IP / Agent',
      key: 'ip',
      render: (row) => (
        <div className="max-w-[160px] truncate">
          <div className="text-xs text-slate-300 font-mono font-medium">{row.ip || '127.0.0.1'}</div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5" title={row.userAgent}>
            {row.userAgent || 'Chrome/Vite'}
          </div>
        </div>
      ),
    },
    {
      header: 'Timestamp',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-400 font-mono">
          {row.createdAt ? format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
        </span>
      ),
    },
  ];

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
          <History className="text-indigo-400 text-3xl" />
          System Audit Logs
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Track administrator changes, system updates, concept archives, and user bans.
        </p>
      </motion.div>

      {/* Filters Bar */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col sm:flex-row gap-4 bg-slate-900/40 p-4 border border-white/5 rounded-2xl items-center justify-between glass-panel"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 whitespace-nowrap">
          <FilterList fontSize="small" className="text-indigo-400" />
          <span>Filter Logs:</span>
        </div>

        <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full justify-end">
          <select
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
            className="caia-input sm:w-56 py-2 px-3 text-xs bg-slate-950/50 border-white/5 text-slate-200 rounded-xl"
          >
            <option value="">All Actions</option>
            <option value="user.login">user.login</option>
            <option value="user.register">user.register</option>
            <option value="user.ban">user.ban</option>
            <option value="user.unban">user.unban</option>
            <option value="user.role_change">user.role_change</option>
            <option value="concept.create">concept.create</option>
            <option value="concept.update">concept.update</option>
            <option value="concept.archive">concept.archive</option>
            <option value="concept.restore">concept.restore</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="caia-input sm:w-48 py-2 px-3 text-xs bg-slate-950/50 border-white/5 text-slate-200 rounded-xl"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>

          {(action || status) && (
            <Button variant="ghost" onClick={handleClearFilters} className="text-slate-400 hover:text-white border border-white/5 hover:border-indigo-500/25 px-4 rounded-xl text-xs font-bold">
              Clear Filters
            </Button>
          )}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="animate-fade-in">
        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          emptyMessage="No audit logs matched your query."
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>
    </motion.div>
  );
}

