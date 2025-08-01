export type Lead = {
  id: number;
  uuid: string;
  lead_id: string;
  name: string;
  phone_number: string;
  email: string;
  status: string;
  created_at: string;
  status_history: LeadStatusHistory[];
};

export type LeadStatusHistory = {
  id: number;
  previous_status: string;
  new_status: string;
  remarks: string | null;
  changed_by: {
    id: number;
    name: string;
    avatar?: string | null;
  } | null;
  appointment_date: string | null;
  interested_course: { id: number; name: string } | null;
  created_at: string;
};

export type StatusUpdateFormProps = {
  open: boolean;
  statusOptions: string[];
  courseOptions: { id: number; name: string }[];
  initialStatus?: string;
  onSubmit: (payload: {
    status: string;
    remarks: string;
    appointmentDate?: string;
    interestedCourse?: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
  leadName: string;
};

export type LeadStatus =
  | "New"
  | "Qualified"
  | "Interested"
  | "Follow Up"
  | "Admitted"
  | "Canceled"
  | "Unqualified";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Qualified",
  "Interested",
  "Follow Up",
  "Admitted",
  "Canceled",
  "Unqualified",
];

export type LeadSummary = {
  counts: Record<LeadStatus | "all", number>;
  trends: Record<LeadStatus, number>;
};
