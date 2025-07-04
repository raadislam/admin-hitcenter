export type Lead = {
  id: number;
  lead_id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  phone_number: string;
  course: string;
  status: "Interested" | "Follow Up" | "Canceled" | "Admitted";
  remarks: string;
};
