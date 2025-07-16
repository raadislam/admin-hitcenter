import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const STATUS_OPTIONS = [
  "Interested",
  "Follow Up",
  "Enrolled",
  "Not Interested",
];
const COURSE_OPTIONS = ["IELTS Basic", "IELTS Advanced", "Spoken English"];

export function LeadStatusModal({
  open,
  onOpenChange,
  lead,
  onStatusChange,
}: any) {
  const [status, setStatus] = useState(lead.status || "");
  const [remarks, setRemarks] = useState("");
  const [appointment, setAppointment] = useState("");
  const [course, setCourse] = useState("");

  const handleSubmit = () => {
    // TODO: Save to API/backend if needed
    onStatusChange?.({ status, remarks, appointment, course });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Status for {lead.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Select Status
            </label>
            <select
              className="border rounded px-3 py-2 w-full text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select...</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Remarks</label>
            <Textarea
              rows={2}
              placeholder="Add remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Appointment (optional)
            </label>
            <Input
              type="datetime-local"
              value={appointment}
              onChange={(e) => setAppointment(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Interested Course (optional)
            </label>
            <select
              className="border rounded px-3 py-2 w-full text-sm"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">Select a course...</option>
              {COURSE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
