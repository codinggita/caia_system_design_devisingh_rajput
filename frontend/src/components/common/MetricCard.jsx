export default function MetricCard({ label, value, change }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
      {change ? <div className="mt-2 text-sm text-slate-600">{change}</div> : null}
    </div>
  )
}
