import React from 'react';

export default function CourseCard({ title, instructor, progress }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">Instructor: {instructor}</p>
      <div className="mt-4 rounded-full bg-slate-100 p-1">
        <div className="h-2 rounded-full bg-sky-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-sm font-medium text-slate-700">{progress}% complete</p>
    </div>
  );
}
