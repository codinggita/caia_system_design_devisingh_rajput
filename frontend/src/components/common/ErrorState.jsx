import { Warning, Refresh } from '@mui/icons-material';
import Button from './Button';

export default function ErrorState({
  title = 'System Interruption',
  message = 'We encountered an error while processing your request. Our engineering team has been notified.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center glass-morphism border-danger/20 rounded-[2rem] w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
        <Warning className="text-9xl text-danger" />
      </div>
      
      <div className="w-20 h-20 rounded-3xl bg-danger/10 text-danger flex items-center justify-center mb-6 border border-danger/20 shadow-lg shadow-danger/10">
        <Warning className="text-4xl" />
      </div>
      
      <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{title}</h3>
      <p className="text-text-muted text-sm font-medium max-w-sm mb-8 leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          variant="danger" 
          onClick={onRetry} 
          className="rounded-2xl px-8 py-3 flex items-center gap-2 group"
        >
          <Refresh className="text-lg group-hover:rotate-180 transition-transform duration-500" />
          Reconnect System
        </Button>
      )}
    </div>
  );
}

