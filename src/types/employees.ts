export type Department = { id: number; name: string };

export type EducationItem = {
  institution: string;
  qualification: string;
  gpa: string;
  year: string;
};

export type EmployeeFormState = {
  avatar: File | null;
  name: string;
  job_title: string;
  email: string;
  phone: string;
  dob: string;
  country: string;
  religion: string;
  gender: string;
  department_id: number | null;
  employment_type: string;
  joining_date: string;
  card_number: string;
  salary: string;
  bank_account_name: string;
  bank_account_number: string;
  present_address: string;
  permanent_address: string;
  sameAsPresent: boolean;
  cv: File | null;
  educations: EducationItem[];
};

export interface EmployeeEducation {
  qualification: string;
  institute: string | null;
  year: string;
  result: string | null;
}

export interface EmployeeNote {
  id: number;
  note: string;
  created_at: string;
  added_by: string | null;
}

export interface EmployeeLog {
  id: number;
  action: string;
  created_at: string;
  performed_by: string | null;
}

export interface EmployeeDetail {
  user_id: number;
  id: number;
  external_id: string;
  name: string;
  email: string;
  avatar: string;
  job_title: string;
  employment_type: string;
  permanent_address: string;
  gender: string;
  religion: string;
  dob: string;
  bank_account_number: string;
  bank_account_name: string;
  card_number: string;
  phone: string;
  country: string;
  status: string;
  joining_date: string | null;
  salary: number;
  department: string;
  educations: EmployeeEducation[];
  notes: EmployeeNote[];
  logs: EmployeeLog[];
}

export type Note = {
  id: number;
  note: string;
  created_at: string;
  created_by: string;
};
