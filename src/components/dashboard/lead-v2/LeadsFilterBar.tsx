"use client";
import { format } from "date-fns";
import { Filter } from "lucide-react";
import { useRef, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import StatusFilterPopover from "./StatusFilterPopover";

export function LeadsFilterBar({
  search,
  setCurrentPage,
  statusFilters,
  setStatusFilters,
  dateRange,
  setDateRange,
}: {
  search: (value: string) => void;
  setCurrentPage: (page: number) => void;
  statusFilters: string[];
  setStatusFilters: (statuses: string[]) => void;
  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}) {
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <div className="relative">
          <button
            className="px-4 py-2 border rounded-lg bg-gray-50 font-medium"
            onClick={() => setShowDatePicker((v) => !v)}
          >
            {dateRange.startDate && dateRange.endDate
              ? `${format(dateRange.startDate, "dd MMM yyyy")} - ${format(
                  dateRange.endDate,
                  "dd MMM yyyy"
                )}`
              : "All Dates"}
          </button>
          {showDatePicker && (
            <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[340px]">
              <DateRange
                editableDateInputs={true}
                onChange={(item) =>
                  setDateRange({
                    startDate: item.selection.startDate ?? null,
                    endDate: item.selection.endDate ?? null,
                  })
                }
                moveRangeOnFirstSelection={false}
                ranges={[
                  {
                    startDate: dateRange.startDate || new Date(),
                    endDate: dateRange.endDate || new Date(),
                    key: "selection",
                  },
                ]}
                maxDate={new Date()}
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700"
                  onClick={() => {
                    setDateRange({ startDate: null, endDate: null });
                    setShowDatePicker(false);
                  }}
                >
                  Clear
                </button>
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                  onClick={() => setShowDatePicker(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

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
          status === "Interested"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : status === "Follow Up"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : status === "Admitted"
            ? "bg-green-50 text-green-700 border-green-200"
            : status === "Canceled"
            ? "bg-red-50 text-red-700 border-red-200"
            : status === "Qualified"
            ? "bg-lime-50 text-lime-700 border-lime-200"
            : status === "Unqualified"
            ? "bg-gray-100 text-gray-700 border-gray-200"
            : "bg-gray-50 text-gray-600 border-gray-200"
        }
      `}
            >
              {status}
              <button
                onClick={() =>
                  setStatusFilters(
                    statusFilters.filter((filters: any) =>
                      filters.filter((s: any) => s !== status)
                    )
                  )
                }
                className="ml-1 hover:bg-gray-100 rounded-full p-0.5 transition"
                aria-label={`Remove filter ${status}`}
                type="button"
              >
                ×
              </button>
            </span>
          ))}

          {/* Date range chip */}
          {dateRange.startDate && dateRange.endDate && (
            <span
              className="
        inline-flex items-center px-3 py-1 rounded-md border
        bg-purple-50 text-purple-700 border-purple-200
        text-xs font-semibold shadow-sm
      "
            >
              {format(dateRange.startDate, "dd MMM yyyy")} -{" "}
              {format(dateRange.endDate, "dd MMM yyyy")}
              <button
                onClick={() => setDateRange({ startDate: null, endDate: null })}
                className="ml-1 hover:bg-purple-100 rounded-md p-0.5 transition"
                aria-label="Remove date range filter"
                type="button"
              >
                ×
              </button>
            </span>
          )}

          {/* Clear All button if any filter is active */}
          {(statusFilters.length > 0 ||
            (dateRange.startDate && dateRange.endDate)) && (
            <button
              className="ml-2 px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-600 font-semibold transition"
              onClick={() => {
                setStatusFilters([]);
                setDateRange({ startDate: null, endDate: null });
              }}
              type="button"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </>
  );
}
