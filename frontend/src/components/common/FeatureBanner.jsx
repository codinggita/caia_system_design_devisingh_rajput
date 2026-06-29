import React from 'react';

export default function FeatureBanner({ title = 'New feature available', description = 'Explore the latest enhancements to your learning experience.', actionText = 'Learn more', onAction }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">New</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-3 text-sm text-slate-600">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}
