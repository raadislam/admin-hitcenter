// src/components/dashboard/lead/StatusDropdownPortal.tsx
"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

export default function StatusDropdownPortal({
  anchorRect,
  open,
  statuses,
  status,
  loading,
  onChange,
  onClose,
}: {
  anchorRect: DOMRect | null;
  open: boolean;
  statuses: any[];
  status: string;
  loading: boolean;
  onChange: (status: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  // Auto-position: above or below
  const dropdownHeight = 190;
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const spaceAbove = anchorRect.top;
  const showAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

  const style: React.CSSProperties = {
    position: "fixed",
    left: anchorRect.left + anchorRect.width / 2 - 85, // center (170px wide)
    top: showAbove
      ? anchorRect.top - dropdownHeight - 10
      : anchorRect.bottom + 10,
    zIndex: 1000,
    width: 170,
  };

  return createPortal(
    <div
      ref={ref}
      style={style}
      className="p-3 rounded-xl border bg-white shadow-xl flex flex-col gap-2 animate-fade-in"
    >
      {statuses.map((s) => (
        <button
          key={s.value}
          className={`px-3 py-1 text-xs rounded-md border font-semibold flex-1 text-left transition
            ${s.value === status ? "ring-2 ring-blue-400" : "hover:scale-105"}
            ${s.color} ${s.border}`}
          onClick={() => onChange(s.value)}
          disabled={loading || s.value === status}
        >
          {s.value}
        </button>
      ))}
    </div>,
    document.body
  );
}
