export default function BadgeList({ items = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {item}
        </span>
      ))}
    </div>
  )
}
