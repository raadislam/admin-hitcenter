// src/components/dashboard/lead/table/StatusFilterPopover.tsx

"use client";
import { useEffect, useRef } from "react";

const STATUS_LIST = [
  { label: "Interested", value: "Interested" },
  { label: "Follow Up", value: "Follow Up" },
  { label: "Admitted", value: "Admitted" },
  { label: "Canceled", value: "Canceled" },
];

export default function StatusFilterPopover({
  open,
  anchorRef,
  selected,
  onChange,
  onApply,
  onClose,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement>;
  selected: string[];
  onChange: (statuses: string[]) => void;
  onApply: (statuses: string[]) => void;
  onClose: () => void;
}) {
  // Click outside handler
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        open &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className={`
        absolute right-0 mt-2 w-[320px] bg-white border rounded-xl shadow-xl z-50
        flex flex-col
        px-6 py-4
      `}
      style={
        {
          // (optional) Add custom box-shadow or border styles for pixel-perfect
        }
      }
    >
      <div className="font-bold text-gray-900 mb-4 text-base">
        Filter by Status
      </div>
      <div className="flex flex-col gap-2">
        {STATUS_LIST.map((status) => (
          <label
            key={status.value}
            className={`
              flex items-center cursor-pointer px-1 py-2 rounded-lg
              transition hover:bg-gray-100
              ${selected.includes(status.value) ? "bg-blue-50" : ""}
            `}
          >
            <input
              type="checkbox"
              checked={selected.includes(status.value)}
              onChange={() => {
                if (selected.includes(status.value)) {
                  onChange(selected.filter((s) => s !== status.value));
                } else {
                  onChange([...selected, status.value]);
                }
              }}
              className="w-4 h-4 accent-blue-600 mr-3"
            />
            <span className="text-[15px] font-medium text-gray-700">
              {status.label}
            </span>
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 text-gray-500 font-semibold rounded-lg border bg-white hover:bg-gray-100 transition text-[15px]"
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(selected)}
          className="px-6 py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition text-[15px]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
