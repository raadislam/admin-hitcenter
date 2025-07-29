import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageWindow(current: number, last: number, window = 1) {
  // Always include first and last page, plus window around current
  const pages = new Set<number>();
  pages.add(1);
  pages.add(last);
  for (let i = current - window; i <= current + window; i++) {
    if (i > 1 && i < last) pages.add(i);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (n: number) => void;
  lastPage: number;
  perPage: number;
  setPerPage: (n: number) => void;
  total: number;
}

export default function Pagination({
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  setPerPage,
  total,
}: PaginationProps) {
  const pages = getPageWindow(currentPage, lastPage, 1);

  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center mt-8 gap-4">
      {/* Per page select */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Select
          value={String(perPage)}
          onValueChange={(v) => setPerPage(Number(v))}
        >
          <SelectTrigger className="w-[68px] h-[36px] border border-gray-200 rounded-md focus:ring-0 focus:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[12, 24, 36, 48].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>Candidates per page</span>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Prev */}
        <Button
          variant="ghost"
          className="px-2 py-1 text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        >
          <ChevronLeft size={16} /> Prev
        </Button>
        {pages.map((n, i) => {
          // Ellipsis logic
          if (i > 0 && n !== pages[i - 1] + 1) {
            return (
              <span
                key={`ellipsis-${n}`}
                className="text-gray-400 font-semibold px-1"
              >
                ...
              </span>
            );
          }
          return (
            <Button
              key={n}
              variant={currentPage === n ? "secondary" : "ghost"}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === n
                  ? "bg-[var(--color-hover)] text-white font-semibold"
                  : "text-gray-600 hover:bg-[#f1f1f1] hover:text-[var(--color-primary)]"
              }`}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </Button>
          );
        })}
        {/* Next */}
        <Button
          variant="ghost"
          className="px-2 py-1 text-gray-700 font-medium"
          disabled={currentPage === lastPage}
          onClick={() => setCurrentPage(Math.min(lastPage, currentPage + 1))}
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
