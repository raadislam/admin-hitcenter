"use client";
import { useToast } from "@/components/Toast/ToastProvider";
import api from "@/lib/axios";
import Image from "next/image";
import { useState } from "react";

type LeadForm = {
  name: string;
  email: string;
  phone_number: string;
  interested_course_id: string;
  status: string;
  remarks: string;
  contact_date: string;
};

export default function AddLeadSidebar() {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);

  // 2. Submit new lead
  const handleCreateLead = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/leads", {
        name: form.name,
        phone_number: form.phone_number,
        email: form.email,
        remarks: form.remarks,
        interested_course_id: form.interested_course_id,
        status: form.status,
        contact_date: form.contact_date,
      });
      showToast({
        type: "success",
        title: "Lead created!",
        message: "Lead ID: " + res.data.data.lead_id,
      });
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Failed to create lead",
        message: e?.response?.data?.message || "",
      });
    }
    setLoading(false);
  };

  // Reset form when opening
  const initialState: LeadForm = {
    name: "",
    email: "",
    phone_number: "",
    interested_course_id: "",
    status: "New",
    remarks: "",
    contact_date: "",
  };
  const [form, setForm] = useState<LeadForm>(initialState);

  return (
    <div>
      <section className="relative w-full py-8 px-4 flex items-center justify-between max-w-5xl mx-auto min-h-[112px]">
        <div className=" flex-1">
          <h1 className="text-[28px] leading-8 font-semibold text-[#2b2c2c] mb-1">
            Find, Track, and Convert Leads{" "}
            <span className="text-[var(--color-primary)] font-semibold">
              Effortlessly
            </span>
            <br />
            Start Growing Today!
          </h1>
          <p className="text-[15px] text-[#777A7A] font-medium leading-[22px] mt-2 w-2xl">
            Know your audience better! Generate, track, and convert leads with
            our powerful Lead Generator
          </p>
        </div>
        <div className="-z-0 absolute right-0 top-1.5  ml-6">
          <Image
            src="/generic/form/leads.png"
            alt="leads"
            width={170}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      </section>
      <div className="relative z-20 w-full">
        <form
          className="bg-white rounded-md border shadow-sm max-w-5xl mx-auto px-4 py-4"
          style={{ minWidth: 420 }}
          onSubmit={(e) => {
            handleCreateLead(e);
          }}
        >
          {/* Content */}
          <div className="px-8 py-5 flex-1 flex flex-col gap-7 overflow-y-auto">
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
          </div>
        </form>
      </div>
    </div>
  );
}
