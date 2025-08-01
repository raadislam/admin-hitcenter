import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Mail, Phone } from "lucide-react";
import Link from "next/link";

export type EmployeeStatus = "Active" | "Inactive" | string;

export interface Employee {
  id: number; // PK from employee table (numeric)
  external_id: string; // e.g., EMP25001 (from users table, your business code)
  name: string; // Full name (from users table)
  job_title: string; // Designation/position
  department: string; // Department name
  joining_date: string; // e.g., "2024-07-25"
  salary: string; // Salary string, e.g., "$2,800"
  email: string; // Employee email (not always login email)
  phone: string; // Employee phone
  avatar: string | null; // Full avatar URL or null
  status: EmployeeStatus; // "Active" | "Inactive"
}

const statusProps: Record<EmployeeStatus, { color: string; bg: string }> = {
  Active: {
    color: "#22C55E",
    bg: "#E7F8F3",
  },
  Inactive: {
    color: "#f54242",
    bg: "#fadddd",
  },
  Completed: {
    color: "#F59E42",
    bg: "#FFF6EA",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatSalary(amount: string | number, currency = "USD") {
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.]/g, ""))
      : amount;
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US", { style: "currency", currency });
}

const EmployeeCard = ({
  id,
  name,
  job_title,
  department,
  joining_date,
  salary,
  email,
  phone,
  avatar,
  status,
  external_id,
}: Employee) => (
  <Card className="w-full min-w-[255px] gap-1 rounded-md shadow-[0_4px_16px_0_#E6ECF1] border-0 px-5 py-5 flex flex-col items-center ">
    {/* Header */}
    <div className="w-full flex items-center justify-between mb-1">
      <Checkbox className="border-[var(--color-primary)] rounded-md" />
      <Badge
        style={{
          backgroundColor: statusProps[status].bg,
          color: statusProps[status].color,
        }}
        className="font-semibold px-3 py-0.5 text-xs rounded-lg border-0"
      >
        {status}
      </Badge>
      <Link href={`/dashboard/employees/${id}`}>
        <Button
          variant="ghost"
          size="icon"
          className="p-0 text-gray-400 hover:bg-gray-100 focus:ring-0"
          aria-label="View Profile"
        >
          <Eye size={20} />
        </Button>
      </Link>
    </div>
    {/* Avatar */}
    <Avatar className="w-27 h-27 mb-2 border-4 border-[#F2F3F7]">
      <AvatarImage src={avatar ?? undefined} alt={name} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
    {/* Name + job_title */}
    <div className="font-bold text-lg text-center leading-5">{name}</div>
    <div className="text-gray-400 text-sm mb-1 text-center">{job_title}</div>
    {/* Employee ID */}
    <div className="text-xs text-gray-400 mb-2">
      ID:{" "}
      <span className="text-[var(--color-primary)] font-medium">
        {external_id}
      </span>
    </div>
    {/* Info Section */}
    <CardContent className="w-full bg-[#F5FAFD] rounded-lg px-3 py-2 mb-2 mt-0 text-[13px] shadow-none border-0">
      <div className="flex flex-col gap-[2px]">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-semibold">
            Department:
          </span>
          <span className="font-semibold text-black truncate">
            {department}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-semibold">Joining:</span>
          <span className="font-semibold text-black">{joining_date}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-semibold">Salary:</span>
          <span className="font-semibold text-[var(--color-primary)]">
            {formatSalary(salary, "BDT")}
          </span>
        </div>
      </div>
    </CardContent>

    {/* Contact Info */}
    <div className="w-full text-[13px] text-[#5e6e88] space-y-1">
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-[#90a4ae]" />
        <span className="truncate">{email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone size={16} className="text-[#90a4ae]" />
        <span>{phone}</span>
      </div>
    </div>
  </Card>
);

export default EmployeeCard;
