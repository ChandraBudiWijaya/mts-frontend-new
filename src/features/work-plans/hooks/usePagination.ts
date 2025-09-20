// src/features/workplans/hooks/usePagination.ts
import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], initialPerPage = 10) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const data = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  const onPerPage = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return { page, setPage, perPage, onPerPage, total, totalPages, data, canPrev, canNext };
}
