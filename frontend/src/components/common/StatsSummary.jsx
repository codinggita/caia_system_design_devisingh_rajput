import React from 'react';

export default function StatsSummary({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
          {item.description && <p className="mt-2 text-sm text-slate-500">{item.description}</p>}
        </div>
      ))}
    </div>
  );
}
