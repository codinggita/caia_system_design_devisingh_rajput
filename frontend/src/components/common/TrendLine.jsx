import React from 'react';

export default function TrendLine({ label, trend, change }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{trend}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {change >= 0 ? `+${change}%` : `${change}%`}
        </span>
      </div>
    </div>
  );
}
