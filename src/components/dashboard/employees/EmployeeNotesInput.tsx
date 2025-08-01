// components/employees/EmployeeNotesInput.tsx
"use client";

import { useToast } from "@/components/Toast/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addNote } from "@/hooks/useAddNote";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

type Props = {
  employeeId: string;
  onNoteAdded: () => Promise<void>; // ← Accepts async
};

export default function EmployeeNotesInput({ employeeId, onNoteAdded }: Props) {
  const showToast = useToast();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!note.trim()) return;

    setLoading(true);
    try {
      await addNote(employeeId, note);
      showToast({
        type: "success",
        title: "Saved",
        message: "Note saved successfully",
      });
      setNote("");
      await onNoteAdded(); // Refresh notes list
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Something Went Wrong",
        message: err.response?.data?.message || "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
      <Input
        className="border-0 focus:ring-0 focus-visible:ring-0 text-sm flex-1 placeholder:text-gray-400"
        placeholder="Write note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />

      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleSave}
        className="text-gray-600 hover:text-primary ml-2"
      >
        <SendHorizonal size={18} />
      </Button>
    </div>
  );
}
