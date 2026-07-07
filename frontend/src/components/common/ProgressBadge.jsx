export default function ProgressBadge({ label, percentage }) {
  return (
    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
      {label} • {percentage}%
    </div>
  )
}
