export default function ProgressCircle({ value = 0, size = 64 }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(100, Math.max(0, value))
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="block">
      <circle cx="32" cy="32" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="#2563EB"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-sm font-semibold fill-slate-900">
        {progress}%
      </text>
    </svg>
  )
}
