"use client";
import api from "@/lib/axios";
import { useState } from "react";

// Status options and styles
const statuses = [
  {
    value: "New",
    color: "bg-gray-100 text-gray-800",
    border: "border-gray-800",
  },
  {
    value: "Qualified",
    color: "bg-sky-100 text-sky-800",
    border: "border-sky-800",
  },
  {
    value: "Unqualified",
    color: "bg-rose-100 text-rose-800",
    border: "border-rose-800",
  },
  {
    value: "Interested",
    color: "bg-amber-100 text-amber-800",
    border: "border-amber-800",
  },
  {
    value: "Follow Up",
    color: "bg-orange-100 text-orange-800",
    border: "border-orange-800",
  },
  {
    value: "Admitted",
    color: "bg-green-100 text-green-800",
    border: "border-green-800",
  },
  {
    value: "Canceled",
    color: "bg-red-100 text-red-800",
    border: "border-red-800",
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
          className="absolute left-1/2 -translate-x-1/2 mt-1 z-50 flex flex-col items-center"
          style={{ boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.13)" }}
        >
          {/* Tail (triangle) */}
          <div
            className="w-3 h-3 bg-[#23272F] rounded rotate-45 mb-[-9px] shadow-2xl"
            style={{ boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.13)" }}
          />

          {/* Toast box */}
          <div
            className="
        bg-[#23272F]
        text-white
        font-bold
        text-[0.75rem]    /* approx 25-26px */
        leading-none
        px-2             /* wide horizontal padding */
        py-2             /* generous vertical padding */
        rounded-md
        shadow-md
        whitespace-nowrap
        select-none
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
