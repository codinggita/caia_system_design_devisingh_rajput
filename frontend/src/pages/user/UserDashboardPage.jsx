import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { progressService, achievementService } from '../../services/userServices';
import { bookmarkService } from '../../services/bookmarkService';
import { discoveryService } from '../../services/discoveryService';
import { motion } from 'framer-motion';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ConceptCard from '../../components/concept/ConceptCard';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import Bookmark from '@mui/icons-material/Bookmark';
import LocalFireDepartment from '@mui/icons-material/LocalFireDepartment';
import Psychology from '@mui/icons-material/Psychology';
import CheckCircle from '@mui/icons-material/CheckCircle';

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    streakDays: 0,
    currentLevel: 1,
    completedConcepts: [],
  });
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [progressRes, _bookmarksRes, _achievementsRes, challengeRes, recommendedRes] = await Promise.allSettled([
          progressService.get(),
          bookmarkService.getBookmarks(),
          achievementService.list(),
          discoveryService.dailyChallenge(),
          user?._id ? discoveryService.recommended({ limit: 4 }) : Promise.reject()
        ]);

        if (progressRes.status === 'fulfilled') {
          const prog = progressRes.value.data?.data || progressRes.value.data || {};
          setProgress({
            streakDays: prog.streakDays || 0,
            currentLevel: prog.currentLevel || 1,
            completedConcepts: prog.completedConcepts || [],
          });
        }

        if (challengeRes.status === 'fulfilled' && challengeRes.value.data) {
          const challenge = challengeRes.value.data?.data || challengeRes.value.data;
          setDailyChallenge(challenge);
        } else {
          setDailyChallenge({
            _id: '1',
            metadata: { concept: 'Load Balancing Algorithms', category: 'Scalability', difficulty: 'intermediate' },
            prompt: 'Explain the difference between Round Robin, Weighted Round Robin, and Least Connection load balancing algorithms. When would you use each?'
          });
        }

        if (recommendedRes.status === 'fulfilled' && recommendedRes.value.data) {
          const recData = recommendedRes.value.data?.data || recommendedRes.value.data || {};
          const recItems = Array.isArray(recData) ? recData : (recData.items || []);
          if (recItems.length > 0) {
            setRecommended(recItems);
          }
        }

      } catch (_err) {
        // Log removed
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="h-12 w-64 bg-white/5 animate-pulse rounded-xl" />
            <div className="h-6 w-80 bg-white/5 animate-pulse rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
            <div className="h-96 bg-white/5 animate-pulse rounded-3xl" />
          </div>
          <div className="space-y-8">
            <div className="h-80 bg-white/5 animate-pulse rounded-3xl" />
            <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 25,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Header with Personalized Greeting */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
            Welcome back, <span className="text-gradient">{user?.username}</span>
          </h1>
          <p className="text-text-muted text-lg font-medium">Your architectural journey is 68% complete. Keep going!</p>
        </div>
        <div className="flex items-center gap-3 glass-morphism px-6 py-3 rounded-2xl border-white/5 shadow-xl">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-text-secondary">System Online</span>
        </div>
      </motion.div>

      {/* Primary Stats Command Center */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Learning Streak"
          value={`${progress.streakDays} Days`}
          icon={<LocalFireDepartment />}
          trend="Keep it up!"
          trendDirection="up"
          color="primary"
        />
        <StatCard
          title="Knowledge Level"
          value={`Lvl ${progress.currentLevel}`}
          icon={<Psychology />}
          trend="+12% this week"
          trendDirection="up"
          color="secondary"
        />
        <StatCard
          title="Concepts Mastered"
          value={progress.completedConcepts?.length || 0}
          icon={<CheckCircle />}
          trend="8 new"
          trendDirection="up"
          color="success"
        />
        <StatCard
          title="XP Earned"
          value={`${(progress.completedConcepts?.length || 0) * 150}`}
          icon={<EmojiEvents />}
          trend="+450 XP"
          trendDirection="up"
          color="primary"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Intelligence & Progress */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          {/* Daily Architecture Challenge */}
          {dailyChallenge && (
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <Psychology className="text-9xl text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    Daily Challenge
                  </span>
                  <span className="text-xs text-text-muted font-bold">200 XP REWARD</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{dailyChallenge.metadata?.concept}</h3>
                <p className="text-text-secondary mb-8 leading-relaxed max-w-2xl">
                  {dailyChallenge.prompt}
                </p>
                <Button 
                  onClick={() => navigate(`/dashboard/concepts/${dailyChallenge._id}`)}
                  className="bg-primary hover:bg-primary-light text-white rounded-xl px-8 py-3 font-bold border-none shadow-lg shadow-primary/20"
                >
                  Accept Challenge
                </Button>
              </div>
            </Card>
          )}

          {/* Smart Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Personalized Insights</h2>
              <Link to="/dashboard/concepts" className="text-sm font-bold text-primary-light hover:text-white transition-colors">View All Blueprints</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommended.slice(0, 2).map((concept) => (
                <ConceptCard 
                  key={concept._id} 
                  concept={concept} 
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Gamification & Activity */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Achievement Progress */}
          <Card className="inner-glow border-primary/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <EmojiEvents className="text-primary" /> Recent Badges
            </h3>
            <div className="space-y-4">
              {[
                { name: 'System Architect', desc: 'Complete 10 concepts', progress: 80, icon: '🏆' },
                { name: 'Consistency King', desc: '7 day streak', progress: 100, icon: '🔥' },
                { name: 'Deep Diver', desc: 'Read 5 advanced docs', progress: 40, icon: '🌊' },
              ].map((ach) => (
                <div key={ach.name} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{ach.name}</div>
                      <div className="text-[10px] text-text-muted uppercase font-black">{ach.desc}</div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ach.progress}%` }}
                      className={`h-full bg-gradient-to-r from-primary to-accent`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => navigate('/dashboard/achievements')}
              className="w-full mt-6 bg-white/5 hover:bg-white/10 border-white/10 rounded-xl py-3 text-xs font-bold"
            >
              View All Achievements
            </Button>
          </Card>

          {/* Activity Timeline Mock */}
          <Card>
            <h3 className="text-lg font-bold mb-6">Activity Timeline</h3>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {[
                { type: 'mastered', title: 'Mastered Load Balancing', time: '2 hours ago', icon: <CheckCircle className="text-success text-sm" /> },
                { type: 'bookmark', title: 'Bookmarked CAP Theorem', time: '5 hours ago', icon: <Bookmark className="text-primary text-sm" /> },
                { type: 'streak', title: '5 Day Streak Achieved!', time: 'Yesterday', icon: <LocalFireDepartment className="text-accent text-sm" /> },
              ].map((activity, idx) => (                <div key={idx} className="flex gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-bg-surface border border-white/10 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{activity.title}</div>
                    <div className="text-[10px] text-text-muted font-medium">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

