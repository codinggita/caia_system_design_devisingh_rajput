export default function TableSkeleton({ rows = 4, columns = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-3 rounded-xl bg-slate-100 p-4 md:grid-cols-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-8 rounded-lg bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  )
}
