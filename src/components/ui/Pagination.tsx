type Props = {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
};

function range(start: number, end: number) {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export default function Pagination({ page, perPage, total, onPageChange, onPerPageChange, perPageOptions = [10, 20, 50] }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage || 1));

  // determine window of page buttons (max 7)
  const maxButtons = 7;
  let start = 1;
  let end = Math.min(totalPages, maxButtons);
  if (totalPages > maxButtons) {
    const half = Math.floor(maxButtons / 2);
    start = Math.max(1, page - half);
    end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">Tampilkan
        {onPerPageChange ? (
          <select value={perPage} onChange={(e) => { onPerPageChange(Number(e.target.value)); }} className="mx-2 border rounded px-2 py-1 text-sm">
            {perPageOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
        ) : (
          <span className="mx-2 font-medium">{perPage}</span>
        )}
        per halaman
      </div>

      <div className="inline-flex items-center gap-1">
        <button disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))} className="px-3 py-1 text-sm border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
        {range(start, end).map((p) => {
          const active = p === page;
          return (
            <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 text-sm border border-gray-300 ${active ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'} `}>{p}</button>
          );
        })}
        <button disabled={(page * perPage) >= total} onClick={() => onPageChange(page + 1)} className="px-3 py-1 text-sm border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
      </div>
    </div>
  );
}
