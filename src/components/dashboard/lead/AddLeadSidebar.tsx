"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type LeadForm = {
  name: string;
  email: string;
  phone_number: string;
  interested_course_id: string;
  status: string;
  remarks: string;
  contact_date: string;
};

export default function AddLeadSidebar({
  open,
  onClose,
  onSubmit,
  courses = [],
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadForm) => void;
  courses: Array<{ id: number; name: string }>;
  loading?: boolean;
}) {
  // Reset form when opening
  const initialState: LeadForm = {
    name: "",
    email: "",
    phone_number: "",
    interested_course_id: "",
    status: "Interested",
    remarks: "",
    contact_date: "",
  };
  const [form, setForm] = useState<LeadForm>(initialState);

  useEffect(() => {
    if (open) setForm(initialState);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end font-sans">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      {/* Sidebar */}
      <form
        className={`
          relative w-full max-w-[25vw] bg-white h-full shadow-2xl rounded-l-[0px]
          border-l-[2px] border-[var(--color-primary-option-three)]
          flex flex-col ${open ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ minWidth: 420 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700"
          aria-label="Close"
          type="button"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        {/* Content */}
        <div className="px-8 pt-8 pb-2 flex-1 flex flex-col gap-7 overflow-y-auto">
          <h2 className="text-[21px] font-semibold mb-3 text-gray-900 tracking-tight">
            Create a New Lead
          </h2>
          {/* Name */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-500 mb-1">
              Name
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-[10px] border border-[#E6E8EC] bg-[#F5F6FA] text-[15px] font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Interested Lead: Name of Student"
              required
            />
          </div>
          {/* phone_nUmber + email */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[15px] font-semibold text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E6E8EC] bg-[#F5F6FA] text-[15px] font-medium"
                value={form.phone_number}
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
                placeholder="+880 123456789"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-[15px] font-semibold text-gray-500 mb-1">
                Email
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E6E8EC] bg-[#F5F6FA] text-[15px] font-medium"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="interestedstd@hittcenter.com"
              />
            </div>
          </div>
          {/* remarks */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-500 mb-1">
              Remarks
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-[10px] border border-[#E6E8EC] bg-[#F5F6FA] text-[15px] font-medium resize-none"
              rows={3}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="Referenced By: A reputed Person. A social media and Google Ads campaign showcasing Damroy Food Indonesia’s ..."
            />
          </div>

          <h3 className="text-[17px] font-semibold text-gray-900">
            Other Information
          </h3>
          {/* Audience Row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[15px] font-semibold text-gray-500 mb-1">
                Contact Date
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E6E8EC] bg-[#F5F6FA] text-[15px] font-medium"
                value={form.contact_date}
                onChange={(e) =>
                  setForm({ ...form, contact_date: e.target.value })
                }
                placeholder="17/05/2025"
                type="date"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[15px] font-semibold text-gray-500 mb-1">
                Interested Course
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E6E8EC] bg-[#F5F6FA] text-[15px] font-medium"
                value={form.interested_course_id}
                onChange={(e) =>
                  setForm({ ...form, interested_course_id: e.target.value })
                }
                required
              >
                <option value="">Select a course</option>
                {courses.map((course: { id: number; name: string }) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Status */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-500 mb-2">
              Status
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-[10px] border border-[#E6E8EC] bg-[#F5F6FA] text-[15px] font-medium"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
            >
              <option>Interested</option>
              <option>Follow Up</option>
              <option>Canceled</option>
              <option>Admitted</option>
            </select>
          </div>
        </div>
        {/* Actions */}
        <div className="bg-white border-t border-gray-100 px-4 py-2 flex justify-end rounded-b-2xl">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white rounded-lg font-semibold shadow"
            style={{
              letterSpacing: "0.02em",
              boxShadow: "0px 4px 20px rgba(22,101,247,0.07)",
            }}
          >
            {loading ? "Saving..." : "Create Lead"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700  rounded-lg font-semibold shadow ml-2"
            style={{
              letterSpacing: "0.02em",
              boxShadow: "0px 4px 20px rgba(22,101,247,0.07)",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
