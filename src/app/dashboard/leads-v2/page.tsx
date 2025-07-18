// pages/leads/page.tsx
"use client";
import { LeadCard } from "@/components/lead-v2/LeadCard";
import { LeadSummaryCard } from "@/components/lead-v2/LeadSummaryCard";
import { LeadsFilterBar } from "@/components/lead-v2/LeadsFilterBar";
import { LeadsToolbar } from "@/components/lead-v2/LeadsToolbar";
import { Pagination } from "@/components/lead-v2/Pagination";
import api from "@/lib/axios";
import { LeadStatus, LeadSummary } from "@/types/lead";
import { useCallback, useEffect, useState } from "react";

// pages/leads/page.tsx
export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const initialCounts: Record<LeadStatus | "all", number> = {
    New: 0,
    Qualified: 0,
    Interested: 0,
    "Follow Up": 0,
    Admitted: 0,
    Canceled: 0,
    Unqualified: 0,
    all: 0,
  };

  const initialTrends: Record<LeadStatus, number> = {
    New: 0,
    Qualified: 0,
    Interested: 0,
    "Follow Up": 0,
    Admitted: 0,
    Canceled: 0,
    Unqualified: 0,
  };

  const [summary, setSummary] = useState<LeadSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // 1. Memoize the fetch function (prevents unnecessary re-creation)
  // Fetch leads and counts from backend
  const fetchLeads = useCallback(async () => {
    try {
      const { data } = await api.get("/leads", {
        params: {
          page: currentPage,
          per_page: perPage,
          status: statusFilters.length > 0 ? statusFilters : undefined,
          search: search.trim() || undefined,
          date_from: dateRange.startDate
            ? dateRange.startDate.toISOString().slice(0, 10)
            : undefined,
          date_to: dateRange.endDate
            ? dateRange.endDate.toISOString().slice(0, 10)
            : undefined,
        },
      });
      setLeads(data.data || data);
      setTotal(data.meta?.total ?? data.total ?? 0);
      setLastPage(data.meta?.last_page ?? data.last_page ?? 1);

      setTotal(data.meta?.total ?? data.total ?? 0);
      setLastPage(data.meta?.last_page ?? data.last_page ?? 1);
    } catch (err) {
      setLeads([]);
      setTotal(0);
      setLastPage(1);
    }
  }, [currentPage, perPage, search, statusFilters, dateRange]);

  // 2. Effect runs when dependencies change (guaranteed latest function)
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const { data } = await api.get("/leads/summary");
      // Optional: validate/shape data if needed
      setSummary({
        counts: { ...initialCounts, ...(data.counts ?? {}) },
        trends: { ...initialTrends, ...(data.trends ?? {}) },
      });
    } catch (err) {
      setSummary({
        counts: initialCounts,
        trends: initialTrends,
      });
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  return (
    // Add the bg-gray-50 to the main wrapper
    <div className="min-h-screen w-full bg-gray-50">
      <div className="bg-white rounded-xl border shadow-sm max-w-7xl mx-auto px-4 py-8">
        <LeadsToolbar
          onSaved={() => {
            fetchLeads();
            fetchSummary();
          }}
        />
        <LeadSummaryCard
          statusCounts={summary?.counts}
          trends={summary?.trends}
          loading={summaryLoading}
        />
        <LeadsFilterBar
          search={(e) => setSearch(e)}
          setCurrentPage={setCurrentPage}
          statusFilters={statusFilters}
          setStatusFilters={setStatusFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              refresh={() => {
                fetchLeads();
                fetchSummary();
              }}
            />
          ))}
        </div>

        {/* Pagination Bar */}
        <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-500">
          <div>
            <span className="mr-2">
              Results {leads.length === 0 ? 0 : perPage * (currentPage - 1) + 1}
              -{" "}
              {leads.length === 0
                ? 0
                : perPage * (currentPage - 1) + leads.length}{" "}
              of {total} Lead
            </span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="
                            border border-[#E6E8EC]
                            rounded-[10px]
                            bg-[#F5F6FA]
                            px-4
                            py-2.5
                            text-[15px]
                            font-medium
                            shadow-sm
                            focus:border-blue-400 focus:bg-white
                            transition
                            outline-none
                            min-w-[115px]
                            appearance-none
                            relative
                            "
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg fill='none' stroke='black' stroke-width='2' viewBox='0 0 24 24' width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.25em 1.25em",
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            lastPage={lastPage}
          />
        </div>
      </div>
    </div>
  );
}
