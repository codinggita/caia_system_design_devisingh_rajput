import React from 'react';

export default function ResourceLink({ title, href, label = 'Open resource' }) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 transition hover:border-slate-300 hover:bg-white"
      target="_blank"
      rel="noreferrer"
    >
      <div>
        <p className="text-sm font-medium text-slate-500">Resource</p>
        <h3 className="mt-1 text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <span className="text-sm font-semibold text-sky-600 group-hover:text-sky-700">{label}</span>
    </a>
  );
}
