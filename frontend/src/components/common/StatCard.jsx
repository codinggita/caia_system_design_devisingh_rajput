import React from 'react';

export default function StatCard({ label, value, change, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {change && <p className="mt-1 text-sm text-green-600">{change}</p>}
    </div>
  );
}
