export default function ProfileBadge({ name, role, avatar }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2">
      <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
      <div>
        <div className="text-sm font-semibold text-slate-900">{name}</div>
        <div className="text-xs text-slate-600">{role}</div>
      </div>
    </div>
  )
}
