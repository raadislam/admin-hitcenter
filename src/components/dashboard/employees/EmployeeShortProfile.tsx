import { formatDate } from "@/lib/dateFormat";
import { EmployeeDetail } from "@/types/employees";
import {
  Calendar,
  CreditCard,
  Flag,
  Globe,
  Landmark,
  Mail,
  Phone,
  User,
  UserRound,
} from "lucide-react";
import { FC } from "react";

const Item: FC<{ label: string; value: string | null; icon?: JSX.Element }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-start gap-3 text-sm">
    {icon && <div className="mt-0.5 text-gray-500">{icon}</div>}
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value ?? "Not Provided"}</p>
    </div>
  </div>
);

export default function EmployeeShortProfile({
  employee,
}: {
  employee: EmployeeDetail;
}) {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm w-full mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User size={18} /> Short Profile
        </h3>
      </div>
      <hr className="border-gray-200" />
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 pt-6">
        <Item
          label="External ID"
          value={employee.external_id}
          icon={<CreditCard size={16} />}
        />
        <Item
          label="Department"
          value={employee.department}
          icon={<Landmark size={16} />}
        />
        <Item label="Phone" value={employee.phone} icon={<Phone size={16} />} />
        <Item label="Email" value={employee.email} icon={<Mail size={16} />} />
        <Item
          label="Date of Birth"
          value={formatDate(employee.dob)}
          icon={<Calendar size={16} />}
        />
        <Item
          label="Card Number"
          value={employee.card_number}
          icon={<CreditCard size={16} />}
        />
        <Item
          label="Gender"
          value={employee.gender}
          icon={<UserRound size={16} />}
        />
        <Item
          label="Religion"
          value={employee.religion}
          icon={<Globe size={16} />}
        />
        <Item
          label="Country"
          value={employee.country}
          icon={<Flag size={16} />}
        />
      </div>
    </div>
  );
}
