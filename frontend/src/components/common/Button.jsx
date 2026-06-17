import React from 'react';

export default function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    >
      {children}
    </button>
  );
}
