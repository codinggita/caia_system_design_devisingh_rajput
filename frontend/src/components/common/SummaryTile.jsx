export default function SummaryTile({ title, value, label }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  )
}
