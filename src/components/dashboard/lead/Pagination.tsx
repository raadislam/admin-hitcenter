import { ChevronLeft, ChevronRight } from "lucide-react";

// Helper to determine which page numbers and where the ellipsis go
function getPageWindow(current: number, last: number, window = 2) {
  // Always include first and last page, plus window around current
  const pages = new Set<number>();
  pages.add(1);
  pages.add(last);
  for (let i = current - window; i <= current + window; i++) {
    if (i > 1 && i < last) pages.add(i);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export function Pagination({
  currentPage,
  setCurrentPage,
  lastPage,
}: {
  currentPage: number;
  setCurrentPage: (n: number) => void;
  lastPage: number;
}) {
  const pages = getPageWindow(currentPage, lastPage, 2);

  return (
    <div className="flex gap-1 items-center">
      {/* Previous button */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center
          hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((n, i) => {
        // Insert a clickable ellipsis when there's a gap in the page sequence
        if (i > 0 && n !== pages[i - 1] + 1) {
          // Jump to just before or after the ellipsis window
          const prev = pages[i - 1];
          const next = n;
          const jumpTo = n > currentPage ? prev + 1 : next - 1;
          return [
            <button
              key={"ellipsis" + n}
              className="px-2 text-gray-400 cursor-pointer hover:text-blue-500 transition"
              onClick={() => setCurrentPage(jumpTo)}
              tabIndex={0}
              aria-label="Jump pages"
            >
              ...
            </button>,
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className={`w-7 h-7 rounded border flex items-center justify-center
                ${
                  currentPage === n
                    ? "border-blue-400 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-200 hover:bg-gray-100 text-gray-700"
                }`}
            >
              {n}
            </button>,
          ];
        }
        return (
          <button
            key={n}
            onClick={() => setCurrentPage(n)}
            className={`w-7 h-7 rounded border flex items-center justify-center
              ${
                currentPage === n
                  ? "border-blue-400 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
          >
            {n}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => setCurrentPage(Math.min(lastPage, currentPage + 1))}
        disabled={currentPage === lastPage}
        className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center
          hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
