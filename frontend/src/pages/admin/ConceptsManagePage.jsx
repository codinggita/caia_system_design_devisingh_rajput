import { useEffect, useState, useCallback } from 'react';
import { conceptService } from '../../services/conceptService';
import { adminService } from '../../services/adminService';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import ConceptForm from '../../components/concept/ConceptForm';
import { motion } from 'framer-motion';
import { Add, Edit, Delete, Restore, Search, MenuBook } from '@mui/icons-material';
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

export default function ConceptsManagePage() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [confirmArchiveOpen, setConfirmArchiveOpen] = useState(false);
  const [conceptToArchive, setConceptToArchive] = useState(null);

  const fetchConcepts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await conceptService.list({
        page,
        limit: 10,
        search,
        category,
        difficulty,
        includeArchived: true, 
      });

      const resData = response.data?.data || response.data || {};
      const items = Array.isArray(resData) ? resData : (resData.items || resData.concepts || []);
      setConcepts(items);
      setTotalPages(resData.pagination?.totalPages || resData.totalPages || 1);
    } catch (_err) {
      toast.error('Failed to load concepts');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, difficulty]);

  useEffect(() => {
    fetchConcepts();
  }, [fetchConcepts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchConcepts();
  };

  const handleCreateClick = () => {
    setSelectedConcept(null);
    setFormOpen(true);
  };

  const handleEditClick = (concept) => {
    setSelectedConcept(concept);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedConcept) {
        await conceptService.update(selectedConcept._id, values);
        toast.success('Concept updated successfully!');
      } else {
        await conceptService.create(values);
        toast.success('Concept created successfully!');
      }
      setFormOpen(false);
      fetchConcepts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save concept');
    }
  };

  const handleArchiveClick = (concept) => {
    setConceptToArchive(concept);
    setConfirmArchiveOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (!conceptToArchive) return;
    try {
      if (conceptToArchive.isArchived) {
        try {
          await adminService.restoreConcept(conceptToArchive._id);
        } catch {
          await conceptService.update(conceptToArchive._id, { isArchived: false });
        }
        toast.success('Concept restored!');
      } else {
        try {
          await conceptService.archive(conceptToArchive._id);
        } catch {
          await adminService.archiveConcept(conceptToArchive._id);
        }
        toast.success('Concept archived!');
      }
      setConfirmArchiveOpen(false);
      setConceptToArchive(null);
      fetchConcepts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update concept status');
    }
  };

  const columns = [
    {
      header: 'Concept / Title',
      key: 'concept',
      render: (row) => (
        <div>
          <div className="font-bold text-white text-xs">{row.metadata?.concept || 'System Design'}</div>
          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">{row.prompt}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          {row.metadata?.category || 'Foundations'}
        </span>
      ),
    },
    {
      header: 'Difficulty',
      key: 'difficulty',
      render: (row) => {
        const diff = row.metadata?.difficulty || 'beginner';
        return (
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border capitalize ${
            diff === 'beginner' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : diff === 'intermediate' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {diff}
          </span>
        );
      },
    },
    {
      header: 'Status',
      key: 'isArchived',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
          row.isArchived 
            ? 'bg-rose-500/10 text-rose-455 border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {row.isArchived ? 'Archived' : 'Active'}
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
            onClick={() => handleEditClick(row)}
            className="p-1.5 border border-white/5 hover:border-indigo-500/30 bg-slate-950/45 hover:bg-slate-900 rounded-xl"
            title="Edit"
          >
            <Edit fontSize="small" className="text-indigo-400" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleArchiveClick(row)}
            className="p-1.5 border border-white/5 hover:border-indigo-500/30 bg-slate-950/45 hover:bg-slate-900 rounded-xl"
            title={row.isArchived ? 'Restore' : 'Archive'}
          >
            {row.isArchived ? (
              <Restore fontSize="small" className="text-emerald-450" />
            ) : (
              <Delete fontSize="small" className="text-rose-400" />
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="page-header mb-0">
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <MenuBook className="text-indigo-400 text-3xl" />
            Manage Concepts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Add, edit, archive, and manage the system design concepts library.
          </p>
        </div>
        <Button onClick={handleCreateClick} className="self-start sm:self-center px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md">
          <Add fontSize="small" className="mr-1.5" />
          Create Concept
        </Button>
      </motion.div>

      {/* Filters Bar */}
      <motion.form 
        variants={itemVariants} 
        onSubmit={handleSearchSubmit} 
        className="flex flex-col sm:flex-row gap-4 bg-slate-900/40 p-4 border border-white/5 rounded-2xl glass-panel"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search prompt, concept, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="caia-input pl-10 py-2.5 bg-slate-950/50 border-white/5 text-slate-205 rounded-xl focus:border-indigo-500/50"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search fontSize="small" />
          </div>
        </div>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="caia-input sm:w-48 py-2 px-3 text-xs bg-slate-950/50 border-white/5 text-slate-200 rounded-xl"
        >
          <option value="">All Categories</option>
          <option value="Foundations">Foundations</option>
          <option value="Scalability">Scalability</option>
          <option value="Databases">Databases</option>
          <option value="Distributed Systems">Distributed Systems</option>
          <option value="Security">Security</option>
          <option value="Caching">Caching</option>
          <option value="Messaging">Messaging</option>
          <option value="Microservices">Microservices</option>
          <option value="DevOps">DevOps</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
          className="caia-input sm:w-40 py-2 px-3 text-xs bg-slate-950/50 border-white/5 text-slate-200 rounded-xl"
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <Button type="submit" variant="secondary" className="px-5 py-2.5 text-xs font-bold border border-white/5 bg-slate-950/40 hover:bg-slate-900 rounded-xl">
          Search
        </Button>
      </motion.form>

      {/* Data Table */}
      <motion.div variants={itemVariants} className="animate-fade-in">
        <DataTable
          columns={columns}
          data={concepts}
          loading={loading}
          emptyMessage="No concepts found matching the filters."
        />
        
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>

      {/* Create / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={selectedConcept ? 'Edit Concept' : 'Create New Concept'}
        maxWidth="max-w-4xl"
      >
        <ConceptForm
          initialValues={selectedConcept}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
          submitText={selectedConcept ? 'Update' : 'Create'}
        />
      </Modal>

      {/* Archive / Restore Confirmation Modal */}
      <ConfirmModal
        open={confirmArchiveOpen}
        onClose={() => setConfirmArchiveOpen(false)}
        onConfirm={handleConfirmArchive}
        title={conceptToArchive?.isArchived ? 'Restore Concept?' : 'Archive Concept?'}
        message={
          conceptToArchive?.isArchived
            ? `Are you sure you want to restore "${conceptToArchive?.metadata?.concept}" back to the active list?`
            : `Are you sure you want to archive "${conceptToArchive?.metadata?.concept}"? Users will no longer see it in the explore dashboard.`
        }
        confirmText={conceptToArchive?.isArchived ? 'Restore' : 'Archive'}
        variant={conceptToArchive?.isArchived ? 'success' : 'danger'}
      />
    </motion.div>
  );
}

