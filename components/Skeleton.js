export function SkeletonBar({ width = '100%', height = '14px', className = '' }) {
  return (
    <span
      className={`skeleton-bar d-inline-block ${className}`}
      style={{ width, height, borderRadius: '6px' }}
    />
  );
}

export function SkeletonStatCard() {
  return (
    <div className="card p-3 h-100">
      <div className="d-flex align-items-center gap-3">
        <span className="skeleton-bar rounded-circle" style={{ width: 48, height: 48 }} />
        <div className="flex-grow-1">
          <SkeletonBar width="70%" height="10px" className="mb-2" />
          <SkeletonBar width="45%" height="20px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTableRows({ rows = 5, columns = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }).map((__, c) => (
            <td key={c}>
              <SkeletonBar width={c === 0 ? '80%' : '60%'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-3">
      <SkeletonBar width="50%" height="18px" className="mb-3" />
      <SkeletonBar width="90%" className="mb-2" />
      <SkeletonBar width="75%" />
    </div>
  );
}
