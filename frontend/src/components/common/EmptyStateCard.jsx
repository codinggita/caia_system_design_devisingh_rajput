export default function EmptyStateCard({ title, message }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm text-slate-600">{message}</p>
    </div>
  )
}
