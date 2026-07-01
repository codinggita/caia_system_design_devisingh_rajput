
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { ErrorOutlined, ArrowBack } from '@mui/icons-material';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 text-center">
      <div className="text-amber-500 mb-4 animate-bounce">
        <ErrorOutlined style={{ fontSize: 72 }} />
      </div>
      
      <h1 className="text-4xl font-black text-slate-100 tracking-wider">404</h1>
      <h2 className="text-lg font-bold text-slate-300 mt-2">Page Not Found</h2>
      
      <p className="text-slate-500 text-sm max-w-sm mt-3 leading-relaxed">
        The route you are trying to view does not exist or has been archived. Check spelling or return home.
      </p>

      <Button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2.5 font-bold text-slate-950"
      >
        <ArrowBack fontSize="small" />
        Return to Dashboard
      </Button>
    </div>
  );
}

