export type Recipient = {
  id: string | number;
  email: string;
  name: string;
  status: string;
  type: "lead" | "employee" | "student";
};
