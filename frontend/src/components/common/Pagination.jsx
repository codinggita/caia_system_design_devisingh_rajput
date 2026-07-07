
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Button from './Button';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  disabled = false,
}) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate page numbers to display
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <Button
        variant="ghost"
        disabled={currentPage === 1 || disabled}
        onClick={handlePrev}
        className="px-2.5 py-1.5"
      >
        <ChevronLeft fontSize="small" />
      </Button>

      {/* Numerical Page Buttons */}
      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={disabled}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
            currentPage === page
              ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-md shadow-amber-500/15'
              : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:text-slate-100 hover:bg-slate-700'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <Button
        variant="ghost"
        disabled={currentPage === totalPages || disabled}
        onClick={handleNext}
        className="px-2.5 py-1.5"
      >
        <ChevronRight fontSize="small" />
      </Button>
    </div>
  );
}

