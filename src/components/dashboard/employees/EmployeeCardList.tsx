import EmployeeCard, { Employee } from "./EmployeeCard";

export default function EmployeeCardList({
  employees,
}: {
  employees: Employee[];
}) {
  return (
    <div className="px-4 pt-2">
      {/* Grid, tightly packed */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} {...emp} />
        ))}
      </div>
    </div>
  );
}
