export function SearchBox({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="input-group mb-3" style={{ maxWidth: '320px' }}>
      <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
      <input
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="btn btn-outline-secondary" type="button" onClick={() => onChange('')}>
          <i className="bi bi-x" />
        </button>
      )}
    </div>
  );
}

export function PaginationBar({ page, totalPages, totalResults, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <span className="text-muted small">{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <i className="bi bi-chevron-left" />
        </button>
        <span className="small text-muted">Page {page} of {totalPages}</span>
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
}
