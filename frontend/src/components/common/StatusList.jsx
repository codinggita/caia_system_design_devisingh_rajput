export default function StatusList({ items = [] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">{item.label}</div>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>
            <span className="text-sm font-semibold text-slate-700">{item.status}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
