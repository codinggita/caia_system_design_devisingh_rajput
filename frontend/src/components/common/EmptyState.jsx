
import { Inbox } from '@mui/icons-material';

export default function EmptyState({
  title = 'No Data Available',
  message = 'There is nothing here at the moment.',
  icon = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-800/40 border border-slate-700/40 rounded-2xl w-full">
      <div className="text-slate-500 mb-3.5">
        {icon || <Inbox style={{ fontSize: 48 }} className="opacity-40" />}
      </div>
      <h3 className="text-base font-bold text-slate-300 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{message}</p>
    </div>
  );
}

