import ProfileBadge from '../components/common/ProfileBadge.jsx'
import StatusPill from '../components/common/StatusPill.jsx'

export default function ProfilePage() {
  return (
    <main className="space-y-6 p-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <ProfileBadge name="Aditi Shah" role="Student" avatar="https://i.pravatar.cc/100" />
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Status</h2>
              <p className="text-sm text-slate-500">Your current learning progress</p>
            </div>
            <StatusPill label="Active" variant="active" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">Achievements and profile details.</div>
            <div className="rounded-3xl bg-slate-50 p-4">Preferences and settings summary.</div>
          </div>
        </div>
      </div>
    </main>
  )
}
