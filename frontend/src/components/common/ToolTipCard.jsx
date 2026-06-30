import React from 'react';

export default function ToolTipCard({ title, content }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm text-slate-600">{content}</p>
    </div>
  );
}
