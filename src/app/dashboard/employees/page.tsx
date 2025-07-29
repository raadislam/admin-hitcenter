// app/employees/page.tsx
"use client";
import EmployeeCardList from "@/components/dashboard/employees/EmployeeCardList";
import EmployeeCardSkeleton from "@/components/dashboard/employees/EmployeeCardSkeleton";
import { EmployeeFilterBar } from "@/components/dashboard/employees/EmployeeFilterBar";
import Pagination from "@/components/dashboard/employees/Pagination";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Data fetch with dependencies on search, statusFilters, page, perPage
  useEffect(() => {
    setLoading(true);
    api
      .get("/employees", {
        params: {
          search,
          statuses: statusFilters,
          page: currentPage,
          per_page: perPage,
        },
      })
      .then((res) => {
        setEmployees(res.data.data || []);
        setLastPage(res.data.meta?.last_page || 1);
        setTotal(res.data.meta?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [search, statusFilters, currentPage, perPage]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="bg-white rounded-md border shadow-sm max-w-7xl mx-auto px-4 py-8">
        <div>
          <h1 className="font-bold text-xl mt-6">Employees</h1>
          <div className="text-sm text-muted-foreground mb-4">
            Who have working under your organization
          </div>
        </div>
        <EmployeeFilterBar
          search={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          setCurrentPage={setCurrentPage}
          statusFilters={statusFilters}
          setStatusFilters={(v) => {
            setStatusFilters(v);
            setCurrentPage(1);
          }}
        />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <EmployeeCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <EmployeeCardList employees={employees} />
        )}

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          perPage={perPage}
          setPerPage={setPerPage}
          total={total}
        />
      </div>
    </div>
  );
}
