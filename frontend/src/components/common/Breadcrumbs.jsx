export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-400">/</span>}
            {item.href ? (
              <a href={item.href} className="text-slate-600 hover:text-slate-900">
                {item.label}
              </a>
            ) : (
              <span className="font-medium text-slate-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
