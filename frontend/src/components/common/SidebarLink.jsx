export default function SidebarLink({ label, icon, active = false }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
