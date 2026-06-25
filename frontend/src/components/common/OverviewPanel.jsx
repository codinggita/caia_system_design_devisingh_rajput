export default function OverviewPanel({ title, children }) {
  return (
    <section className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
