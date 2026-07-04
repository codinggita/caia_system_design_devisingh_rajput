import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import { bookmarkService, voteService } from '../../services/bookmarkService';
import Bookmark from '@mui/icons-material/Bookmark';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbUpOutlined from '@mui/icons-material/ThumbUpOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import toast from 'react-hot-toast';

export default function ConceptCard({
  concept,
  isInitiallyBookmarked = false,
  onBookmarkToggle = null,
}) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
  const [currentVotes, setCurrentVotes] = useState(concept.votesCount || { up: 0, down: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const conceptId = concept._id;
  const title = concept.metadata?.concept || 'System Design Concept';
  const category = concept.metadata?.category || 'Foundations';
  const difficulty = concept.metadata?.difficulty || 'beginner';
  const netVotes = (currentVotes?.up || 0) - (currentVotes?.down || 0);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to bookmark concepts.');
      return;
    }
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(conceptId);
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await bookmarkService.addBookmark(conceptId);
        setIsBookmarked(true);
        toast.success('Concept bookmarked!');
      }
      if (onBookmarkToggle) {
        onBookmarkToggle(conceptId, !isBookmarked);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleVoteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to vote.');
      return;
    }
    try {
      let res;

      if (hasVoted) {
        res = await voteService.removeVote(conceptId);
        setHasVoted(false);
        toast.success('Vote removed');
      } else {
        res = await voteService.vote(conceptId, 'up');
        setHasVoted(true);
        toast.success('Concept upvoted!');
      }

      if (res.data?.data?.votesCount) {
        setCurrentVotes(res.data.data.votesCount);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit vote');
    }
  };

  const handleCardClick = () => {
    const basePath = isAdmin ? '/admin/concepts' : '/dashboard/concepts';
    navigate(`${basePath}/${conceptId}`);
  };

  return (
    <Card
      hoverable
      onClick={handleCardClick}
      className="flex flex-col h-full justify-between bg-white/5 border-white/5 hover:border-primary/30 premium-shadow group overflow-hidden"
      padding="p-0"
    >
      <div className="p-6 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${difficulty === 'advanced' ? 'bg-danger' : difficulty === 'intermediate' ? 'bg-secondary' : 'bg-success'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{difficulty}</span>
          </div>
          <button 
            onClick={handleBookmarkClick}
            disabled={bookmarkLoading}
            className={`p-2 rounded-xl transition-all duration-300 ${isBookmarked ? 'bg-primary/20 text-primary-light' : 'text-text-muted hover:bg-white/5'}`}
          >
            {isBookmarked ? <Bookmark className="text-xl" /> : <BookmarkBorder className="text-xl" />}
          </button>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors duration-300 mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
            {concept.prompt}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {concept.metadata?.technologies?.slice(0, 3).map(tech => (
            <span key={tech} className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              {tech}
            </span>
          ))}
          <span className="px-2 py-1 rounded-lg bg-primary/5 text-primary-light text-[9px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </div>
      </div>

      {/* Footer Details */}
      <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleVoteClick}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${hasVoted ? 'text-primary-light' : 'text-text-muted hover:text-white'}`}
          >
            {hasVoted ? <ThumbUp className="text-sm" /> : <ThumbUpOutlined className="text-sm" />}
            {netVotes}
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
             <span className="w-1.5 h-1.5 rounded-full bg-text-muted/30" />
             8 min read
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
          <ArrowForward className="text-sm text-primary-light" />
        </div>
      </div>
    </Card>
  );
}

