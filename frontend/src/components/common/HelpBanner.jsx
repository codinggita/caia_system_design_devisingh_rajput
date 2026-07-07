export default function HelpBanner({ title, description }) {
  return (
    <div className="rounded-3xl bg-slate-900 px-6 py-5 text-white shadow-sm">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
    </div>
  )
}
