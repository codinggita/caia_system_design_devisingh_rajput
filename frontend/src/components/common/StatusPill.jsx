export default function StatusPill({ label, variant = 'neutral' }) {
  const styles = {
    neutral: 'bg-slate-100 text-slate-700',
    active: 'bg-blue-100 text-blue-700',
    offline: 'bg-rose-100 text-rose-700',
    completed: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles[variant]}`}>
      {label}
    </span>
  )
}
