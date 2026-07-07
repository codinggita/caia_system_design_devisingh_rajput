import { useEffect, useState } from 'react';
import LocalFireDepartment from '@mui/icons-material/LocalFireDepartment';
import Psychology from '@mui/icons-material/Psychology';
import BarChart from '@mui/icons-material/BarChart';
import Explore from '@mui/icons-material/Explore';
import { motion } from 'framer-motion';
import { progressService } from '../../services/userServices';
import { conceptService } from '../../services/conceptService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ProgressPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    streakDays: 0,
    currentLevel: 1,
    completedConcepts: [],
  });
  const [allConceptsCount, setAllConceptsCount] = useState(0);

  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      try {
        const [progressRes, conceptsRes] = await Promise.allSettled([
          progressService.get(),
          conceptService.list({ limit: 1 })
        ]);

        if (progressRes.status === 'fulfilled') {
          const resData = progressRes.value.data?.data || progressRes.value.data || {};
          setProgress({
            streakDays: resData.streakDays || 0,
            currentLevel: resData.currentLevel || 1,
            completedConcepts: Array.isArray(resData.completedConcepts) ? resData.completedConcepts : [],
          });
        }

        if (conceptsRes.status === 'fulfilled') {
          const resData = conceptsRes.value.data?.data || conceptsRes.value.data || {};
          const total = resData.pagination?.total || resData.total || 0;
          setAllConceptsCount(total);
        }
      } catch (err) {
        toast.error('Failed to load progress details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="h-12 w-64 bg-white/5 animate-pulse rounded-xl" />
            <div className="h-6 w-80 bg-white/5 animate-pulse rounded-lg" />
          </div>
          <div className="h-14 w-48 bg-white/5 animate-pulse rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-80 bg-white/5 animate-pulse rounded-3xl" />
          <div className="md:col-span-2 h-80 bg-white/5 animate-pulse rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-white/5 animate-pulse rounded-3xl" />
          <div className="h-96 bg-white/5 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  const completedCount = progress.completedConcepts.length;
  const completionPercent = Math.min(100, Math.round((completedCount / (allConceptsCount || 1)) * 100));

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
            Architecture <span className="text-gradient">Progress</span>
          </h1>
          <p className="text-text-muted text-lg font-medium">Detailed breakdown of your system design mastery.</p>
        </div>
        <div className="flex items-center gap-3 glass-morphism px-6 py-3 rounded-2xl border-white/5 shadow-xl">
          <BarChart className="text-primary-light" />
          <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Level {progress.currentLevel} Senior Engineer</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="flex flex-col items-center justify-center p-10 text-center inner-glow group">
           <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary-light flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-primary/10">
              <LocalFireDepartment className="text-4xl" />
           </div>
           <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-2">Current Streak</h3>
           <p className="text-5xl font-black text-white tracking-tighter">{progress.streakDays} Days</p>
           <div className="mt-6 flex gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`w-2 h-8 rounded-full ${i < progress.streakDays % 7 ? 'bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'bg-white/5'}`} />
              ))}
           </div>
        </Card>

        <Card className="lg:col-span-2 p-10 flex flex-col justify-center">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-2xl font-bold mb-1">Mastery Completion</h3>
                 <p className="text-text-muted text-sm">Overall progress across all architectural domains.</p>
              </div>
              <div className="text-4xl font-black text-primary-light">{completionPercent}%</div>
           </div>
           
           <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-8">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              />
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Completed', value: completedCount, color: 'text-primary' },
                { label: 'Remaining', value: Math.max(0, allConceptsCount - completedCount), color: 'text-text-muted' },
                { label: 'Total XP', value: completedCount * 150, color: 'text-secondary' },
                { label: 'Rank', value: 'Top 5%', color: 'text-success' },
              ].map(stat => (
                <div key={stat.label}>
                   <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</div>
                   <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
           </div>
        </Card>
      </div>

      {/* Domain Mastery Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-10">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
               <Psychology className="text-primary" /> Domain Mastery
            </h3>
            <div className="space-y-8">
               {[
                 { domain: 'Distributed Systems', progress: 75, color: 'bg-primary' },
                 { domain: 'Databases & Storage', progress: 45, color: 'bg-secondary' },
                 { domain: 'Cloud Architecture', progress: 90, color: 'bg-success' },
                 { domain: 'Security & Auth', progress: 30, color: 'bg-danger' },
               ].map(item => (
                 <div key={item.domain} className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                       <span>{item.domain}</span>
                       <span className="text-text-muted">{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          className={`h-full ${item.color}`}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
               <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 mx-auto">
                  <Explore className="text-5xl text-primary-light" />
               </div>
               <h3 className="text-2xl font-bold mb-4">Next Milestone</h3>
               <p className="text-text-muted mb-8 max-w-xs mx-auto">
                  Master 5 more concepts in <span className="text-white font-bold">Databases</span> to unlock the <span className="text-primary-light font-bold">"Data Architect"</span> badge.
               </p>
               <Button 
                  onClick={() => navigate('/dashboard/concepts')}
                  className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl font-bold border-none"
               >
                  Continue Journey
               </Button>
            </div>
         </Card>
      </div>

      {/* Activity Timeline or Knowledge Graph Mockup */}
      <Card className="p-10 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_70%)]">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
               <h3 className="text-2xl font-bold">Mastery Timeline</h3>
               <p className="text-text-muted">Visual historical data of your learning activity.</p>
            </div>
            <div className="flex gap-2">
               {['Week', 'Month', 'Year'].map(t => (
                 <button key={t} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${t === 'Month' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-text-muted hover:text-white'}`}>
                   {t}
                 </button>
               ))}
            </div>
         </div>
         
         {/* Mock Graph Visualization */}
         <div className="h-64 flex items-end justify-between gap-4 pt-10 px-4">
            {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                 <div className="w-full relative">
                    <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       className="w-full bg-gradient-to-t from-primary/20 via-primary/60 to-primary rounded-t-xl group-hover:to-accent transition-all duration-300 relative"
                    >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                       </div>
                    </motion.div>
                 </div>
                 <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter opacity-50 group-hover:opacity-100">Day {i+1}</span>
              </div>
            ))}
         </div>
      </Card>
    </div>
  );
}

