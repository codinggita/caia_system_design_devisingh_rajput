import { useEffect, useState } from 'react';
import { achievementService } from '../../services/userServices';
import Card from '../../components/common/Card';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { motion } from 'framer-motion';
import { EmojiEvents, Lock, Stars } from '@mui/icons-material';
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

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const response = await achievementService.list();
        const resData = response.data?.data || response.data || {};
        const items = Array.isArray(resData) ? resData : (resData.items || resData.achievements || []);
        setAchievements(items);
      } catch (_err) {
        toast.error('Failed to load achievements list');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <SkeletonLoader type="card" count={3} />;
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
          <EmojiEvents className="text-indigo-400 text-3xl" />
          Achievements & Milestones
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Earn milestones by studying advanced system designs, daily streak counts, or voting.
        </p>
      </motion.div>

      {achievements.length === 0 ? (
        <EmptyState
          title="No Achievements Registered"
          message="Keep studying and checking off concepts! Milestones will unlock automatically."
        />
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const isUnlocked = ach.status === 'unlocked';
            
            return (
              <Card
                key={ach._id}
                padding="p-5"
                className={`relative flex flex-col justify-between border transition-all duration-305 ${
                  isUnlocked
                    ? 'border-indigo-500/35 bg-slate-900/50 shadow-md shadow-indigo-500/5'
                    : 'border-white/5 bg-slate-950/20 opacity-60'
                }`}
              >
                {isUnlocked && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500" />
                )}
                <div className="space-y-4">
                  {/* Status Badges */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border tracking-wider ${
                      isUnlocked 
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                        : 'bg-slate-900 text-slate-500 border-white/5'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      +{ach.score || 10} XP
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl border ${
                      isUnlocked 
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                        : 'bg-slate-900 text-slate-600 border-white/5'
                    }`}>
                      {isUnlocked ? <Stars className="text-[20px]" /> : <Lock className="text-[20px]" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>

                {isUnlocked && ach.earnedAt && (
                  <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-emerald-400 font-semibold flex items-center justify-between">
                    <span>Earned On:</span>
                    <span className="font-mono">{format(new Date(ach.earnedAt), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

