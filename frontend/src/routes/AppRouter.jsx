import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute     from './AdminRoute';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';
import UserLayout  from '../components/layout/UserLayout';

// Skeleton fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-[#080d1a]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-slate-400 text-xs font-bold tracking-wider">Loading system...</p>
    </div>
  </div>
);

// Lazy pages
const LoginPage           = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage        = lazy(() => import('../pages/auth/RegisterPage'));
const AdminDashboardPage  = lazy(() => import('../pages/admin/AdminDashboardPage'));
const ConceptsManagePage  = lazy(() => import('../pages/admin/ConceptsManagePage'));
const UsersManagePage     = lazy(() => import('../pages/admin/UsersManagePage'));
const AnalyticsPage       = lazy(() => import('../pages/admin/AnalyticsPage'));
const AuditLogsPage       = lazy(() => import('../pages/admin/AuditLogsPage'));
const SystemStatusPage    = lazy(() => import('../pages/admin/SystemStatusPage'));
const UserDashboardPage   = lazy(() => import('../pages/user/UserDashboardPage'));
const ConceptsExplorePage = lazy(() => import('../pages/user/ConceptsExplorePage'));
const BookmarksPage       = lazy(() => import('../pages/user/BookmarksPage'));
const ProgressPage        = lazy(() => import('../pages/user/ProgressPage'));
const AchievementsPage    = lazy(() => import('../pages/user/AchievementsPage'));
const DiscoveryPage       = lazy(() => import('../pages/user/DiscoveryPage'));
const NotificationsPage   = lazy(() => import('../pages/user/NotificationsPage'));
const ProfilePage         = lazy(() => import('../pages/shared/ProfilePage'));
const SettingsPage        = lazy(() => import('../pages/shared/SettingsPage'));
const ConceptDetailPage   = lazy(() => import('../pages/shared/ConceptDetailPage'));
const NotFoundPage        = lazy(() => import('../pages/NotFoundPage'));
const LandingPage         = lazy(() => import('../pages/LandingPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Root page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard"               element={<UserDashboardPage />} />
              <Route path="/dashboard/concepts"      element={<ConceptsExplorePage />} />
              <Route path="/dashboard/concepts/:id"  element={<ConceptDetailPage />} />
              <Route path="/dashboard/bookmarks"     element={<BookmarksPage />} />
              <Route path="/dashboard/progress"      element={<ProgressPage />} />
              <Route path="/dashboard/achievements"  element={<AchievementsPage />} />
              <Route path="/dashboard/discovery"     element={<DiscoveryPage />} />
              <Route path="/dashboard/notifications" element={<NotificationsPage />} />
              <Route path="/dashboard/profile"       element={<ProfilePage />} />
              <Route path="/dashboard/settings"      element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Admin protected routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"             element={<AdminDashboardPage />} />
              <Route path="/admin/concepts"    element={<ConceptsManagePage />} />
              <Route path="/admin/concepts/:id"element={<ConceptDetailPage />} />
              <Route path="/admin/users"       element={<UsersManagePage />} />
              <Route path="/admin/analytics"   element={<AnalyticsPage />} />
              <Route path="/admin/audit-logs"  element={<AuditLogsPage />} />
              <Route path="/admin/system"      element={<SystemStatusPage />} />
              <Route path="/admin/profile"     element={<ProfilePage />} />
              <Route path="/admin/settings"    element={<SettingsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
