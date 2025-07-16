// ✅ Full React + Tailwind + shadcn/ui Code for Your Design

"use client";

import { useToast } from "@/components/Toast/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/lib/axios";
import { useEffect, useState } from "react";

const statusFlow = {
  New: ["Qualified", "Unqualified"],
  Qualified: ["Interested", "Follow Up", "Unqualified"],
  Unqualified: ["Qualified"],
  Interested: ["Follow Up", "Canceled", "Admitted"],
  "Follow Up": ["Interested", "Canceled", "Admitted"],
  Canceled: [],
  Admitted: [],
};

// Status options and styles
const statusColors = [
  {
    value: "New",
    color: "bg-gray-100 text-gray-800",
    border: "border-gray-800",
  },
  {
    value: "Qualified",
    color: "bg-sky-100 text-sky-800",
    border: "border-sky-800",
  },
  {
    value: "Unqualified",
    color: "bg-rose-100 text-rose-800",
    border: "border-rose-800",
  },
  {
    value: "Interested",
    color: "bg-amber-100 text-amber-800",
    border: "border-amber-800",
  },
  {
    value: "Follow Up",
    color: "bg-orange-100 text-orange-800",
    border: "border-orange-800",
  },
  {
    value: "Admitted",
    color: "bg-green-100 text-green-800",
    border: "border-green-800",
  },
  {
    value: "Canceled",
    color: "bg-red-100 text-red-800",
    border: "border-red-800",
  },
];

export default function StatusBadgeWithDropdown({ leadId, status, onChange }) {
  const showToast = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [nextStatus, setNextStatus] = useState(null);
  const [courses, setCourses] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [interestedCourse, setInterestedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(false);
  const [lastStepRestrictionMessage, setLastStepRestrictionMessage] =
    useState(false);

  useEffect(() => {
    if (openDialog) {
      api.get("/courses").then((res) => {
        setCourses(res.data);
      });
    }
    console.log({
      new_status: nextStatus,
      remarks,
      appointment_date: appointmentDate,
      interested_course_id: interestedCourse,
    });
  }, [openDialog, remarks, appointmentDate, interestedCourse]);

  const checkStepsCount = (status: string) => {
    if (status === "Canceled" || status === "Admitted") {
      setLastStepRestrictionMessage(true);
      setTimeout(() => setLastStepRestrictionMessage(false), 1800);
    }
  };

  const handleSelectStatus = (s) => {
    setNextStatus(s);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!remarks.trim())
      return showToast({
        type: "error",
        title: "Something Went Wrong",
        message: "Remarks are required.",
      });

    if (nextStatus === "Follow Up") {
      if (!appointmentDate || !interestedCourse) {
        showToast({
          type: "error",
          title: "Something Went Wrong",
          message: "Appointment date and interested course are required.",
        });
        return;
      }
    }

    try {
      setLoading(true);
      await api.post(`/leads/${leadId}/status-step`, {
        new_status: nextStatus,
        remarks,
        appointment_date: appointmentDate,
        interested_course_id: interestedCourse,
      });

      onChange(nextStatus);
      setOpenDialog(false);
      setRemarks("");
      setAppointmentDate("");
      setInterestedCourse("");
    } catch (error) {
      showToast({
        type: "error",
        title: "Something Went Wrong",
        message: "Failed to update status.",
      });
    } finally {
      setLoading(false);
    }
  };

  const badgeStyle = statusColors.find((s) => s.value === status);

  return (
    <div className="relative inline-block">
      <Popover>
        <PopoverTrigger asChild>
          <button
            onClick={() => checkStepsCount(status)}
            className={`px-4 py-1 text-xs rounded-md border font-semibold cursor-pointer focus:outline-none transition ${badgeStyle?.color} ${badgeStyle?.border} shadow-sm`}
          >
            {status}
          </button>
        </PopoverTrigger>
        {/* Hide Dropdown for Canceled & Admitted */}
        {!(status === "Canceled" || status === "Admitted") && (
          <PopoverContent className="flex flex-col gap-2 p-3 rounded-md border bg-white shadow-xl">
            {(statusFlow[status] || []).map((s) => {
              const buttonStyle = statusColors.find((sc) => sc.value === s);
              return (
                <button
                  key={s}
                  onClick={() => handleSelectStatus(s)}
                  className={`
                        px-4 py-1 text-xs rounded-md border font-semibold cursor-pointer focus:outline-none transition
                        ${buttonStyle?.color} ${buttonStyle?.border} shadow-sm
                        hover:scale-105 hover:ring-2 hover:ring-blue-300
                      `}
                >
                  {s}
                </button>
              );
            })}
          </PopoverContent>
        )}
      </Popover>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Remarks for {nextStatus}</DialogTitle>
          </DialogHeader>

          {/* Error Message Displayed Here */}
          {error &&
            showToast({
              type: "error",
              title: "Something Went Wrong",
              message: error,
            })}

          {nextStatus === "Follow Up" && (
            <>
              <label className="text-sm font-medium text-gray-700 mt-2">
                Appointment Date
              </label>
              <Input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />

              <label className="text-sm font-medium text-gray-700 mt-2">
                Interested Course
              </label>
              <Select
                value={interestedCourse}
                onValueChange={setInterestedCourse}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <textarea
            className="w-full mt-2 border rounded p-2 min-h-[100px] text-sm"
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Status"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccess && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-1 z-50 flex flex-col items-center"
          style={{ boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.13)" }}
        >
          {/* Tail (triangle) */}
          <div
            className="w-3 h-3 bg-[#23272F] rounded rotate-45 mb-[-9px] shadow-2xl"
            style={{ boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.13)" }}
          />

          {/* Toast box */}
          <div
            className="
        bg-[#23272F]
        text-white
        font-bold
        text-[0.75rem]    /* approx 25-26px */
        leading-none
        px-2             /* wide horizontal padding */
        py-2             /* generous vertical padding */
        rounded-md
        shadow-md
        whitespace-nowrap
        select-none
        "
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.01em",
              boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.15)",
            }}
          >
            Status updated!
          </div>
        </div>
      )}

      {/* Inline Error Toast */}
      {showError && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-red-100 text-red-700 text-xs rounded shadow border border-red-200 z-50 whitespace-nowrap transition-opacity animate-fade-in">
          Failed to update.
        </div>
      )}
      {lastStepRestrictionMessage && (
        <div
          className="
              bg-[var(--color-chart-3)] absolute left-1/2 -translate-x-1/2 mt-1 px-3 py-1  text-white text-xs rounded shadow border border-[var(--color-chart-3)] z-50 whitespace-nowrap transition-opacity animate-fade-in"
          style={{
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.01em",
            boxShadow: "0px 10px 32px 0px rgba(0,0,0,0.15)",
          }}
        >
          This is Last Step !
        </div>
      )}
    </div>
  );
}
