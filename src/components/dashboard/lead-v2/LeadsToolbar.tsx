"use client";
import { useToast } from "@/components/Toast/ToastProvider";
import api from "@/lib/axios";
import { useState } from "react";
import AddLeadSidebar from "./AddLeadSidebar";

// components/LeadsToolbar.tsx

export function LeadsToolbar({ onSaved }: { onSaved: () => void }) {
  const showToast = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Submit new lead
  const handleCreateLead = async (leadData: any) => {
    setLoading(true);
    try {
      const res = await api.post("/leads", {
        name: leadData.name,
        phone_number: leadData.phone_number,
        email: leadData.email,
        remarks: leadData.remarks,
        interested_course_id: leadData.interested_course_id,
        status: leadData.status,
        contact_date: leadData.contact_date,
      });
      showToast({
        type: "success",
        title: "Lead created!",
        message: "Lead ID: " + res.data.data.lead_id,
      });
      setShowSidebar(false);
      onSaved();
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Failed to create lead",
        message: e?.response?.data?.message || "",
      });
    }
    setLoading(false);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="font-bold text-xl mt-6">Leads</h1>
          <div className="text-sm text-muted-foreground mb-4">
            Who have shown interest in a product or service
          </div>
        </div>
        <div className="flex gap-2">
          {/* <button
            onClick={() => setShowSidebar(true)}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-hover)] transition text-white font-medium shadow"
          >
            + New leads
          </button> */}
        </div>
      </div>

      <AddLeadSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSubmit={handleCreateLead}
        loading={loading}
      />
    </div>
  );
}
