import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm ${className}`}>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm text-slate-900 outline-none"
      />
    </div>
  );
}
