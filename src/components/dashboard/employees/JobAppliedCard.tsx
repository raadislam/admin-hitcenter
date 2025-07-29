"use client";

import { calculateExperienceDuration } from "@/lib/calculateExperience";
import { formatDate } from "@/lib/dateFormat";
import { formatSalary } from "@/lib/formatSalary";
import { EmployeeDetail } from "@/types/employees";
import { Briefcase, Building, MapPin } from "lucide-react";

export default function JobAppliedCard({
  employee,
}: {
  employee: EmployeeDetail;
}) {
  return (
    <div className="bg-white border rounded-md px-6 py-5 space-y-4 shadow-sm w-full  mt-6">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 ">
          <Building size={18} /> Job Information
        </h3>
      </div>
      <hr className="border-gray-200" />

      {/* Job title + badges */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">
          {employee.job_title}
        </h4>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {employee.employment_type}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {employee.permanent_address}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Bottom details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 text-sm text-gray-600">
        <div>
          <div className="text-gray-500">Experience in Years</div>
          <div className="font-semibold">
            {calculateExperienceDuration(employee.joining_date)}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Joining Date</div>
          <div className="font-semibold">
            {formatDate(employee.joining_date)}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Current Salary</div>
          <div className="font-semibold">
            {formatSalary(employee.salary, "BDT")}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Bank Account Name</div>
          <div className="font-semibold">{employee.bank_account_name}</div>
        </div>
        <div>
          <div className="text-gray-500">Bank A/C Number</div>
          <div className="italic text-gray-400">
            {employee.bank_account_number}
          </div>
        </div>
      </div>
    </div>
  );
}
