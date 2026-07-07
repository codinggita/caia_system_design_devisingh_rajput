import React from 'react';

export default function QuickNav({ links = [] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Quick navigation</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
