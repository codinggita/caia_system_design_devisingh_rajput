import React from 'react';

export default function Pagination({ currentPage, pageCount, onPageChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full px-3 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Prev
      </button>
      <span className="px-3 text-sm text-slate-600">{currentPage} / {pageCount}</span>
      <button
        disabled={currentPage >= pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full px-3 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Next
      </button>
    </div>
  );
}
