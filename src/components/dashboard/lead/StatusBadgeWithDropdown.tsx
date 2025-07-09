// ✅ Full React + Tailwind + shadcn/ui Code for Your Design

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/lib/axios";
import { useState } from "react";

const statusFlow = {
  New: ["Qualified", "Unqualified"],
  Qualified: ["Interested", "Follow Up", "Unqualified"],
  Interested: ["Follow Up", "Canceled", "Admitted"],
  "Follow Up": ["Interested", "Canceled", "Admitted"],
  Canceled: [],
  Admitted: [],
};

// Status options and styles
const statusColors = [
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

// const statusColors = {
//   New: "border-blue-500 text-blue-700",
//   Qualified: "border-sky-500 text-sky-700",
//   Unqualified: "border-rose-500 text-rose-700",
//   Interested: "border-amber-500 text-amber-700",
//   "Follow Up": "border-orange-500 text-orange-700",
//   Canceled: "border-red-500 text-red-700",
//   Admitted: "border-green-500 text-green-700",
// };

export default function StatusBadgeWithDropdown({ leadId, status, onChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [nextStatus, setNextStatus] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(false);

  const handleSelectStatus = (s) => {
    setNextStatus(s);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!nextStatus) return;

    setLoading(true);
    try {
      await api.post(`/leads/${leadId}/status-step`, {
        new_status: nextStatus,
        remarks,
      });

      onChange(nextStatus);
      setRemarks("");
      setOpenDialog(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Failed to update status. Please try again.";
      setError(msg);
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
    } finally {
      setLoading(false);
    }
  };

  const badgeStyle = statusColors.find((s) => s.value === status);

  return (
    <div className="relative inline-block">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`px-4 py-1 text-xs rounded-md border font-semibold cursor-pointer focus:outline-none transition ${badgeStyle?.color} ${badgeStyle?.border} shadow-sm`}
          >
            {status}
          </button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 p-3 rounded-lg border bg-white shadow-xl">
          {(statusFlow[status] || []).map((s) => {
            const buttonStyle = statusColors.find((sc) => sc.value === s);
            return (
              <button
                key={s}
                onClick={() => handleSelectStatus(s)}
                className={`
                        px-4 py-1 text-xs rounded-md border font-semibold cursor-pointer focus:outline-none transition
                        ${buttonStyle?.color} ${buttonStyle?.border} shadow-sm
                        hover:scale-105 hover:ring-2 hover:ring-blue-300
                      `}
              >
                {s}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Remarks for {nextStatus}</DialogTitle>
          </DialogHeader>

          {/* Error Message Displayed Here */}
          {error && (
            <div className="mb-2 p-2 rounded bg-red-100 text-red-700 text-sm border border-red-300">
              {error}
            </div>
          )}
          <textarea
            className="w-full mt-2 border rounded p-2 min-h-[100px] text-sm"
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Status"}
          </Button>
        </DialogContent>
      </Dialog>

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
