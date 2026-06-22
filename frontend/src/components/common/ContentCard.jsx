export default function ContentCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-slate-700">{children}</div>
    </div>
  )
}
