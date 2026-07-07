import React from 'react';

export default function FeatureSpotlight({ title, description, linkText, onLinkClick }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
        <button
          type="button"
          onClick={onLinkClick}
          className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          {linkText}
        </button>
      </div>
    </article>
  );
}
