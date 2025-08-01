"use client";
import { Filter } from "lucide-react";
import { useRef, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import StatusFilterPopover from "./StatusFilterPopover";

export function EmployeeFilterBar({
  search,
  setCurrentPage,
  statusFilters,
  setStatusFilters,
}: {
  search: (value: string) => void;
  setCurrentPage: (page: number) => void;
  statusFilters: string[];
  setStatusFilters: (statuses: string[]) => void;
}) {
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <div className="relative">
          <button
            ref={filterBtnRef}
            className={`flex items-center gap-1 border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold bg-white shadow-sm transition hover:bg-blue-50 ${
              statusFilters.length > 0
                ? "text-blue-600 border-blue-300 bg-blue-50"
                : ""
            }`}
            style={{ minWidth: 110, height: 44 }}
            onClick={() => setShowStatusDropdown((v) => !v)}
          >
            <Filter size={18} className="mr-1" />
            Filters
            {statusFilters.length > 0 && (
              <span className="ml-2 bg-blue-600 text-white rounded-md px-2 py-0.5 text-xs font-bold">
                {statusFilters.length}
              </span>
            )}
          </button>
          <StatusFilterPopover
            open={showStatusDropdown}
            anchorRef={filterBtnRef as React.RefObject<HTMLButtonElement>}
            selected={statusFilters}
            onChange={setStatusFilters} // <--- Set directly!
            onApply={(statuses) => {
              setStatusFilters(statuses);
              setShowStatusDropdown(false);
              setCurrentPage(1);
            }}
            onClose={() => setShowStatusDropdown(false)}
          />
        </div>

        <input
          className="ml-auto border rounded-lg px-4 py-2 w-60 bg-gray-50"
          placeholder="Search"
          onChange={(e) => {
            setCurrentPage(1);
            search(e.target.value);
          }}
        />
      </div>

      {statusFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-3 min-h-6">
          {/* Status filter chips */}
          {statusFilters.map((status) => (
            <span
              key={status}
              className={`
        inline-flex items-center px-3 py-1 rounded-md border
        text-xs font-semibold shadow-sm
        ${
          status === "Resigned"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : status === "Active"
            ? "bg-green-50 text-green-700 border-green-200"
            : status === "Canceled"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-gray-50 text-gray-600 border-gray-200"
        }
      `}
            >
              {status}
              <button
                onClick={() =>
                  setStatusFilters(statusFilters.filter((s) => s !== status))
                }
                className="ml-1 hover:bg-gray-100 rounded-full p-0.5 transition"
                aria-label={`Remove filter ${status}`}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
