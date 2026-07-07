import React from 'react';

export default function FloatingActionButton({ label = 'Add', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-xl transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
      aria-label={label}
    >
      <span className="text-2xl font-bold">+</span>
    </button>
  );
}
