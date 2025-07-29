import api from "@/lib/axios";
import { EmployeeDetail } from "@/types/employees";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export function useEmployeeDetail(id: string) {
  const { data, error, isLoading } = useSWR<EmployeeDetail>(
    `/employees/${id}`,
    fetcher
  );
  return {
    employee: data,
    isLoading,
    isError: error,
  };
}
