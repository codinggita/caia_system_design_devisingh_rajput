import React from 'react';

export default function LearningPathCard({ title, description, steps }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">{index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
