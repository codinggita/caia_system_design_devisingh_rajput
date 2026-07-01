
import Modal from '../common/Modal';
import ReactMarkdown from 'react-markdown';
import { DIFFICULTY_COLORS } from '../../utils/constants';

export default function ConceptModal({
  open,
  onClose,
  concept,
}) {
  if (!concept) return null;

  const title = concept.metadata?.concept || 'Concept Detail';
  const difficulty = concept.metadata?.difficulty || 'beginner';
  const category = concept.metadata?.category || 'Foundations';
  const difficultyClass = DIFFICULTY_COLORS[difficulty] || 'badge-slate';

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap border-b border-slate-700/60 pb-4">
          <span className={`badge ${difficultyClass} capitalize`}>
            {difficulty}
          </span>
          <span className="badge badge-amber capitalize">
            {category}
          </span>
          {concept.metadata?.subcategory && (
            <span className="badge badge-slate capitalize">
              {concept.metadata.subcategory}
            </span>
          )}
        </div>

        {/* Prompt Section */}
        <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Question / Prompt</h4>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{concept.prompt}</p>
        </div>

        {/* Response Section */}
        <div className="markdown-content">
          <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 border-b border-slate-700/40 pb-2">
            Explanation Response
          </h4>
          <ReactMarkdown>{concept.response}</ReactMarkdown>
        </div>
      </div>
    </Modal>
  );
}

