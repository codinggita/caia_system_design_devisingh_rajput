import React from 'react';

export default function Modal({ title, children, onClose, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
