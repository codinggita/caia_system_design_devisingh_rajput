import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { conceptService } from '../../services/conceptService';
import { bookmarkService } from '../../services/bookmarkService';
import SearchBar from '../../components/common/SearchBar';
import ConceptCard from '../../components/concept/ConceptCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../../utils/constants';
import { motion } from 'framer-motion';
import Explore from '@mui/icons-material/Explore';
import FilterList from '@mui/icons-material/FilterList';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 25 }
  }
};

export default function ConceptsExplorePage() {
  const [concepts, setConcepts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination State
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

  // Sync URL params with local state on load
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page')) || 1;
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlDifficulty = searchParams.get('difficulty') || '';
    
    setPage(urlPage);
    setSearch(urlSearch);
    setCategory(urlCategory);
    setDifficulty(urlDifficulty);
  }, [searchParams]);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page.toString();
    if (search) params.search = search;
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    setSearchParams(params, { replace: true });
  }, [page, search, category, difficulty, setSearchParams]);

  const fetchExploreData = useCallback(async () => {
    setLoading(true);
    try {
      const [conceptsRes, bookmarksRes] = await Promise.allSettled([
        conceptService.list({
          page,
          limit: 9,
          search,
          category,
          difficulty,
          isArchived: false,
        }),
        bookmarkService.getBookmarks()
      ]);

      if (conceptsRes.status === 'fulfilled') {
        const resData = conceptsRes.value.data?.data || conceptsRes.value.data || {};
        const items = resData.items || resData.concepts || resData.data || [];
        setConcepts(items);
        setTotalPages(resData.pagination?.totalPages || resData.totalPages || 1);
      } else {
        toast.error('Failed to load concepts');
      }

      if (bookmarksRes.status === 'fulfilled') {
        const resData = bookmarksRes.value.data?.data || bookmarksRes.value.data || {};
        const bookmarksList = Array.isArray(resData) ? resData : (resData.items || []);
        const ids = new Set(
          bookmarksList
            .filter(bm => bm && (bm.concept || bm._id))
            .map(bm => bm.concept?._id || bm.concept || bm._id)
        );
        setBookmarkedIds(ids);
      }
    } catch (_err) {
      // Log removed
    } finally {
      setLoading(false);
    }
  }, [page, search, category, difficulty]);

  useEffect(() => {
    fetchExploreData();
  }, [fetchExploreData]);

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  const handleCategorySelect = (catName) => {
    setCategory(catName === category ? '' : catName);
    setPage(1);
  };

  const handleBookmarkToggle = (conceptId, isAdded) => {
    setBookmarkedIds(prev => {
      const copy = new Set(prev);
      if (isAdded) {
        copy.add(conceptId);
      } else {
        copy.delete(conceptId);
      }
      return copy;
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
            Explore <span className="text-gradient">Blueprints</span>
          </h1>
          <p className="text-text-muted text-lg font-medium">Learn core software architecture constructs and design patterns.</p>
        </div>
        <div className="flex items-center gap-3 glass-morphism px-6 py-3 rounded-2xl border-white/5 shadow-xl">
          <Explore className="text-primary-light" />
          <span className="text-xs font-black uppercase tracking-widest text-text-secondary">800+ Concepts Available</span>
        </div>
      </motion.div>

      {/* Search and Filters panel */}
      <motion.div 
        variants={itemVariants} 
        className="glass-card p-6 flex flex-col md:flex-row gap-6 items-center justify-between premium-shadow"
      >
        <div className="w-full md:flex-1">
          <SearchBar onSearch={handleSearch} initialValue={search} />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto items-center">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted whitespace-nowrap">
            <FilterList className="text-lg text-primary-light" />
            <span>Difficulty:</span>
          </div>
          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            className="w-full md:w-48 bg-white/5 border border-white/5 text-white text-xs font-bold py-3 px-4 rounded-xl outline-none focus:border-primary/50 transition-all cursor-pointer"
          >
            <option value="" className="bg-bg-surface">All Difficulties</option>
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level} className="bg-bg-surface">
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Category Pills Slider */}
      <motion.div 
        variants={itemVariants}
        className="flex gap-3 overflow-x-auto pb-4 no-scrollbar"
      >
        <button
          onClick={() => { setCategory(''); setPage(1); }}
          className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
            !category
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
              : 'bg-white/5 text-text-muted border-white/5 hover:text-white hover:bg-white/10'
          }`}
        >
          All Blueprints
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              category === cat
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-text-muted border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Concept Grid list */}
      <motion.div variants={itemVariants} className="space-y-6">
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : concepts.length === 0 ? (
          <EmptyState
            title="No Blueprints Found"
            message="We couldn't find any concepts matching your current filters. Try resetting search or category pills."
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concepts.map((concept) => (
                <ConceptCard
                  key={concept._id}
                  concept={concept}
                  isInitiallyBookmarked={bookmarkedIds.has(concept._id)}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

