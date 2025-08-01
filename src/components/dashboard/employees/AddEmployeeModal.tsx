"use client";
import { useToast } from "@/components/Toast/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  Department,
  EducationItem,
  EmployeeFormState,
} from "@/types/employees";
import { COUNTRIES } from "@/utils/countries";
import { RELIGIONS } from "@/utils/religions";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const defaultEmployeeState: EmployeeFormState = {
  avatar: null,
  name: "",
  job_title: "",
  email: "",
  phone: "",
  dob: "",
  country: "Bangladesh",
  religion: "",
  gender: "Male",
  department_id: null,
  employment_type: "Full time",
  joining_date: "",
  card_number: "",
  salary: "",
  bank_account_name: "",
  bank_account_number: "",
  present_address: "",
  permanent_address: "",
  sameAsPresent: false,
  cv: null,
  educations: [{ institution: "", qualification: "", gpa: "", year: "" }],
};

export default function AddEmployeeModal() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [employee, setEmployee] =
    useState<EmployeeFormState>(defaultEmployeeState);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [onboardingPassword, setOnboardingPassword] = useState<string | null>(
    null
  );
  // CV upload
  const cvRef = useRef<HTMLInputElement>(null);
  const [cvUploading, setCvUploading] = useState(false);
  // Departments
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showDeptInput, setShowDeptInput] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [addingDept, setAddingDept] = useState(false);

  const showToast = useToast();

  // Fetch department list
  useEffect(() => {
    api.get("departments").then((res) => setDepartments(res.data));
  }, []);

  // Add department and select after add
  const handleAddDept = async () => {
    if (!newDeptName.trim()) return;
    setAddingDept(true);
    try {
      const res = await api.post("departments", {
        name: newDeptName.trim(),
      });
      setDepartments((prev) => [...prev, res.data.department]);
      setEmployee((prev) => ({
        ...prev,
        department_id: res.data.department.id,
      }));
      setShowDeptInput(false);
      setNewDeptName("");
    } catch (err: any) {
      showToast({
        title: "Department creation failed",
        message:
          err.response?.data?.errors?.name?.[0] ||
          "Could not create department.",
        type: "error",
      });
    }
    setAddingDept(false);
  };

  // Submission & FormData
  function employeeToFormData(employee: EmployeeFormState) {
    const formData = new FormData();

    Object.entries(employee).forEach(([key, value]) => {
      if (
        [
          "avatar", // file, handled below
          "cv", // file, handled below
          "educations", // handled below
          "sameAsPresent",
          "present_address",
          "permanent_address",
        ].includes(key)
      ) {
        return;
      }
      if (typeof value === "string" || typeof value === "number") {
        formData.append(key, value as any);
      }
    });

    if (employee.avatar) {
      formData.append("avatar", employee.avatar);
    }
    if (employee.cv) {
      formData.append("cv", employee.cv);
    }

    formData.append("present_address", employee.present_address || "");
    formData.append("permanent_address", employee.permanent_address || "");

    employee.educations.forEach((edu, idx) => {
      formData.append(`educations[${idx}][institution]`, edu.institution);
      formData.append(`educations[${idx}][qualification]`, edu.qualification);
      formData.append(`educations[${idx}][gpa]`, edu.gpa);
      formData.append(`educations[${idx}][year]`, edu.year);
    });

    return formData;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    const formData = employeeToFormData(employee);

    try {
      const res = await api.post("employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOnboardingPassword(res.data.onboarding_password);
      showToast({
        title: "Employee Created",
        message: "Employee ID: " + res.data.employee_id,
        type: "success",
      });
      resetForm();
      // If you want to refresh department list (in case a new one was added, not needed here)
      // axios.get("/api/departments").then((res) => setDepartments(res.data));
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        showToast({
          type: "error",
          message: "An unexpected error occurred.",
          title: "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (file: File | null) => {
    setEmployee((prev) => ({ ...prev, avatar: file }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploading(true);
      handleProfilePicChange(file);
      setTimeout(() => setUploading(false), 900);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      handleProfilePicChange(file);
      setTimeout(() => setUploading(false), 900);
    }
  };

  const handleRemove = () => {
    handleProfilePicChange(null);
    setUploading(false);
  };

  const handleClick = () => fileRef.current?.click();
  const handleCvClick = () => cvRef.current?.click();

  const handlecvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvUploading(true);
      setEmployee((prev) => ({ ...prev, cv: file }));
      setTimeout(() => setCvUploading(false), 900);
    }
  };

  const handleCvDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvUploading(true);
      setEmployee((prev) => ({ ...prev, cv: file }));
      setTimeout(() => setCvUploading(false), 900);
    }
  };

  const handleCvRemove = () => {
    setEmployee((prev) => ({ ...prev, cv: null }));
    setCvUploading(false);
  };

  // Education
  const handleEducationChange = (
    idx: number,
    key: keyof EducationItem,
    value: string
  ) => {
    setEmployee((prev) => ({
      ...prev,
      educations: prev.educations.map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addEducation = () => {
    setEmployee((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        { institution: "", qualification: "", gpa: "", year: "" },
      ],
    }));
  };

  const removeEducation = (idx: number) => {
    setEmployee((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== idx),
    }));
  };

  // Reset
  const resetForm = () => {
    setStep(0);
    setEmployee(defaultEmployeeState);
    setErrors({});
    setUploading(false);
    setCvUploading(false);
    setShowDeptInput(false);
    setNewDeptName("");
    setOnboardingPassword(null);
  };

  // Auto-scroll to first error (optional)
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0];
      const el = document.getElementsByName(firstField)[0];
      if (el)
        (el as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }
  }, [errors]);

  // Stepper
  const steps = ["Basic information", "Employment type", "Education details"];

  return (
    <div className="w-5xl bg-white rounded-md shadow-lg p-7 mx-auto">
      {/* Stepper */}
      <div className="flex border-b mb-6">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 text-center">
            <button
              type="button"
              className={cn(
                "pb-2 px-2 text-[15px] font-medium transition",
                i === step
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-[#B2B3B8]",
                i > step && "cursor-not-allowed opacity-50"
              )}
              onClick={() => {
                if (i <= step) setStep(i);
              }}
              disabled={i > step}
            >
              {label}
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 rounded bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            <b className="block mb-1">Please fix the following errors:</b>
            <ul className="list-disc list-inside space-y-0.5 text-sm">
              {Object.entries(errors).map(([field, messages]) =>
                messages.map((msg, i) => <li key={field + i}>{msg}</li>)
              )}
            </ul>
          </div>
        )}
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            {/* Profile Picture */}
            <div className="mb-2">
              <label className="block font-medium text-[16px] mb-2">
                Profile picture
              </label>
              <div
                className={`w-full rounded-xl transition min-h-[90px] flex items-center px-7 py-6 cursor-pointer
                  ${
                    uploading
                      ? "bg-[#E8F1FF] border-none"
                      : "bg-[#FAFBFD] border border-dashed border-[#E3E5E8] hover:bg-[#F2F6FA]"
                  }
                `}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="relative flex items-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#E4EBFA]">
                    <svg
                      width={30}
                      height={30}
                      fill="none"
                      stroke="#7C8DB0"
                      strokeWidth={1.7}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="9" r="4.2" />
                      <path d="M4.5 19.2c0-2.5 3.4-4.2 7.5-4.2s7.5 1.7 7.5 4.2" />
                    </svg>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full border border-[#D5E1FB] w-7 h-7 flex items-center justify-center">
                      <svg
                        width={20}
                        height={20}
                        fill="none"
                        stroke="#2D8CFF"
                        strokeWidth={1.5}
                        viewBox="0 0 20 20"
                      >
                        <rect x={3.5} y={6.5} width={13} height={9} rx={2} />
                        <circle cx={10} cy={11} r={2.2} />
                        <rect x={8} y={3} width={4} height={3} rx={1.2} />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  {uploading ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#86B6F6"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="#3085F0"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      <span className="text-[#5C6F90] font-medium">
                        Uploading...
                      </span>
                    </div>
                  ) : !employee.avatar ? (
                    <>
                      <span className="text-[#6178A8] font-medium">
                        Drop your photo here or{" "}
                        <span
                          className="text-[#298BFD] underline hover:text-blue-700 cursor-pointer"
                          onClick={handleClick}
                        >
                          Select a file
                        </span>
                      </span>
                      <div className="text-[12px] text-[#A3B1C8] mt-1">
                        Supports: JPG, PNG.
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Image
                        src={URL.createObjectURL(employee.avatar)}
                        alt="Profile preview"
                        height={57}
                        width={57}
                        className="rounded-full border border-[#D5E1FB] object-cover"
                      />
                      <span className="text-[#6178A8] font-medium">
                        {employee.avatar.name}
                      </span>
                      <span
                        className="ml-2 text-[13px] text-[#3085F0] underline cursor-pointer"
                        onClick={handleRemove}
                      >
                        Remove
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {errors.avatar && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.avatar[0]}
                </div>
              )}
            </div>
            {/* Name */}
            <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
              Employee name
              <Input
                placeholder="John Doe Pandey"
                value={employee.name ?? ""}
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                name="name"
              />
              {errors.name && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.name[0]}
                </div>
              )}
            </label>
            {/* DOB */}
            <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
              Date of birth
              <Input
                type="date"
                value={employee.dob ?? ""}
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    dob: e.target.value,
                  }))
                }
                name="dob"
              />
              {errors.dob && (
                <div className="text-xs text-red-500 mt-1">{errors.dob[0]}</div>
              )}
            </label>
            {/* Job title */}
            <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
              Job title
              <Input
                placeholder="Product Designer"
                value={employee.job_title ?? ""}
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    job_title: e.target.value,
                  }))
                }
                name="job_title"
              />
              {errors.job_title && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.job_title[0]}
                </div>
              )}
            </label>
            {/* Email & Phone */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Email address
                  <Input
                    placeholder="abc@example.com"
                    value={employee.email ?? ""}
                    onChange={(e) =>
                      setEmployee((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    name="email"
                  />
                  {errors.email && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.email[0]}
                    </div>
                  )}
                </label>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Phone number
                  <Input
                    placeholder="+123 456 789"
                    value={employee.phone ?? ""}
                    onChange={(e) =>
                      setEmployee((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    name="phone"
                  />
                  {errors.phone && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.phone[0]}
                    </div>
                  )}
                </label>
              </div>
            </div>
            {/* Country & Religion */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Country
                </label>
                <Select
                  value={employee.country ?? ""}
                  onValueChange={(v) =>
                    setEmployee((prev) => ({ ...prev, country: v }))
                  }
                  name="country"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.country[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Religion
                </label>
                <Select
                  value={employee.religion ?? ""}
                  onValueChange={(v) =>
                    setEmployee((prev) => ({ ...prev, religion: v }))
                  }
                  name="religion"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELIGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.religion && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.religion[0]}
                  </div>
                )}
              </div>
            </div>
            {/* Department */}
            {/* Department */}
            <div>
              <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                Department
              </label>
              {!showDeptInput ? (
                <Select
                  value={
                    employee.department_id ? String(employee.department_id) : ""
                  }
                  onValueChange={(v) => {
                    if (v === "__new") setShowDeptInput(true);
                    else
                      setEmployee((prev) => ({
                        ...prev,
                        department_id: Number(v),
                      }));
                  }}
                  name="department_id"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep.id} value={String(dep.id)}>
                        {dep.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new">+ New Department</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Department name"
                    value={newDeptName ?? ""}
                    onChange={(e) => setNewDeptName(e.target.value)}
                  />
                  <Button
                    type="button"
                    disabled={addingDept}
                    onClick={handleAddDept}
                  >
                    {addingDept ? "Adding..." : "Add"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowDeptInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {errors.department_id && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.department_id[0]}
                </div>
              )}
            </div>
            {/* Gender segmented */}
            <div>
              <label className="block text-sm mb-1 font-medium text-[#3C3D3F] mb-2">
                Gender
              </label>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={
                      "px-6 py-2 rounded-md font-medium border border-[#EEE] transition-all duration-75 " +
                      (employee.gender === g
                        ? "bg-[#FF5307] text-white"
                        : "bg-white text-[#252525] hover:bg-[#F7F7F7]")
                    }
                    onClick={() =>
                      setEmployee((prev) => ({ ...prev, gender: g }))
                    }
                    style={{
                      minWidth: 80,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.gender[0]}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Employment */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Full time / Contractual segmented */}
            <div>
              <label className="block text-sm mb-1 font-medium text-[#3C3D3F] mb-2">
                Employment type
              </label>
              <div className="flex gap-2">
                {["Full time", "Contractual"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={
                      "px-6 py-2 rounded-md font-medium border border-[#EEE] transition-all duration-75 " +
                      (employee.employment_type === type
                        ? "bg-[#FF5307] text-white"
                        : "bg-white text-[#252525] hover:bg-[#F7F7F7]")
                    }
                    onClick={() =>
                      setEmployee((prev) => ({
                        ...prev,
                        employment_type: type,
                      }))
                    }
                    style={{ minWidth: 110 }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.employment_type && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.employment_type[0]}
                </div>
              )}
            </div>
            {/* Joining date & Card number */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Date of joining
                  <Input
                    type="date"
                    value={employee.joining_date}
                    onChange={(e) =>
                      setEmployee((prev) => ({
                        ...prev,
                        joining_date: e.target.value,
                      }))
                    }
                    name="joining_date"
                  />
                  {errors.joining_date && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.joining_date[0]}
                    </div>
                  )}
                </label>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Card Number
                  <Input
                    placeholder="Card Number"
                    value={employee.card_number}
                    onChange={(e) =>
                      setEmployee((prev) => ({
                        ...prev,
                        card_number: e.target.value,
                      }))
                    }
                    name="card_number"
                  />
                  {errors.card_number && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.card_number[0]}
                    </div>
                  )}
                </label>
              </div>
            </div>
            {/* Salary */}
            <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
              Salary
              <Input
                placeholder="$120,000/year"
                value={employee.salary}
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    salary: e.target.value,
                  }))
                }
                name="salary"
              />
              {errors.salary && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.salary[0]}
                </div>
              )}
            </label>
            {/* Bank Details */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Bank A/C Name
                  <Input
                    placeholder="Account Name"
                    value={employee.bank_account_name}
                    onChange={(e) =>
                      setEmployee((prev) => ({
                        ...prev,
                        bank_account_name: e.target.value,
                      }))
                    }
                    name="bank_account_name"
                  />
                  {errors.bank_account_name && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.bank_account_name[0]}
                    </div>
                  )}
                </label>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
                  Bank A/C Number
                  <Input
                    placeholder="Account Number"
                    value={employee.bank_account_number}
                    onChange={(e) =>
                      setEmployee((prev) => ({
                        ...prev,
                        bank_account_number: e.target.value,
                      }))
                    }
                    name="bank_account_number"
                  />
                  {errors.bank_account_number && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.bank_account_number[0]}
                    </div>
                  )}
                </label>
              </div>
            </div>
            {/* Present & Permanent Address */}
            <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
              Present Address
              <Input
                placeholder="Present Address"
                value={employee.present_address}
                onChange={(e) => {
                  const val = e.target.value;
                  setEmployee((prev) => ({
                    ...prev,
                    present_address: val,
                    permanent_address: prev.sameAsPresent
                      ? val
                      : prev.permanent_address,
                  }));
                }}
                name="present_address"
              />
              {errors.present_address && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.present_address[0]}
                </div>
              )}
            </label>
            <div className="flex items-center gap-2 mb-1">
              <input
                id="sameAsPresent"
                type="checkbox"
                checked={employee.sameAsPresent}
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    sameAsPresent: e.target.checked,
                    permanent_address: e.target.checked
                      ? prev.present_address
                      : prev.permanent_address,
                  }))
                }
              />
              <label htmlFor="sameAsPresent" className="text-sm font-medium">
                Permanent address is same as Present Address
              </label>
            </div>
            <label className="block text-sm mb-1 font-medium text-[#3C3D3F]">
              Permanent Address
              <Input
                placeholder="Permanent Address"
                value={employee.permanent_address}
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    permanent_address: e.target.value,
                  }))
                }
                name="permanent_address"
                disabled={employee.sameAsPresent}
              />
              {errors.permanent_address && (
                <div className="text-xs text-red-500 mt-1">
                  {errors.permanent_address[0]}
                </div>
              )}
            </label>
            {/* Upload CV */}
            <div>
              <label className="block font-medium text-[16px] mb-2">
                Upload CV
              </label>
              <div
                className={`w-full rounded-xl transition min-h-[78px] flex items-center px-7 py-6 cursor-pointer
                  ${
                    cvUploading
                      ? "bg-[#E8F1FF] border-none"
                      : "bg-[#FAFBFD] border border-dashed border-[#E3E5E8] hover:bg-[#F2F6FA]"
                  }
                `}
                onClick={handleCvClick}
                onDrop={handleCvDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="relative flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E4EBFA]">
                    <svg
                      width={26}
                      height={26}
                      fill="none"
                      stroke="#7C8DB0"
                      strokeWidth={1.6}
                      viewBox="0 0 24 24"
                    >
                      <rect x={5.5} y={3.5} width={13} height={17} rx={2.5} />
                      <rect
                        x={8}
                        y={7}
                        width={8}
                        height={1.2}
                        rx={0.6}
                        fill="#7C8DB0"
                      />
                      <rect
                        x={8}
                        y={11}
                        width={8}
                        height={1.2}
                        rx={0.6}
                        fill="#7C8DB0"
                      />
                      <rect
                        x={8}
                        y={15}
                        width={5}
                        height={1.2}
                        rx={0.6}
                        fill="#7C8DB0"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  {cvUploading ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#86B6F6"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="#3085F0"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      <span className="text-[#5C6F90] font-medium">
                        Uploading...
                      </span>
                    </div>
                  ) : !employee.cv ? (
                    <>
                      <span className="text-[#6178A8] font-medium">
                        Drop your PDF here or{" "}
                        <span
                          className="text-[#298BFD] underline hover:text-blue-700 cursor-pointer"
                          onClick={handleCvClick}
                        >
                          Select a file
                        </span>
                      </span>
                      <div className="text-[12px] text-[#A3B1C8] mt-1">
                        Supports: PDF only.
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[#6178A8] font-medium">
                        {employee.cv.name}
                      </span>
                      <span
                        className="ml-2 text-[13px] text-[#3085F0] underline cursor-pointer"
                        onClick={handleCvRemove}
                      >
                        Remove
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={cvRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlecvChange}
                />
              </div>
              {errors.cv && (
                <div className="text-xs text-red-500 mt-1">{errors.cv[0]}</div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="block font-medium text-[16px]">
                Education Details
              </label>
              <Button type="button" size="sm" onClick={addEducation}>
                + Add
              </Button>
            </div>
            {employee.educations.map((edu, idx) => (
              <div
                key={idx}
                className="flex items-end gap-2 border p-3 rounded-md mb-1"
              >
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm mb-1 font-medium">
                    Institution Name
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          idx,
                          "institution",
                          e.target.value
                        )
                      }
                      placeholder="Institution"
                      name={`educations.${idx}.institution`}
                    />
                    {errors[`educations.${idx}.institution`] && (
                      <div className="text-xs text-red-500 mt-1">
                        {errors[`educations.${idx}.institution`][0]}
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex-1 min-w-[110px]">
                  <label className="block text-sm mb-1 font-medium">
                    Qualification
                    <Input
                      value={edu.qualification}
                      onChange={(e) =>
                        handleEducationChange(
                          idx,
                          "qualification",
                          e.target.value
                        )
                      }
                      placeholder="B.Sc, HSC, etc."
                      name={`educations.${idx}.qualification`}
                    />
                    {errors[`educations.${idx}.qualification`] && (
                      <div className="text-xs text-red-500 mt-1">
                        {errors[`educations.${idx}.qualification`][0]}
                      </div>
                    )}
                  </label>
                </div>
                <div className="w-20">
                  <label className="block text-sm mb-1 font-medium">
                    GPA
                    <Input
                      value={edu.gpa}
                      onChange={(e) =>
                        handleEducationChange(idx, "gpa", e.target.value)
                      }
                      placeholder="GPA"
                      name={`educations.${idx}.gpa`}
                    />
                    {errors[`educations.${idx}.gpa`] && (
                      <div className="text-xs text-red-500 mt-1">
                        {errors[`educations.${idx}.gpa`][0]}
                      </div>
                    )}
                  </label>
                </div>
                <div className="w-24">
                  <label className="block text-sm mb-1 font-medium">
                    Year
                    <Input
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(idx, "year", e.target.value)
                      }
                      placeholder="Year"
                      name={`educations.${idx}.year`}
                    />
                    {errors[`educations.${idx}.year`] && (
                      <div className="text-xs text-red-500 mt-1">
                        {errors[`educations.${idx}.year`][0]}
                      </div>
                    )}
                  </label>
                </div>
                {employee.educations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-lg"
                    onClick={() => removeEducation(idx)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "rounded-lg px-6 text-[#74788D] border border-[#E5E6E9]",
              step === 0 && "opacity-40 pointer-events-none"
            )}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Previous
          </Button>
          {!loading ? (
            <Button type="submit" className="rounded-lg px-7">
              {step < 2 ? "Next" : "Add"}
            </Button>
          ) : (
            <Button disabled className="rounded-lg px-7">
              {"Adding ..."}
            </Button>
          )}
        </div>
        {onboardingPassword && (
          <div className="mt-4 p-3 rounded bg-blue-50 text-blue-800 text-sm font-medium">
            <b>Onboarding Password:</b> {onboardingPassword}
          </div>
        )}
      </form>
    </div>
  );
}
