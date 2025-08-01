"use client";

import { useEmployeeDetail } from "@/hooks/useEmployeeDetail";
import { useSWRConfig } from "swr";
import EmployeeEducationInfo from "./EmployeeEducation";
import EmployeeNotesInput from "./EmployeeNotesInput";
import EmployeeNotesList from "./EmployeeNotesList";
import EmployeeShortProfile from "./EmployeeShortProfile";
import EmployeeTopHeader from "./EmployeeTopHeader";
import JobAppliedCard from "./JobAppliedCard";

interface Props {
  employeeId: string;
}

export default function EmployeeDetailCard({ employeeId }: Props) {
  const { mutate } = useSWRConfig();
  const { employee, isLoading, isError, error } = useEmployeeDetail(employeeId);

  // Debug log
  console.log("EmployeeDetailCard employeeId:", employeeId);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError)
    return (
      <div className="p-8 text-red-600">
        Error: {error?.message || "Failed to load employee."}
      </div>
    );
  if (!employee)
    return <div className="p-8 text-gray-500">Employee not found.</div>;

  return (
    <div className="bg-white rounded-md shadow p-6 max-w-6xl mx-auto mt-6">
      {/* Header: Avatar, Name, Position, Status, etc. */}
      <EmployeeTopHeader employee={employee} />

      <div className="grid grid-cols-3 gap-6">
        {/* Left Side: Info, Education, Logs */}
        <div className="col-span-2 space-y-6">
          {/* Short Profile */}
          <EmployeeShortProfile employee={employee} />

          {/* Job Applications / Other Info */}
          <JobAppliedCard employee={employee} />

          {/* Education Info */}
          <EmployeeEducationInfo employee={employee} />

          {/* Logs */}
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h2 className="font-semibold text-base text-gray-700 mb-4">
              Activity Logs
            </h2>
            {employee.logs && employee.logs.length === 0 ? (
              <p className="text-gray-500 italic">No activity logs</p>
            ) : (
              <ul className="space-y-4">
                {employee.logs?.map((log) => (
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

        {/* Right Side: Notes */}
        <section className="bg-gray-50 p-5 mt-5 rounded-md border">
          <h3 className="text-base font-semibold mb-2">Notes</h3>
          <EmployeeNotesInput
            employeeId={employee.id.toString()}
            onNoteAdded={async () => await mutate(`/employees/${employee.id}`)}
          />
          <EmployeeNotesList notes={employee.notes ?? []} />
        </section>
      </div>
    </div>
  );
}
