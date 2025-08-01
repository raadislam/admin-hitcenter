"use client";
import { CustomTooltip } from "@/components/tooltip/CustomTooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useComposeStore } from "@/hooks/useComposeStore";
import { Lead } from "@/types/lead";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  IdCard,
  Mail,
  MessageSquare,
  Phone,
  Repeat,
} from "lucide-react";
import { useState } from "react";
import { StatusChangeDialog } from "./StatusChangeDialog";

export function LeadCard({
  lead,
  refresh,
}: {
  lead: Lead;
  refresh: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const timeline = Array.isArray(lead.status_history)
    ? lead.status_history
    : [];

  // Defensive: remove any undefined/null steps
  const safeTimeline = timeline.filter(Boolean);

  // Show all (oldest first) or just the latest (most recent)
  const displayedTimeline = showAll
    ? safeTimeline.slice().reverse() // Oldest at top, like a timeline
    : safeTimeline.length > 0
    ? [safeTimeline[0]] // Just the latest status
    : [];

  const statusColors: Record<string, string> = {
    New: "bg-gray-200 text-gray-800 border border-gray-300",
    Qualified: "bg-blue-100 text-blue-700 border border-blue-200",
    Unqualified: "bg-gray-300 text-gray-500 border border-gray-400",
    Interested: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    "Follow Up": "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Admitted: "bg-green-100 text-green-700 border border-green-200",
    Canceled: "bg-red-100 text-red-700 border border-red-200",
  };

  const { addRecipient, maximize } = useComposeStore();

  const onMessageClick = (lead: Lead) => {
    addRecipient({
      id: lead.id, // <-- Add this!
      email: lead.email,
      name: lead.name, // (Optional, for displaying in chip)
      type: "lead",
      status: lead.status,
    });
    maximize(); // Ensures window opens/maximizes
  };

  function getInitials(name?: string | null): string {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return (
    <div className="relative bg-white rounded-2xl border p-6 shadow-md flex flex-col gap-3 transition hover:shadow-lg duration-150">
      {/* Absolute Top-Right Icon Bar */}
      <div className="flex items-center gap-1 absolute top-3 right-3 z-10">
        {/* Call */}
        <CustomTooltip content="Call">
          <button
            onClick={() => window.open(`tel:${lead.phone_number}`, "_self")}
            className="rounded-full p-2 bg-white shadow-sm border hover:scale-110 focus:ring-2 focus:ring-green-200 transition-all"
            aria-label="Call"
            type="button"
          >
            <Phone className="w-5 h-5 text-gray-500" />
          </button>
        </CustomTooltip>
        {/* Change Status */}
        <CustomTooltip content="Change Status">
          <button
            onClick={() => setOpenStatusDialog(true)}
            className="rounded-full p-2 bg-white shadow-sm border hover:scale-110 focus:ring-2 focus:ring-blue-200 transition-all"
            aria-label="Change Status"
            type="button"
          >
            <Repeat className="w-5 h-5 text-gray-500" />
          </button>
        </CustomTooltip>
        {/* Message */}
        <CustomTooltip content="Message">
          <button
            onClick={() => onMessageClick(lead)}
            className="rounded-full p-2 bg-white shadow-sm border hover:scale-110 focus:ring-2 focus:ring-fuchsia-200 transition-all"
            aria-label="Message"
            type="button"
          >
            <MessageSquare className="w-5 h-5 text-gray-500" />
          </button>
        </CustomTooltip>
      </div>

      {/* Lead Info */}
      <div>
        <h2 className="font-bold text-lg mb-1">{lead.name}</h2>
        <div className="flex items-center text-sm text-gray-500 gap-4 mb-1">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" /> {lead.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" /> {lead.phone_number}
          </span>
        </div>
        <div className="flex items-center text-xs text-[var(--color-primary)]">
          <IdCard className="w-4 h-4 mr-1" /> {lead.lead_id}
        </div>
      </div>

      {/* Timeline: Collapsible */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-semibold">
          Status Timeline
        </div>
        {displayedTimeline.length === 0 && (
          <div className="text-xs text-gray-400">No status history yet.</div>
        )}
        {displayedTimeline.map((step, idx) => (
          <div
            key={step.id || idx}
            className="flex items-start gap-3 mb-3 pb-3 border-b last:border-0 last:mb-0 last:pb-0"
          >
            {/* Avatar */}
            <Avatar className="w-9 h-9 mt-1 border">
              {step?.changed_by?.avatar ? (
                <AvatarImage src={step.changed_by.avatar} />
              ) : (
                <AvatarFallback>
                  {getInitials(step?.changed_by?.name)}
                </AvatarFallback>
              )}
            </Avatar>
            {/* Timeline Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    statusColors[step.new_status] || "bg-gray-100 text-gray-700"
                  }
                >
                  {step.new_status}
                </Badge>
                <span className="text-xs text-gray-400">
                  {step.created_at
                    ? formatDistanceToNow(parseISO(step.created_at), {
                        addSuffix: true,
                      })
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-xs text-gray-700">
                  {step?.changed_by?.name || "Unknown"}
                </span>
                {step?.appointment_date && (
                  <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5">
                    Appointment: {step.appointment_date}
                  </span>
                )}
                {step?.interested_course && (
                  <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5">
                    Course: {step.interested_course.name}
                  </span>
                )}
              </div>
              {step?.remarks && (
                <div className="italic text-xs mt-1 text-gray-500 border-l-2 border-green-100 pl-3">
                  “{step.remarks}”
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Show More / Show Less Button */}
        {safeTimeline.length > 1 && (
          <button
            className="flex items-center gap-1 mt-1 text-xs font-medium text-green-700 hover:underline transition"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      <StatusChangeDialog
        lead={lead}
        open={openStatusDialog}
        onOpenChange={setOpenStatusDialog}
        onChangeStatus={() => {
          // Handle your status update here
          refresh();
          setOpenStatusDialog(false);
        }}
      />
    </div>
  );
}
