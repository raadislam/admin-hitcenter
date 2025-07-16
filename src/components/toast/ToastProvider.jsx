"use client";
import { createContext, useCallback, useContext, useState } from "react";
import ToastContainer from "./Container";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type, title, message, duration = 4200 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      duration
    );
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.showToast;
}
