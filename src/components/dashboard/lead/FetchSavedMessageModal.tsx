// src/components/lead/FetchSavedMessageModal.tsx

import { Download, X } from "lucide-react";
import { useState } from "react";

export type MessageGroup = {
  id: number;
  name: string;
};

export type MessageTemplate = {
  id: number;
  groupId: number;
  title: string;
  message: string;
  parameters: string[];
};
export default function FetchSavedMessageModal({
  open,
  onClose,
  onImport,
  groups,
  templates,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (template: MessageTemplate) => void;
  groups: MessageGroup[];
  templates: MessageTemplate[];
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );

  const filteredTemplates = templates.filter(
    (t) => t.groupId === selectedGroupId
  );
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="relative w-[35vw] max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="p-8 flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Select a Saved Message
          </h2>
          {/* Divider */}
          <div className="border-b border-gray-100 -mx-8" />
          <div className="space-y-4">
            {/* Group */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Message Group
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#f5f8fb] text-base font-medium shadow focus:ring-2 focus:ring-blue-200"
                value={selectedGroupId ?? ""}
                onChange={(e) => {
                  setSelectedGroupId(Number(e.target.value) || null);
                  setSelectedTemplateId(null);
                }}
              >
                <option value="">Select group...</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Message */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Message
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#f5f8fb] text-base font-medium shadow focus:ring-2 focus:ring-blue-200"
                value={selectedTemplateId ?? ""}
                onChange={(e) =>
                  setSelectedTemplateId(Number(e.target.value) || null)
                }
                disabled={!selectedGroupId}
              >
                <option value="">Select message...</option>
                {filteredTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Import Button */}
          <button
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-lg font-semibold transition mt-2 
              ${
                selectedGroupId && selectedTemplateId
                  ? "bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            disabled={!selectedGroupId || !selectedTemplateId}
            onClick={() => {
              if (selectedTemplate) {
                onImport(selectedTemplate);
                onClose();
              }
            }}
          >
            <Download size={22} /> Import Message
          </button>
        </div>
      </div>
    </div>
  );
}
