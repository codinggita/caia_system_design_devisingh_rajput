import React from 'react';

export default function NotificationCard({ title, message, time }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{time}</span>
      </div>
    </div>
  );
}
