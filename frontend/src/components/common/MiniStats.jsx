export default function MiniStats({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  )
}
