import React from 'react';

export default function Input({ label, value, onChange, type = 'text', placeholder = '', className = '' }) {
  return (
    <label className="block space-y-1 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
      />
    </label>
  );
}
