export default function InlineAlert({ message, variant = 'info' }) {
  const styles = {
    info: 'bg-slate-100 text-slate-900 border-slate-200',
    success: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    warning: 'bg-amber-100 text-amber-900 border-amber-200',
    danger: 'bg-red-100 text-red-900 border-red-200',
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[variant]}`}>
      {message}
    </div>
  )
}
