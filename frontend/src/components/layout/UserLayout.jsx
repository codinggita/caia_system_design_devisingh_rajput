import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function UserLayout() {
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

        {/* Dynamic page content */}
        <main className="flex-1 mt-32 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
