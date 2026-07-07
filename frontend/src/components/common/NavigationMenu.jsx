import SidebarLink from './SidebarLink.jsx'

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
]

export default function NavigationMenu({ activePage, onChange }) {
  return (
    <aside className="hidden w-60 flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex">
      <div className="mb-4 border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">CAIA</h2>
        <p className="mt-1 text-sm text-slate-500">Learning platform</p>
      </div>
      {pages.map((page) => (
        <SidebarLink
          key={page.id}
          label={page.label}
          active={activePage === page.id}
          icon={<span className="inline-block h-2 w-2 rounded-full bg-slate-900" />}
          onClick={() => onChange(page.id)}
        />
      ))}
    </aside>
  )
}
