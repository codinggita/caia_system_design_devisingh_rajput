export default function FilterMenu({ filters = [], active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onSelect(filter)}
          className={`rounded-full px-4 py-2 text-sm transition ${active === filter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          {filter}
        </button>
      ))}
    </div>
  )
}
