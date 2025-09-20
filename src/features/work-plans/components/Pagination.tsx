// src/features/workplans/components/Pagination.tsx
type Props = {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  total: number;
  perPage: number;
  onPerPage: (n: number) => void;
  perPageOptions?: number[];
};

export default function Pagination({
  page, setPage, totalPages, total, perPage, onPerPage, perPageOptions = [10, 20, 50],
}: Props) {
  const startIndex = (page - 1) * perPage;
  const canNext = startIndex + perPage < total;

  const renderButtons = () => {
    const maxButtons = 7;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1; const active = p === page;
        return (
          <button key={p} onClick={() => setPage(p)}
            className={`px-3 py-1 text-sm border border-gray-300 ${active ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}>
            {p}
          </button>
        );
      });
    }
    const windowSize = maxButtons - 2;
    let start = Math.max(2, page - Math.floor(windowSize / 2));
    let end = start + windowSize - 1;
    if (end >= totalPages) { end = totalPages - 1; start = end - windowSize + 1; }
    const nodes: JSX.Element[] = [];
    nodes.push(<button key={1} onClick={() => setPage(1)} className={`px-3 py-1 text-sm border border-gray-300 ${page === 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}>1</button>);
    if (start > 2) nodes.push(<span key="l-ellipsis" className="px-2">…</span>);
    for (let p = start; p <= end; p++) {
      nodes.push(<button key={p} onClick={() => setPage(p)} className={`px-3 py-1 text-sm border border-gray-300 ${p === page ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}>{p}</button>);
    }
    if (end < totalPages - 1) nodes.push(<span key="r-ellipsis" className="px-2">…</span>);
    nodes.push(<button key={totalPages} onClick={() => setPage(totalPages)} className={`px-3 py-1 text-sm border border-gray-300 ${page === totalPages ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}>{totalPages}</button>);
    return nodes;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Tampilkan
        <select value={perPage} onChange={(e) => onPerPage(Number(e.target.value))} className="mx-2 border rounded px-2 py-1 text-sm">
          {perPageOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
        per halaman
      </div>
      <div className="inline-flex items-center gap-1">
        <button disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}
          className="px-3 py-1 text-sm border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          Sebelumnya
        </button>
        {renderButtons()}
        <button disabled={!canNext} onClick={() => setPage(Math.min(totalPages, page + 1))}
          className="px-3 py-1 text-sm border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
