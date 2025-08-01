"use client";
import EmployeeDetailCard from "@/components/dashboard/employees/EmployeeDetailCard";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return <EmployeeDetailCard employeeId={id as string} />;
}
