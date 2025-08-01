"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useComposeStore } from "@/hooks/useComposeStore";
import { formatDate } from "@/lib/dateFormat";
import { EmployeeDetail } from "@/types/employees";
import { Hash, Mail, MoreHorizontal } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function EmployeeTopHeader({
  employee,
}: {
  employee: EmployeeDetail;
}) {
  const { addRecipient, maximize } = useComposeStore();

  const onMessageClick = (employee: EmployeeDetail) => {
    addRecipient({
      id: employee.user_id, // <-- Add this!
      email: employee.email,
      name: employee.name, // (Optional, for displaying in chip)
      type: "employee",
      status: employee.status,
    });
    maximize(); // Ensures window opens/maximizes
  };

  return (
    <div className="flex justify-between items-start w-full px-6 pt-6 pb-4 border-b">
      {/* LEFT SIDE */}
      <div className="flex items-start gap-4">
        {/* Avatar */}

        <Avatar className="w-20 h-20 mb-2 border-4 border-[#F2F3F7]">
          <AvatarImage src={employee.avatar} alt={employee.name} />
          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
        </Avatar>

        {/* Name and Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <div className="flex items-center text-sm text-yellow-500">
              <Hash className="w-4 h-4 text-yellow-500 mr-1" />
              {employee.external_id}
            </div>
            <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
              {employee.status}
            </Badge>
          </div>

          {/* Sub info rows */}
          <div className="flex gap-6 text-sm text-gray-600">
            <div>
              <strong className="block font-medium text-gray-500">
                Department
              </strong>
              <span className="font-semibold">{employee.department}</span>
            </div>
            <div>
              <span className="block font-medium text-gray-500">Joined at</span>
              <span className="font-semibold">
                {formatDate(employee.joining_date)}
              </span>
            </div>
            <div>
              <span className="block font-medium text-gray-500">Job Title</span>
              <span className="font-semibold">{employee.job_title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-start gap-2 mt-1">
        <Button variant="outline" size="icon" className="h-9 w-9">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onMessageClick(employee)}
          className="h-9 text-sm font-medium bg-[var(--color-primary-option-one)] hover:bg-[var(--color-primary-option-two)]"
        >
          <Mail className="h-4 w-4" />
          Send Email
        </Button>
      </div>
    </div>
  );
}
