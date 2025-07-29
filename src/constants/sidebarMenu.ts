import {
  BadgeDollarSign,
  Contact,
  FileBarChart2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  PlusIcon,
  ScanLine,
  Settings,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

export const menuSections = [
  {
    label: "Main",
    items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }],
  },
  {
    label: "Lead Management",
    items: [
      { label: "All Leads", icon: Contact, href: "/dashboard/leads" },
      {
        label: "Add New Lead",
        icon: PlusIcon,
        href: "/dashboard/leads/create",
      },
    ],
  },
  {
    label: "Admission",
    items: [
      {
        label: "Student Admission",
        icon: UserCheck,
        href: "/dashboard/admission/student",
      },
      {
        label: "Mock Exam Fee",
        icon: BadgeDollarSign,
        href: "/dashboard/admission/fee",
      },
    ],
  },
  {
    label: "Employee",
    items: [
      { label: "All Employees", icon: Users, href: "/dashboard/employees" },
      {
        label: "Add New Employee",
        icon: UserPlus,
        href: "/dashboard/employees/create",
      },
      {
        label: "Salary Disbursement",
        icon: FolderKanban,
        href: "/dashboard/employees/salary",
      },
      {
        label: "Points & Increment",
        icon: UserCog,
        href: "/dashboard/employees/points",
      },
    ],
  },
  {
    label: "Attendance",
    items: [
      {
        label: "Device Management",
        icon: ScanLine,
        href: "/dashboard/attendance/device",
      },
      { label: "Log", icon: FileText, href: "/dashboard/attendance/log" },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "All Reports", icon: FileBarChart2, href: "/dashboard/reports" },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "General Settings",
        icon: Settings,
        href: "/dashboard/settings",
      },
    ],
  },
];
