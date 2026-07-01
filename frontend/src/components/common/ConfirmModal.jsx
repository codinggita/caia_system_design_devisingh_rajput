
import Modal from './Modal';
import Button from './Button';
import { WarningAmber } from '@mui/icons-material';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger', // danger, success, primary
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/10 text-rose-500`}>
          <WarningAmber fontSize="large" />
        </div>
        
        <div>
          <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center gap-3 w-full mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5"
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

