export default function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30">
      <div className="rounded-3xl bg-white px-6 py-5 text-center shadow-xl">
        <p className="text-sm font-semibold text-slate-900">{message}</p>
      </div>
    </div>
  )
}
