import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: 'bi-check-circle-fill',
  danger: 'bi-x-circle-fill',
  info: 'bi-info-circle-fill',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'info', durationMs = 4000) => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="position-fixed d-flex flex-column gap-2"
        style={{ top: '80px', right: '16px', zIndex: 2000, maxWidth: '340px' }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item alert alert-${t.type} shadow-lg d-flex align-items-start gap-2 mb-0`}
            role="alert"
          >
            <i className={`bi ${ICONS[t.type] || ICONS.info} mt-1`} />
            <span className="flex-grow-1 small">{t.message}</span>
            <button
              type="button"
              className="btn-close btn-sm"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
            />
          </div>
        ))}
      </div>
      <style jsx global>{`
        .toast-item {
          animation: toastIn 0.25s ease both;
        }
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}
