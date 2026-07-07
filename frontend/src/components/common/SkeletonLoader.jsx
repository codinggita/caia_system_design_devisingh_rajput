

export default function SkeletonLoader({
  type = 'card', // card, table, list, text, stat
  count = 3,
  rows = 4,
  cols = 4,
}) {
  const renderCardSkeletons = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="h-6 bg-white/10 rounded-xl w-3/4" />
              <div className="h-8 w-8 bg-white/10 rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-white/10 rounded-full w-full" />
              <div className="h-3 bg-white/10 rounded-full w-5/6" />
              <div className="h-3 bg-white/10 rounded-full w-4/6" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 bg-white/10 rounded-xl w-20" />
              <div className="h-8 bg-white/10 rounded-xl w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTableSkeleton = () => {
    return (
      <div className="w-full rounded-3xl border border-white/5 shadow-2xl bg-slate-900/40 p-1 overflow-hidden animate-pulse">
        <div className="h-14 bg-slate-950/40 border-b border-white/5 flex items-center px-6 gap-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="h-4 bg-white/10 rounded-lg flex-1" />
          ))}
        </div>
        <div className="divide-y divide-white/5 px-6">
          {Array.from({ length: rows }).map((_, rIdx) => (
            <div key={rIdx} className="h-20 flex items-center gap-4 py-4">
              {Array.from({ length: cols }).map((_, cIdx) => (
                <div key={cIdx} className="h-4 bg-white/5 rounded-lg flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderListSkeleton = () => {
    return (
      <div className="space-y-4 w-full animate-pulse">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-white/10" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/10 rounded-lg w-1/3" />
                <div className="h-3 bg-white/5 rounded-lg w-1/2" />
              </div>
            </div>
            <div className="h-10 bg-white/10 rounded-xl w-24" />
          </div>
        ))}
      </div>
    );
  };

  const renderTextSkeleton = () => {
    return (
      <div className="space-y-4 w-full animate-pulse p-6 bg-white/5 border border-white/5 rounded-3xl">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="h-4 bg-white/10 rounded-full"
            style={{ width: idx === rows - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    );
  };

  const renderStatSkeleton = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10" />
            <div className="space-y-3 flex-1">
              <div className="h-3 bg-white/5 rounded-full w-2/3" />
              <div className="h-8 bg-white/10 rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'text':
      return renderTextSkeleton();
    case 'stat':
      return renderStatSkeleton();
    case 'card':
    default:
      return renderCardSkeletons();
  }
}

