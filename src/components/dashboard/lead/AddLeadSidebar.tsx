"use client";
import { X } from "lucide-react";
import { useState } from "react";

export default function AddLeadSidebar({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "",
    course: "",
    status: "Interested",
    remarks: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end font-sans">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div
        className={`
          relative w-full max-w-[410px] bg-white h-full shadow-2xl rounded-l-[22px]
          border-l-[5px] border-[#1665F7]
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close Button */}
        <button
          className="absolute top-7 right-7 p-2 rounded-full text-gray-400 hover:text-gray-700 transition focus:outline-none"
          aria-label="Close"
          type="button"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Content */}
        <form
          className="flex flex-col gap-7 px-10 pt-14 pb-5 flex-1 overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <h2 className="text-[20px] font-bold mb-2 text-gray-900 tracking-tight leading-snug">
            Add New Lead
          </h2>
          {/* Fields */}
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">
                Name
              </label>
              <input
                className="w-full px-5 py-1 rounded-sm border border-[#E6E8EC] bg-[#F4F6FB] text-[14px] placeholder:text-gray-400 font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition"
                value={form.name}
                autoComplete="off"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
                required
              />
            </div>
            {/* Email & Phone */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[15px] font-semibold text-gray-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-1 rounded-sm border border-[#E6E8EC] bg-[#F4F6FB] text-[14px] placeholder:text-gray-400 font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition"
                  value={form.email}
                  autoComplete="off"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@email.com"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-[15px] font-semibold text-gray-500 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-5 py-3 rounded-[13px] border border-[#E6E8EC] bg-[#F4F6FB] text-[16px] placeholder:text-gray-400 font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition"
                  value={form.phone}
                  autoComplete="off"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
            {/* Batch & Course */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[15px] font-semibold text-gray-500 mb-2">
                  Batch
                </label>
                <input
                  className="w-full px-5 py-3 rounded-[13px] border border-[#E6E8EC] bg-[#F4F6FB] text-[16px] placeholder:text-gray-400 font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition"
                  value={form.batch}
                  onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  placeholder="Batch (eg. 2024-A)"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-[15px] font-semibold text-gray-500 mb-2">
                  Course
                </label>
                <input
                  className="w-full px-5 py-3 rounded-[13px] border border-[#E6E8EC] bg-[#F4F6FB] text-[16px] placeholder:text-gray-400 font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  placeholder="Interested Course"
                  required
                />
              </div>
            </div>
            {/* Status */}
            <div>
              <label className="block text-[15px] font-semibold text-gray-500 mb-2">
                Status
              </label>
              <select
                className="w-full px-5 py-3 rounded-[13px] border border-[#E6E8EC] bg-[#F4F6FB] text-[16px] font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition"
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
            {/* Remarks */}
            <div>
              <label className="block text-[15px] font-semibold text-gray-500 mb-2">
                Remarks
              </label>
              <textarea
                rows={3}
                className="w-full px-5 py-3 rounded-[13px] border border-[#E6E8EC] bg-[#F4F6FB] text-[16px] placeholder:text-gray-400 font-medium focus:border-[#1665F7] focus:bg-white focus:outline-none transition resize-none"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>
          {/* Save Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 text-lg font-bold rounded-full bg-[#1665F7] hover:bg-[#1552c9] text-white shadow transition"
            style={{
              letterSpacing: "0.02em",
              boxShadow: "0px 4px 20px rgba(22,101,247,0.07)",
              minHeight: "56px",
            }}
          >
            Add Lead
          </button>
        </form>
      </div>
    </div>
  );
}
