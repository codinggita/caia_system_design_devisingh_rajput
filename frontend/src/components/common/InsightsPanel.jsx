import React from 'react';

export default function InsightsPanel({ title = 'Learning insights', details = [] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Updated</span>
      </div>
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">{detail.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{detail.value}</p>
            {detail.description && <p className="mt-1 text-sm text-slate-500">{detail.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
