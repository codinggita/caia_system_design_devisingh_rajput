export default function DataCard({ label, value, footnote }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
      {footnote ? <div className="mt-2 text-xs text-slate-500">{footnote}</div> : null}
    </div>
  )
}
