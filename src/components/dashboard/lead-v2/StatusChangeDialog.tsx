import { useToast } from "@/components/Toast/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

// --- statusFlow here as before ---
const statusFlow: Record<string, string[]> = {
  New: ["Qualified", "Unqualified"],
  Qualified: ["Interested", "Follow Up", "Unqualified"],
  Unqualified: ["Qualified"],
  Interested: ["Follow Up", "Canceled", "Admitted"],
  "Follow Up": ["Interested", "Canceled", "Admitted"],
  Canceled: [],
  Admitted: [],
};

export function StatusChangeDialog({
  lead,
  open,
  onOpenChange,
  onChangeStatus,
}: {
  lead: any;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChangeStatus: () => void;
}) {
  const showToast = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [appointment, setAppointment] = useState("");
  const [interestedCourseId, setInterestedCourseId] = useState<
    number | undefined
  >();
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState([]);

  // Use provided shortcut if available, else fallback:
  const currentStatus =
    lead.current_status || (lead.status_history?.[0]?.new_status ?? "New");

  const allowedNextStatuses = statusFlow[currentStatus] || [];

  useEffect(() => {
    if (open) {
      api.get("/courses").then((res) => {
        setCourses(res.data);
      });
    }
  }, [open]);

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setSelectedStatus(undefined);
      setAppointment("");
      setInterestedCourseId(undefined);
      setRemarks("");
      setError(null);
    }
  }, [open]);

  // For Confirm button disabled logic:
  const isFollowUp = selectedStatus === "Follow Up";
  const canConfirm =
    !!selectedStatus &&
    (isFollowUp
      ? appointment && interestedCourseId && remarks.trim()
      : remarks.trim());

  const handleConfirm = async () => {
    if (!remarks.trim()) {
      showToast({
        type: "error",
        title: "Something Went Wrong",
        message: "Remarks are required.",
      });
      return;
    }

    if (selectedStatus === "Follow Up") {
      if (!appointment || !interestedCourseId) {
        showToast({
          type: "error",
          title: "Something Went Wrong",
          message: "Appointment date and interested course are required.",
        });
        return;
      }
    }

    try {
      await api.post(`/leads/${lead.id}/status-step`, {
        new_status: selectedStatus,
        remarks,
        appointment_date:
          selectedStatus === "Follow Up" ? appointment : undefined,
        interested_course_id:
          selectedStatus === "Follow Up" ? interestedCourseId : undefined,
      });

      // Callback to parent to refresh, etc.
      onChangeStatus();
      setRemarks("");
      setAppointment("");
      setInterestedCourseId(undefined);
      showToast({
        type: "success",
        title: "Status Updated",
        message: "Lead status updated successfully.",
      });
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Something Went Wrong",
        message: e?.response?.data?.message || "Failed to update status.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Lead Status</DialogTitle>
          <DialogDescription>
            {allowedNextStatuses.length === 0
              ? "No further status transitions available."
              : "Please select a new status for this lead."}
          </DialogDescription>
        </DialogHeader>
        {allowedNextStatuses.length > 0 && (
          <div className="space-y-1">
            {/* Status select (always enabled) */}
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                setSelectedStatus(val);
                setError(null);
              }}
            >
              <SelectTrigger className="w-full mb-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {allowedNextStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Only show these if status is Follow Up */}
            {isFollowUp && (
              <>
                <label className="block text-xs text-gray-500 mb-0.5 mt-1">
                  Appointment Date
                </label>
                <Input
                  type="date"
                  value={appointment}
                  onChange={(e) => {
                    setAppointment(e.target.value);
                    setError(null);
                  }}
                  className="mb-1"
                  disabled={!selectedStatus}
                />
                <label className="block text-xs text-gray-500 mb-0.5 mt-1">
                  Interested Course
                </label>
                <Select
                  value={interestedCourseId ? String(interestedCourseId) : ""}
                  onValueChange={(val) => {
                    setInterestedCourseId(Number(val));
                    setError(null);
                  }}
                  disabled={!selectedStatus}
                >
                  <SelectTrigger className="w-full mb-1">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c: any) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <label className="block text-xs text-gray-500 mb-0.5 mt-1">
              Remarks
            </label>
            <Textarea
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                setError(null);
              }}
              rows={2}
              placeholder="Enter remarks"
              className="mb-0"
              disabled={!selectedStatus}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        )}
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm || allowedNextStatuses.length === 0}
            type="button"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
