import React from 'react';

export default function OnboardingStep({ step, title, description, completed }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-xl font-bold text-white">
          {step}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-4 text-sm font-medium text-slate-600">
        {completed ? 'Completed' : 'In progress'}
      </div>
    </div>
  );
}
