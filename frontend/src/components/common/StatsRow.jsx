export default function StatsRow({ stats = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
          <div className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
