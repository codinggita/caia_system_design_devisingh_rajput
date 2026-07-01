import { useEffect, useState, useCallback } from 'react';
import { bookmarkService } from '../../services/bookmarkService';
import ConceptCard from '../../components/concept/ConceptCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { motion } from 'framer-motion';
import { Bookmark } from '@mui/icons-material';
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

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookmarkService.getBookmarks();
      const resData = response.data?.data || response.data || {};
      const list = Array.isArray(resData) ? resData : (resData.items || []);
      // Filter out bookmarks with missing concept data
      const validBookmarks = list.filter(bm => bm && bm.concept);
      setBookmarks(validBookmarks);
    } catch (_err) {
      toast.error('Failed to load bookmarked concepts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleBookmarkToggle = async (conceptId) => {
    try {
      await bookmarkService.removeBookmark(conceptId);
      setBookmarks(prev => prev.filter(bm => {
        if (!bm) return false;
        const cid = bm.concept?._id || bm.concept || bm._id;
        return cid !== conceptId;
      }));
      toast.success('Bookmark removed');
    } catch (_err) {
      toast.error('Failed to remove bookmark');
    }
  };

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
          <Bookmark className="text-indigo-400 text-3xl" />
          My Bookmarks
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Your personalized list of saved system design architectures and concepts.
        </p>
      </motion.div>

      {/* Bookmarks Grid */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <SkeletonLoader type="card" count={3} />
        ) : bookmarks.length === 0 ? (
          <EmptyState
            title="No Bookmarks Saved"
            message="Go to the explore tab, browse topics, and save them to build your personal system design index!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bm) => {
              const conceptData = bm.concept || bm;
              const conceptId = conceptData._id;
              return (
                <ConceptCard
                  key={conceptId}
                  concept={conceptData}
                  isInitiallyBookmarked={true}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

