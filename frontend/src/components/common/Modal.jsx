import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Close } from '@mui/icons-material';

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg', // max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-2xl, max-w-4xl
}) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className={`modal-content ${maxWidth} relative w-full flex flex-col`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/60 bg-slate-900/40 rounded-t-2xl">
          {title && <h3 className="text-lg font-bold text-slate-100">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-700/50 transition-colors"
          >
            <Close fontSize="small" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

