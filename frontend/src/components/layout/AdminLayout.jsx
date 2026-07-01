import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AdminLayout() {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-bg-app text-white selection:bg-primary/30 relative">
      {/* Background Aurora */}
      <div className="fixed inset-0 aurora-bg -z-10 opacity-50" />

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className={`flex flex-col min-h-screen transition-all duration-500 ${sidebarOpen ? 'lg:pl-[calc(var(--sidebar-width)+2rem)]' : 'lg:pl-[calc(var(--sidebar-collapsed)+2rem)]'} p-6`}>
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic admin page content */}
        <main className="flex-1 mt-32 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {/* Admin console indicator */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary-light border border-primary/20 uppercase tracking-widest shadow-lg shadow-primary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                System Administrator Console
              </span>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
