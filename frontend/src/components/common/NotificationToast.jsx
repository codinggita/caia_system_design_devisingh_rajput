export default function NotificationToast({ message, type = 'info' }) {
  const styles = {
    info: 'bg-slate-50 text-slate-900 border-slate-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    danger: 'bg-rose-50 text-rose-900 border-rose-200',
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${styles[type]}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
