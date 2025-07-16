import "./main.css";

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div id="global-toast-wrapper">
      {toasts.map((toast) => (
        <div className={`toast toast-${toast.type}`} key={toast.id}>
          <span className="toast-icon" aria-hidden>
            {getToastIcon(toast.type)}
          </span>
          <div className="toast-content">
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => onRemove(toast.id)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

// SVGs precisely match your screenshot!
function getToastIcon(type) {
  const icons = {
    success: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#22c55e" />
        <path
          d="M7 13l3 3 7-7"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#ef4444" />
        <path
          d="M8 8l8 8M16 8l-8 8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#fbbf24" />
        <circle cx="12" cy="16" r="1" fill="#fff" />
        <rect x="11" y="7" width="2" height="6" fill="#fff" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#3b82f6" />
        <circle cx="12" cy="9" r="1.2" fill="#fff" />
        <rect x="11" y="11" width="2" height="6" fill="#fff" />
      </svg>
    ),
  };
  return icons[type] || icons.info;
}
