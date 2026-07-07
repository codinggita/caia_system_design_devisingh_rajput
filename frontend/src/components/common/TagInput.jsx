export default function TagInput({ tags = [], onAdd, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-3">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
          {tag}
          <button type="button" onClick={() => onRemove(tag)} className="text-slate-400 hover:text-slate-600">×</button>
        </span>
      ))}
      <button type="button" onClick={onAdd} className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700">
        Add tag
      </button>
    </div>
  )
}
