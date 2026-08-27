import { useMemo, useState } from 'react';

/**
 * Client-side search + pagination for admin tables.
 * @param {Array} data - full array of rows
 * @param {Function} searchFields - (row) => array of strings to match search against
 * @param {number} pageSize
 */
export function useSearchAndPaginate(data, searchFields, pageSize = 8) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) =>
      searchFields(row).some((field) => String(field ?? '').toLowerCase().includes(q))
    );
  }, [data, query, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setQueryAndReset = (value) => {
    setQuery(value);
    setPage(1);
  };

  return {
    query,
    setQuery: setQueryAndReset,
    page: currentPage,
    setPage,
    totalPages,
    totalResults: filtered.length,
    pageData,
  };
}
