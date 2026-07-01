import { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import { motion } from 'framer-motion';
import { Search, Block, SupervisedUserCircle, HowToReg, People } from '@mui/icons-material';
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

export default function UsersManagePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState('');

  // Modals state
  const [confirmBanOpen, setConfirmBanOpen] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState(null);
  const [newRole, setNewRole] = useState('user');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({
        page,
        limit: 10,
        search,
      });
      const resData = response.data?.data || response.data || {};
      setUsers(resData.items || []);
      setTotalPages(resData.pagination?.totalPages || 1);
    } catch (_err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleBanToggle = (user) => {
    setUserToBan(user);
    setConfirmBanOpen(true);
  };

  const handleConfirmBan = async () => {
    if (!userToBan) return;
    try {
      if (userToBan.isBanned) {
        await adminService.unbanUser(userToBan._id);
        toast.success(`User "${userToBan.username}" unbanned successfully.`);
      } else {
        await adminService.banUser(userToBan._id);
        toast.success(`User "${userToBan.username}" banned successfully.`);
      }
      setConfirmBanOpen(false);
      setUserToBan(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update ban status');
    }
  };

  const handleRoleChangeClick = (user) => {
    setUserToChangeRole(user);
    setNewRole(user.role || 'user');
    setRoleModalOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!userToChangeRole) return;
    try {
      await adminService.changeRole(userToChangeRole._id, newRole);
      toast.success(`Role for "${userToChangeRole.username}" updated to ${newRole}.`);
      setRoleModalOpen(false);
      setUserToChangeRole(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const columns = [
    {
      header: 'User details',
      key: 'username',
      render: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.username}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border tracking-wider ${
          row.role === 'admin' 
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
            : 'bg-slate-900 text-slate-550 border-white/5'
        }`}>
          {row.role}
        </span>
      ),
    },
    {
      header: 'Email Verified',
      key: 'isEmailVerified',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border tracking-wider ${
          row.isEmailVerified 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-slate-900 text-slate-550 border-white/5'
        }`}>
          {row.isEmailVerified ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'isBanned',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border tracking-wider ${
          row.isBanned 
            ? 'bg-rose-500/10 text-rose-455 border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {row.isBanned ? 'Banned' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Joined On',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-400 font-mono">
          {row.createdAt ? format(new Date(row.createdAt), 'MMM dd, yyyy') : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            onClick={() => handleRoleChangeClick(row)}
            className="p-1.5 border border-white/5 hover:border-indigo-500/30 bg-slate-950/45 hover:bg-slate-900 rounded-xl"
            title="Change Role"
          >
            <SupervisedUserCircle fontSize="small" className="text-indigo-400" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleBanToggle(row)}
            className="p-1.5 border border-white/5 hover:border-indigo-500/30 bg-slate-950/45 hover:bg-slate-900 rounded-xl"
            title={row.isBanned ? 'Unban' : 'Ban'}
          >
            {row.isBanned ? (
              <HowToReg fontSize="small" className="text-emerald-450" />
            ) : (
              <Block fontSize="small" className="text-rose-400" />
            )}
          </Button>
        </div>
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
          <People className="text-indigo-400 text-3xl" />
          Manage Users
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          View active users, alter registration roles, or ban/unban profiles.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.form 
        variants={itemVariants} 
        onSubmit={handleSearchSubmit} 
        className="flex gap-4 bg-slate-900/40 p-4 border border-white/5 rounded-2xl glass-panel"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by username or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="caia-input pl-10 py-2.5 bg-slate-950/50 border-white/5 text-slate-205 rounded-xl focus:border-indigo-500/50"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search fontSize="small" />
          </div>
        </div>
        <Button type="submit" variant="secondary" className="px-5 py-2.5 text-xs font-bold border border-white/5 bg-slate-950/40 hover:bg-slate-900 rounded-xl">
          Search
        </Button>
      </motion.form>

      {/* Users list table */}
      <motion.div variants={itemVariants} className="animate-fade-in">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="No users found matching your query."
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>

      {/* Ban / Unban Modal */}
      <ConfirmModal
        open={confirmBanOpen}
        onClose={() => setConfirmBanOpen(false)}
        onConfirm={handleConfirmBan}
        title={userToBan?.isBanned ? 'Unban User?' : 'Ban User?'}
        message={
          userToBan?.isBanned
            ? `Are you sure you want to lift the ban for "${userToBan?.username}"? They will regain full access to their account.`
            : `Are you sure you want to ban user "${userToBan?.username}"? They will be signed out and blocked from logging in.`
        }
        confirmText={userToBan?.isBanned ? 'Unban User' : 'Ban User'}
        variant={userToBan?.isBanned ? 'success' : 'danger'}
      />

      {/* Change Role Modal */}
      <Modal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={`Change Role: ${userToChangeRole?.username}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="user-role-select" className="caia-label mb-1.5 block">Select Access Level</label>
            <select
              id="user-role-select"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="caia-input py-2.5 px-3 bg-slate-950 border-white/5 text-slate-200 rounded-xl focus:border-indigo-500/50 text-xs"
            >
              <option value="user">User (Explore & Learn)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setRoleModalOpen(false)} className="text-slate-400 hover:text-white border border-white/5 hover:border-indigo-500/25 px-4 rounded-xl text-xs font-bold bg-slate-950/40">
              Cancel
            </Button>
            <Button onClick={handleConfirmRoleChange} className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

