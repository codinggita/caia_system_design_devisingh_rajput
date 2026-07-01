
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        {/* Toast Alerts Notification System */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(12px)',
              color: '#FFFFFF',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#0F172A',
              },
            },
            error: {
              iconTheme: {
                primary: '#F43F5E',
                secondary: '#0F172A',
              },
            },
          }}
        />
        
        {/* Application Router */}
        <AppRouter />
      </HelmetProvider>
    </Provider>
  );
}

