export default function TimelineItem({ title, date, description }) {
  return (
    <div className="space-y-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <span className="text-xs uppercase tracking-wide text-slate-500">{date}</span>
      </div>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}
