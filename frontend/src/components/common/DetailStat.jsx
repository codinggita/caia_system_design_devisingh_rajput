import React from 'react';

export default function DetailStat({ label, value, unit }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
        {unit && <span className="ml-1 text-base font-medium text-slate-500">{unit}</span>}
      </p>
    </div>
  );
}
