// ✅ Refactored FetchSavedMessageModal using shadcn/ui and Tailwind

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function FetchSavedMessageModal({ open, onClose, onImport }) {
  const [groups, setGroups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  useEffect(() => {
    if (open) {
      api.get("/message-groups").then((res) => setGroups(res.data));
    }
  }, [open]);

  useEffect(() => {
    if (selectedGroup) {
      api
        .get("/message-templates", { params: { group_id: selectedGroup } })
        .then((res) => setTemplates(res.data));
    } else {
      setTemplates([]);
    }
  }, [selectedGroup]);

  const handleImport = () => {
    const selected = templates.find((t) => String(t.id) === selectedTemplateId);
    if (selected) {
      onImport(selected);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Import Saved Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Group
          </label>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={String(group.id)}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="block text-sm font-medium text-gray-700">
            Select Template
          </label>
          <Select
            value={selectedTemplateId}
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={String(template.id)}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full mt-3"
            onClick={handleImport}
            disabled={!selectedTemplateId}
          >
            Import Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
