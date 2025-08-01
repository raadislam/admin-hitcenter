// src/hooks/useEmployeeDetail.ts
import api from "@/lib/axios";
import { EmployeeDetail } from "@/types/employees";
import useSWR from "swr";

// Use string | number for id type
export function useEmployeeDetail(id: string | number | undefined) {
  const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

  const { data, error, isLoading, mutate } = useSWR<EmployeeDetail>(
    id ? `/employees/${id}` : null, // Only fetch if id is defined
    fetcher
  );

  return {
    employee: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
