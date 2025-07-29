import { EmployeeDetail } from "@/types/employees";
import { GraduationCap } from "lucide-react";

export default function EmployeeEducationInfo({
  employee,
}: {
  employee: EmployeeDetail;
}) {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm w-full mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <GraduationCap size={18} /> Education Information
        </h3>
      </div>
      <hr className="border-gray-200" />

      {employee.educations.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No education records found
        </p>
      ) : (
        <div className="space-y-4 py-2">
          {employee.educations.map((edu, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-3 last:border-b-0"
            >
              <div>
                <p className="text-gray-500 text-sm">Qualification</p>
                <p className="font-medium text-gray-800">{edu.qualification}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Institute</p>
                <p className="font-medium text-gray-800">
                  {edu.institute ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Year</p>
                <p className="font-medium text-gray-800">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
