import React from 'react';

export default function FeatureBadge({ label = 'Featured' }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
      {label}
    </span>
  );
}
