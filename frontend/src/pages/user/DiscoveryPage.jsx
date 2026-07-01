import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { discoveryService } from '../../services/discoveryService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { motion } from 'framer-motion';
import { Explore, ArrowForward } from '@mui/icons-material';

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

export default function DiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPath = searchParams.get('path') || 'system-design';
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    try {
      const response = await discoveryService.roadmap(currentPath);
      const resData = response.data?.data || response.data || {};
      const items = Array.isArray(resData) ? resData : (resData.items || resData.roadmap || []);
      setRoadmap(items);
    } catch (_err) {
      // Fallback demo roadmap if endpoint fails
      if (currentPath === 'system-design') {
        setRoadmap([
          { _id: 'consistent-hashing-id', title: 'Level 1: Distributed Hashing & Sharding', description: 'Understand how request key hashing is distributed across dynamic cluster topologies.', difficulty: 'intermediate' },
          { _id: 'rate-limiting-token-bucket', title: 'Level 2: Resiliency & Rate Limiting', description: 'Deploy API token bucket constraints to mitigate denial-of-service bottlenecks.', difficulty: 'beginner' },
          { _id: 'message-queue-pub-sub', title: 'Level 3: Asynchronous Message Queues', description: 'Orchestrate event-driven microservices using topics and pub-sub systems.', difficulty: 'intermediate' }
        ]);
      } else {
        setRoadmap([
          { _id: 'rest-vs-grpc', title: 'Level 1: API Communication Formats', description: 'Contrast high-performance binary gRPC against human-readable REST payloads.', difficulty: 'beginner' },
          { _id: 'database-indexing', title: 'Level 2: Query Optimization & Indexing', description: 'Deep dive into B-Trees, LSM-Trees, and indexes in relation-oriented databases.', difficulty: 'intermediate' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPath]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const handlePathChange = (pathKey) => {
    setSearchParams({ path: pathKey });
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'advanced': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'beginner':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
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
          <Explore className="text-indigo-400 text-3xl" />
          Learning Paths & Roadmaps
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Track recommended sequences of software architecture concepts sorted by track difficulty.
        </p>
      </motion.div>

      {/* Path selection pills */}
      <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-1 border-b border-white/5">
        {[
          { key: 'system-design', label: 'System Design Syllabus' },
          { key: 'backend', label: 'Backend Development' },
          { key: 'frontend', label: 'Frontend Architecture' },
          { key: 'devops', label: 'Infrastructure & DevOps' }
        ].map((track) => (
          <button
            key={track.key}
            onClick={() => handlePathChange(track.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              currentPath === track.key
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-500/35 shadow-md shadow-indigo-500/10'
                : 'bg-slate-900/50 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {track.label}
          </button>
        ))}
      </motion.div>

      {/* Timeline display */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <SkeletonLoader type="list" count={3} />
        ) : roadmap.length === 0 ? (
          <EmptyState
            title="Roadmap Path Empty"
            message="No concepts are currently mapped to this path. Please select a different path."
          />
        ) : (
          <div className="relative border-l border-white/5 ml-6 pl-8 space-y-8 py-2">
            {roadmap.map((step, idx) => {
              const conceptId = step._id || step.concept?._id;
              const stepTitle = step.title || step.metadata?.concept || 'Architecture Step';
              const stepDesc = step.description || step.prompt || '';
              const stepDiff = step.difficulty || step.metadata?.difficulty || 'beginner';

              return (
                <div key={idx} className="relative group">
                  {/* Timeline node dot indicator */}
                  <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-extrabold text-indigo-400 transition-all group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-110">
                    {idx + 1}
                  </div>

                  <Card padding="p-5" className="border border-white/5 hover:border-indigo-500/30 bg-slate-900/40 transition-all duration-300 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {stepTitle}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border tracking-wider capitalize self-start sm:self-auto ${getDifficultyBadge(stepDiff)}`}>
                        {stepDiff}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {stepDesc}
                    </p>

                    {conceptId && (
                      <Button
                        onClick={() => navigate(`/dashboard/concepts/${conceptId}`)}
                        variant="ghost"
                        className="px-4 py-2 border border-white/5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                      >
                        Start Step
                        <ArrowForward fontSize="inherit" className="ml-1.5" />
                      </Button>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

