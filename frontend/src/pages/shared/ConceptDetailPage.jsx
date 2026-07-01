import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { conceptService } from '../../services/conceptService';
import { bookmarkService, voteService } from '../../services/bookmarkService';
import { progressService } from '../../services/userServices';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkBorder,
  ThumbUp,
  ThumbDown,
  CheckCircle,
  CheckCircleOutlined,
  ArrowBack,
  EditNote,
  DeleteOutlined,
  Psychology
} from '@mui/icons-material';
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

export default function ConceptDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interaction States
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentVotes, setCurrentVotes] = useState({ up: 0, down: 0 });
  const [myVote, setMyVote] = useState(null); // 'up' | 'down' | null
  const [isCompleted, setIsCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  const netVotes = (currentVotes?.up || 0) - (currentVotes?.down || 0);

  // Note States
  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);

  const fetchConceptAndUserData = useCallback(async () => {
    setLoading(true);
    try {
      const conceptRes = await conceptService.getById(id);
      const conceptData = conceptRes.data?.data || conceptRes.data || {};
      setConcept(conceptData);
      setCurrentVotes(conceptData.votesCount || { up: 0, down: 0 });

      const [bookmarksRes, notesRes, progressRes] = await Promise.allSettled([
        bookmarkService.getBookmarks(),
        bookmarkService.getNotes(),
        progressService.get(),
      ]);

      if (bookmarksRes.status === 'fulfilled') {
        const resData = bookmarksRes.value.data?.data || bookmarksRes.value.data || {};
        const bookmarksList = Array.isArray(resData) ? resData : (resData.items || []);
        const bookmarked = bookmarksList.some(bm => {
          const cid = bm.concept?._id || bm.concept || bm._id;
          return cid === id;
        });
        setIsBookmarked(bookmarked);
      }

      if (notesRes.status === 'fulfilled') {
        const notesList = notesRes.value.data?.items || notesRes.value.data || [];
        const existingNote = notesList.find(n => {
          const cid = n.concept?._id || n.concept || n._id;
          return cid === id;
        });
        if (existingNote) {
          setNoteContent(existingNote.content || '');
        }
      }

      if (progressRes.status === 'fulfilled') {
        const prog = progressRes.value.data?.data || progressRes.value.data || {};
        setUserProgress(prog);
        const completed = prog.completedConcepts?.includes(id);
        setIsCompleted(completed);
      }

    } catch (_err) {
      toast.error('Failed to load concept details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConceptAndUserData();
  }, [fetchConceptAndUserData]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(id);
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await bookmarkService.addBookmark(id);
        setIsBookmarked(true);
        toast.success('Concept bookmarked!');
      }
    } catch (_err) {
      toast.error('Failed to update bookmark status');
    }
  };

  const handleVote = async (type) => {
    try {
      if (myVote === type) {
        // Toggle off if clicking the same type
        const res = await voteService.removeVote(id);
        setMyVote(null);
        if (res.data?.data?.votesCount) {
          setCurrentVotes(res.data.data.votesCount);
        }
        toast.success('Vote removed');
      } else {
        const res = await voteService.vote(id, type);
        if (res.data?.data?.votesCount) {
          setCurrentVotes(res.data.data.votesCount);
        }
        setMyVote(type);
        toast.success(`Concept ${type}voted!`);
      }
    } catch (_err) {
      toast.error('Failed to submit vote');
    }
  };

  const handleMarkCompleted = async () => {
    if (isCompleted) return;
    try {
      const currentList = userProgress?.completedConcepts || [];
      const updatedList = [...currentList, id];
      
      await progressService.update({
        completedConcepts: updatedList,
        streakDays: (userProgress?.streakDays || 0) + 1,
      });

      setIsCompleted(true);
      toast.success('Concept completed! Level progression updated.');
    } catch (_err) {
      toast.error('Failed to mark concept complete');
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }
    setNoteSaving(true);
    try {
      await bookmarkService.upsertNote(id, { content: noteContent });
      setIsEditingNote(false);
      toast.success('Note saved!');
    } catch (_err) {
      toast.error('Failed to save note');
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    try {
      await bookmarkService.deleteNote(id);
      setNoteContent('');
      toast.success('Note deleted');
    } catch (_err) {
      toast.error('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="h-10 w-48 bg-white/5 animate-pulse rounded-xl" />
          <div className="flex gap-3">
            <div className="h-12 w-12 bg-white/5 animate-pulse rounded-2xl" />
            <div className="h-12 w-32 bg-white/5 animate-pulse rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-32 bg-white/5 animate-pulse rounded-3xl" />
            <div className="h-96 bg-white/5 animate-pulse rounded-3xl" />
          </div>
          <div className="space-y-8">
            <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
            <div className="h-64 bg-white/5 animate-pulse rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-slate-400">Blueprint not found</h3>
        <Button onClick={() => navigate(-1)} className="mt-4 px-5 py-2.5">Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Top Header & Navigation */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-white transition-all group"
        >
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:translate-x-[-4px] transition-all">
            <ArrowBack className="text-xl" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Return to Explorer</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBookmarkToggle}
            className={`p-3 rounded-2xl border transition-all duration-300 ${
              isBookmarked
                ? 'bg-primary/20 text-primary-light border-primary/30 shadow-lg shadow-primary/10'
                : 'bg-white/5 text-text-muted border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </button>
          
          <div className="flex items-center glass-morphism rounded-2xl border-white/5 p-1 shadow-xl">
            <button
              onClick={() => handleVote('up')}
              className={`p-2 rounded-xl transition-all ${
                myVote === 'up' ? 'bg-success/20 text-success' : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <ThumbUp />
            </button>
            <span className="px-4 text-sm font-black text-white">{netVotes}</span>
            <button
              onClick={() => handleVote('down')}
              className={`p-2 rounded-xl transition-all ${
                myVote === 'down' ? 'bg-danger/20 text-danger' : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <ThumbDown />
            </button>
          </div>

          <Button
            onClick={handleMarkCompleted}
            disabled={isCompleted}
            className={`rounded-2xl px-8 py-3 font-black text-sm uppercase tracking-widest border-none ${
              isCompleted
                ? 'bg-success/20 text-success cursor-default'
                : 'bg-primary hover:bg-primary-light text-white shadow-xl shadow-primary/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCompleted ? <CheckCircle /> : <CheckCircleOutlined />}
              {isCompleted ? 'Blueprint Mastered' : 'Mark as Mastered'}
            </div>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary-light text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                {concept.metadata?.category || 'General Architecture'}
              </span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${
                concept.metadata?.difficulty === 'advanced' ? 'bg-danger/10 text-danger border-danger/20' : 
                concept.metadata?.difficulty === 'intermediate' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                'bg-success/10 text-success border-success/20'
              }`}>
                {concept.metadata?.difficulty || 'Beginner'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
              {concept.metadata?.concept || 'System Design Concept'}
            </h1>

            <Card className="p-10 bg-white/5 border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none">
                  <Psychology className="text-[200px] text-primary" />
               </div>
               <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-text-secondary prose-p:leading-relaxed prose-strong:text-primary-light prose-code:text-secondary">
                  <ReactMarkdown>{concept.response || concept.prompt}</ReactMarkdown>
               </div>
            </Card>
          </motion.div>

          {/* Discussion / Comments Placeholder */}
          <motion.div variants={itemVariants} className="pt-10 border-t border-white/5">
             <h3 className="text-2xl font-bold mb-8">Architectural Insights</h3>
             <div className="space-y-6">
                <Card className="p-6 bg-white/5 border-white/5 flex gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-primary/20 flex-shrink-0" />
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-bold text-white">System Intelligence</span>
                         <span className="text-[10px] font-black text-text-muted uppercase">2026 AI Insight</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                         This architecture is highly effective for large-scale distributed systems. 
                         Consider the trade-offs between eventual consistency and strict availability 
                         when implementing this pattern in a high-concurrency environment.
                      </p>
                   </div>
                </Card>
             </div>
          </motion.div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-4 space-y-10">
          {/* Personal Engineering Notes */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border-primary/10 inner-glow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <EditNote className="text-primary" /> Engineering Notes
                </h3>
                {noteContent && !isEditingNote && (
                  <button 
                    onClick={() => setIsEditingNote(true)}
                    className="text-xs font-bold text-primary-light hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-4">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Document your thoughts on this architecture..."
                    className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-text-muted outline-none focus:border-primary/50 transition-all resize-none"
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSaveNote} 
                      loading={noteSaving}
                      className="flex-1 bg-primary hover:bg-primary-light py-3"
                    >
                      Commit Note
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEditingNote(false)}
                      className="px-4 py-3"
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              ) : noteContent ? (
                <div className="space-y-6">
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    "{noteContent}"
                  </p>
                  <button 
                    onClick={handleDeleteNote}
                    className="flex items-center gap-2 text-[10px] font-black text-danger uppercase tracking-widest hover:opacity-80 transition-opacity"
                  >
                    <DeleteOutlined className="text-sm" /> Purge Note
                  </button>
                </div>
              ) : (
                <div className="text-center py-10">
                   <EditNote className="text-5xl text-text-muted opacity-20 mb-4" />
                   <p className="text-xs text-text-muted font-medium mb-6">No internal notes for this blueprint yet.</p>
                   <Button 
                      onClick={() => setIsEditingNote(true)}
                      className="w-full bg-white/5 hover:bg-white/10 border-white/10 py-3 text-[10px] font-black uppercase tracking-widest"
                   >
                      Initialize Note
                   </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Metadata Panel */}
          <motion.div variants={itemVariants}>
             <Card className="p-8 space-y-8">
                <div>
                   <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Core Technologies</h3>
                   <div className="flex flex-wrap gap-2">
                      {concept.metadata?.technologies?.map(tech => (
                        <span key={tech} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-text-secondary">
                          {tech}
                        </span>
                      ))}
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Blueprint Intel</h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-text-muted font-medium">Reading Complexity</span>
                         <span className="text-xs text-white font-bold">{concept.metadata?.difficulty || 'Normal'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-text-muted font-medium">Estimated Time</span>
                         <span className="text-xs text-white font-bold">12 minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-text-muted font-medium">Community Rating</span>
                         <span className="text-xs text-success font-bold">98% Positive</span>
                      </div>
                   </div>
                </div>
             </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

