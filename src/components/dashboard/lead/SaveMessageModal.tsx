// ✅ Save Message Modal with Group Select or Create (shadcn/ui + Tailwind + Success Message + Refresh Trigger)

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function SaveMessageModal({ open, onClose, message, onSaved }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      api.get("/message-groups").then((res) => setGroups(res.data));
    }
  }, [open]);

  const handleSave = async () => {
    if (!title || !message || (!selectedGroup && !newGroupName)) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      let groupId = selectedGroup;

      // If user entered a new group name, create it first
      if (!selectedGroup && newGroupName) {
        const res = await api.post("/message-groups", { name: newGroupName });
        groupId = res.data.id;
      }

      // Save message
      await api.post("/message-templates", {
        group_id: groupId,
        title,
        message,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      onSaved();
      // Optional: keep modal open if you want to save multiple messages
      // Otherwise uncomment next line to close
      // onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Save Message Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {success && (
            <div className="bg-green-100 text-green-700 text-sm p-2 rounded-md border border-green-300">
              ✅ Message saved successfully!
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700">
            Select Group
          </label>
          <Select
            value={selectedGroup}
            onValueChange={(v) => {
              setSelectedGroup(v);
              setNewGroupName("");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose existing group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={String(group.id)}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-gray-500 text-center">OR</div>

          <Input
            placeholder="Create new group"
            value={newGroupName}
            onChange={(e) => {
              setNewGroupName(e.target.value);
              setSelectedGroup("");
            }}
          />

          <Input
            placeholder="Template Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-md p-2 text-sm"
            placeholder="Message body (read-only)"
            value={message}
            readOnly
            rows={6}
          />

          <Button
            className="w-full mt-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
