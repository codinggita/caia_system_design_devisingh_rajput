import React from 'react';

export default function ResourcePreview({ title, description, url }) {
  return (
    <a
      href={url}
      className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      target="_blank"
      rel="noreferrer"
    >
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <p className="mt-4 text-sm font-semibold text-sky-600">Open resource</p>
    </a>
  );
}
