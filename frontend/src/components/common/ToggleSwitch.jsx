export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </label>
  )
}
