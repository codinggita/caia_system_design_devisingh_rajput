import React from 'react';

export default function ActivityFeed({ items = [] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
      <ul className="mt-4 space-y-4">
        {items.map((item, index) => (
          <li key={index} className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-700">{item.description}</p>
            <p className="mt-1 text-xs text-slate-500">{item.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
