export default function DetailList({ items = [] }) {
  return (
    <dl className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
          <dd className="text-base text-slate-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
