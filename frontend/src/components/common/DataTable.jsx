
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick = null,
}) {
  if (loading) {
    return <SkeletonLoader type="table" rows={5} cols={columns.length} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto w-full rounded-[2rem] border border-white/5 shadow-2xl glass-morphism overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/5">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ${
                  col.className || ''
                }`}
                style={col.style}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, rowIdx) => (
            <tr
              key={row._id || rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-primary/10' : ''
              } transition-all duration-300 group`}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={col.key || colIdx}
                  className="px-8 py-5 text-sm text-text-secondary font-medium group-hover:text-white transition-colors"
                  style={col.style}
                >
                  {col.render ? col.render(row, rowIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

