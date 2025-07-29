// src/components/employees/EmployeeDetailCard.tsx
"use client";

import { useEmployeeDetail } from "@/hooks/useEmployeeDetail";
import { useParams } from "next/navigation";
import { useSWRConfig } from "swr";
import EmployeeEducationInfo from "./EmployeeEducation";
import EmployeeNotesInput from "./EmployeeNotesInput";
import EmployeeNotesList from "./EmployeeNotesList";
import EmployeeShortProfile from "./EmployeeShortProfile";
import EmployeeTopHeader from "./EmployeeTopHeader";
import JobAppliedCard from "./JobAppliedCard";

export default function EmployeeDetailCard() {
  const { mutate } = useSWRConfig();
  const { id } = useParams<{ id: string }>();
  const { employee, isLoading } = useEmployeeDetail(id);

  if (isLoading || !employee) return <div className="p-8">Loading...</div>;

  return (
    <div className="bg-white rounded-md shadow p-6 max-w-6xl mx-auto mt-6">
      <EmployeeTopHeader employee={employee} />

      <div className="grid grid-cols-3 gap-6">
        {/* Employee Info */}
        <div className="col-span-2 space-y-6">
          <EmployeeShortProfile employee={employee} />

          <JobAppliedCard employee={employee} />

          {/* Education */}
          <EmployeeEducationInfo employee={employee} />

          {/* Logs */}
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h2 className="font-semibold text-base text-gray-700 mb-4">
              Activity Logs
            </h2>
            {employee.logs.length === 0 ? (
              <p className="text-gray-500 italic">No activity logs</p>
            ) : (
              <ul className="space-y-4">
                {employee.logs.map((log) => (
                  <li
                    key={log.id}
                    className="flex flex-col gap-1 p-4 rounded-md border bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {log.action}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.created_at} —{" "}
                      <span className="italic">
                        {log.performed_by || "Unknown"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Notes */}

        <section className="bg-gray-50 p-5 mt-5 rounded-md border">
          <h3 className="text-base font-semibold mb-2">Notes</h3>

          <EmployeeNotesInput
            employeeId={employee.id.toString()}
            onNoteAdded={async () => await mutate(`/employees/${employee.id}`)}
          />

          <EmployeeNotesList notes={employee.notes} />
        </section>
      </div>
    </div>
  );
}
