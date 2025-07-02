export type Lead = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  course: string;
  status: "Interested" | "Follow Up" | "Canceled" | "Admitted";
  remarks: string;
};
