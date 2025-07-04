"use client";
import api from "@/lib/axios";
import { useState } from "react";

// Status options and styles
const statuses = [
  {
    value: "Interested",
    color: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
  },
  {
    value: "Follow Up",
    color: "bg-yellow-100 text-yellow-700",
    border: "border-yellow-200",
  },
  {
    value: "Admitted",
    color: "bg-green-100 text-green-700",
    border: "border-green-200",
  },
  {
    value: "Canceled",
    color: "bg-gray-200 text-gray-600",
    border: "border-gray-300",
  },
];

export default function StatusBadgeEditable({
  status,
  leadId,
  open,
  onOpen,
  onClose,
  onChange,
}: {
  status: string;
  leadId: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (newStatus: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  async function changeStatus(s: string) {
    setLoading(true);
    try {
      await api.patch(`/leads/${leadId}/status`, { status: s });
      onChange(s);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
    }
    setLoading(false);
    onClose();
  }

  const badgeStyle = statuses.find((s) => s.value === status);

  return (
    <div className="relative inline-block">
      {/* Status Badge */}
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`px-4 py-1 text-xs rounded-md border font-semibold cursor-pointer focus:outline-none transition ${badgeStyle?.color} ${badgeStyle?.border} shadow-sm`}
        disabled={loading}
        onClick={() => (open ? onClose() : onOpen())}
        style={{ minWidth: 108 }} // Ensures all badges same width, looks pro
      >
        {status}
      </button>

      {/* Dropdown: show above */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[170px] p-3 rounded-xl border bg-white shadow-xl flex flex-col gap-2 z-50 animate-fade-in">
          {statuses.map((s) => (
            <button
              key={s.value}
              className={`px-3 py-1 text-xs rounded-md border font-semibold flex-1 text-left transition
          ${s.value === status ? "ring-2 ring-blue-400" : "hover:scale-105"}
          ${s.color} ${s.border}`}
              onClick={() => changeStatus(s.value)}
              disabled={loading || s.value === status}
              style={{ marginBottom: "4px" }}
              tabIndex={0}
            >
              {s.value}
            </button>
          ))}
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-1 z-50 flex flex-col items-center pointer-events-none"
          style={{ boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.13)" }}
        >
          {/* Tail (triangle) */}
          <div
            className="w-3 h-3 bg-[#23272F] rounded rotate-45 mb-[-8px]"
            style={{ boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.13)" }}
          />
          {/* Toast Box */}
          <div
            className="
              bg-[#23272F]
              text-white
              font-bold
              text-[1rem]
              leading-none
              px-5
              py-3
              rounded-md
              shadow-xl
              whitespace-nowrap
              select-none
              tracking-wide
              animate-fade-in
            "
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.01em",
              boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.15)",
            }}
          >
            Status updated!
          </div>
        </div>
      )}

      {/* Inline Error Toast */}
      {showError && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-red-100 text-red-700 text-xs rounded shadow border border-red-200 z-50 whitespace-nowrap transition-opacity animate-fade-in">
          Failed to update.
        </div>
      )}
    </div>
  );
}
