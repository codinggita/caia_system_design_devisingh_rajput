import React from 'react';

export default function SkeletonLoader({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`}>
      <div className="h-5 rounded bg-slate-300"></div>
      <div className="mt-3 h-4 rounded bg-slate-300"></div>
      <div className="mt-3 h-4 rounded bg-slate-300"></div>
    </div>
  );
}
