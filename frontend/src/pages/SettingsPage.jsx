import ToggleSwitch from '../components/common/ToggleSwitch.jsx'

export default function SettingsPage() {
  return (
    <main className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <div className="mt-5 space-y-4">
          <ToggleSwitch checked={true} onChange={() => {}} label="Enable notifications" />
          <ToggleSwitch checked={false} onChange={() => {}} label="Dark mode" />
        </div>
      </div>
    </main>
  )
}
