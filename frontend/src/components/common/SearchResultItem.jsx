export default function SearchResultItem({ title, description, url }) {
  return (
    <a href={url} className="block rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 transition hover:border-blue-400 hover:bg-blue-50">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-3 text-xs text-blue-600">{url}</p>
    </a>
  )
}
