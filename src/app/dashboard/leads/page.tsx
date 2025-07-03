"use client";
import FetchSavedMessageModal, {
  MessageGroup,
  MessageTemplate,
} from "@/components/dashboard/lead/FetchSavedMessageModal";

import AddLeadSidebar from "@/components/dashboard/lead/AddLeadSidebar";

import {
  ArrowRightToLine,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileSearch,
  Filter,
  Link,
  List,
  Mail,
  MessageSquare,
  Plus,
  RefreshCcw,
  Rocket,
  Save,
  Search,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

// Mock Lead Data
const mockLeads = [
  {
    id: 1,
    name: "Shahid Miah",
    company: "Wavespace",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    linkedin: "linkedin.com/in/uxshahid/",
    email: "thuhang.nute@gmail.com",
    batch: "Jan 2025",
    leadToken: "L-0001",
    course: "IELTS Academic",
  },
  // ...more
];

// Message Parameters (dynamic insert options)
const msgParams = [
  { key: "batch", label: "Batch Number" },
  { key: "leadToken", label: "Lead Token" },
  { key: "name", label: "Name" },
  { key: "course", label: "Interested Course" },
];

export default function LeadPage() {
  const [checked, setChecked] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState(""); // Email/message textarea state
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showFetch, setShowFetch] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [originalMsg, setOriginalMsg] = useState(""); // For update check
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [sendTo, setSendTo] = useState<string[]>(["gmail"]);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Insert param at cursor
  function insertParam(paramKey: string) {
    const tag = `{{${paramKey}}}`;
    const textarea = msgRef.current;
    if (!textarea) return setMsg(msg + tag);
    const { selectionStart, selectionEnd } = textarea;
    setMsg(msg.slice(0, selectionStart) + tag + msg.slice(selectionEnd));
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        selectionStart + tag.length;
    }, 0);
  }

  // Handle save
  function handleSave() {
    // TODO: Save msg + params + saveTitle to backend
    setShowSavePrompt(false);
    setSaveTitle("");
    alert("Saved! (Mock)");
  }

  function handleUpdate() {
    // TODO: Send updated message to backend for selectedTemplate
    setOriginalMsg(msg);
    alert("Updated! (Mock)");
  }

  // Handle copy
  function handleCopy() {
    navigator.clipboard.writeText(msg);
  }

  // Send logic (demo)
  function handleSend() {
    // Would collect selected leads and send with backend API
    alert(
      "Send to: " +
        checked
          .map((cid) => mockLeads.find((l) => l.id === cid)?.name)
          .join(", ") +
        "\nPlatforms: " +
        sendTo.join(", ") +
        "\nMsg:\n" +
        msg
    );
  }

  // Platform selection
  function toggleSendTo(opt: string) {
    setSendTo((list) =>
      list.includes(opt) ? list.filter((s) => s !== opt) : [...list, opt]
    );
  }

  // --- Mock Data ---
  const mockGroups: MessageGroup[] = [
    { id: 1, name: "IELTS Inquiries" },
    { id: 2, name: "Admission Process" },
  ];
  const mockTemplates: MessageTemplate[] = [
    {
      id: 1,
      groupId: 2,
      title: "Batch Welcome",
      message: "Hello {name}, your batch is {batch}. Welcome to {course}!",
      parameters: ["name", "batch", "course"],
    },
    {
      id: 2,
      groupId: 2,
      title: "Admission Reminder",
      message: "Dear {name}, your admission status is {status}.",
      parameters: ["name", "status"],
    },
    {
      id: 3,
      groupId: 1,
      title: "Initial Contact",
      message: "Hi {name}, thanks for inquiring about {course}.",
      parameters: ["name", "course"],
    },
  ];

  return (
    <div className="bg-[#f6f7f9] min-h-[100vh]">
      <div className=" mx-auto">
        {/* TOP CARD */}
        <div className="bg-white rounded-lg shadow border p-5 mb-5">
          <div className="flex justify-between items-center gap-2 flex-wrap">
            {/* Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 border rounded-md px-4 py-2 bg-white hover:bg-[var(--color-secondary)] hover:border-[var(--color-primary)] transition text-sm font-medium">
                <List size={18} /> New List
              </button>
              <button
                onClick={() => setShowSidebar(true)}
                className="flex items-center gap-2 border rounded-md px-4 py-2 bg-white hover:bg-[var(--color-secondary)] hover:border-[var(--color-primary)] transition text-sm font-medium"
              >
                <Plus size={18} /> Add lead
              </button>
              <button className="flex items-center gap-2 border rounded-md px-4 py-2 bg-white hover:bg-[var(--color-secondary)] hover:border-[var(--color-primary)] transition text-sm font-medium">
                <Rocket size={18} /> Prompts
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold rounded-md px-4 py-2 transition text-sm">
                <RefreshCcw size={18} className="text-orange-600" /> Sync
                Hubspot
              </button>
              <button
                onClick={() => setShowFetch(true)}
                className="flex items-center gap-2 border border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-md px-4 py-2 transition text-sm"
              >
                <FileSearch size={18} /> Fetch
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEAD TABLE */}
          <div className="flex-1 bg-white rounded-xl shadow border p-5">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium shadow transition">
                <MessageSquare size={18} /> Generate with AI
              </button>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    className="pl-8 pr-2 py-1.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:bg-white focus:outline-none"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>
            <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="py-3 px-2 font-medium">
                      <input
                        type="checkbox"
                        checked={checked.length === mockLeads.length}
                        onChange={(e) =>
                          setChecked(
                            e.target.checked ? mockLeads.map((l) => l.id) : []
                          )
                        }
                      />
                    </th>
                    <th className="py-3 px-2 font-medium text-left">
                      Name & Company
                    </th>
                    <th className="py-3 px-2 font-medium text-left">
                      LinkedIn URL
                    </th>
                    <th className="py-3 px-2 font-medium text-left">Email</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      className={i % 2 === 1 ? "bg-gray-50" : ""}
                    >
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          checked={checked.includes(lead.id)}
                          onChange={(e) =>
                            setChecked((checked) =>
                              e.target.checked
                                ? [...checked, lead.id]
                                : checked.filter((id) => id !== lead.id)
                            )
                          }
                        />
                      </td>
                      <td className="flex items-center gap-3 px-2 py-2">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-gray-500">
                            {lead.company}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">{lead.linkedin}</td>
                      <td className="px-2 py-2">{lead.email}</td>
                      <td className="px-2 py-2 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Trash2 size={16} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-2 px-2 text-sm text-gray-500">
              <span>Results 1-6 of {mockLeads.length} Lead</span>
              <div className="flex gap-1 items-center">
                <button className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100 text-gray-700">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-7 h-7 rounded border border-blue-400 bg-blue-50 text-blue-700 font-semibold">
                  1
                </button>
                <button className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100 text-gray-700">
                  2
                </button>
                <button className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100 text-gray-700">
                  3
                </button>
                <button className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100 text-gray-700">
                  ...
                </button>
                <button className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100 text-gray-700">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          {/* RIGHT: Email Composer */}
          <div className="flex-1 min-w-[340px] bg-white rounded-xl shadow border p-5 flex flex-col max-w-[480px]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800 text-lg">
                Generated Email
              </span>
              <button
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium shadow"
                onClick={handleCopy}
              >
                <Download size={16} /> Export as CSV
              </button>
            </div>
            {/* Parameters Dropdown */}
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Insert Parameter:
              </span>
              {msgParams.map((p) => (
                <button
                  key={p.key}
                  onClick={() => insertParam(p.key)}
                  className="border border-gray-300 text-xs rounded px-2 py-1 hover:bg-blue-50 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
            {/* Message Area */}
            <textarea
              ref={msgRef}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={10}
              className="w-full border border-gray-200 rounded-lg bg-gray-50 p-4 text-[15px] mb-2 resize-none focus:outline-none"
              placeholder="Type or fetch a template. Use parameters like {{name}}..."
              style={{ minHeight: 160 }}
            />
            {/* Actions */}
            <div className="flex gap-2 flex-wrap mb-2">
              <button className="flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
                <MessageSquare size={16} /> Regenerate
              </button>
              <button
                className="flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={handleCopy}
              >
                <Copy size={16} /> Copy
              </button>

              <div className="flex items-center gap-2">
                {/* If editing a fetched template, show Update if changed */}
                {selectedTemplate && msg !== originalMsg ? (
                  <button
                    className="flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                    onClick={handleUpdate}
                  >
                    <Save size={16} /> Update
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                    onClick={() => setShowSavePrompt(true)}
                  >
                    <Save size={16} /> Save
                  </button>
                )}
              </div>
            </div>
            {/* Send To Options */}
            <div className="flex gap-2 flex-wrap mb-2">
              <label
                className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                  sendTo.includes("gmail")
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sendTo.includes("gmail")}
                  onChange={() => toggleSendTo("gmail")}
                  className="mr-1"
                />{" "}
                <Mail size={15} /> Gmail
              </label>
              <label
                className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                  sendTo.includes("outreach")
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sendTo.includes("outreach")}
                  onChange={() => toggleSendTo("outreach")}
                  className="mr-1"
                />{" "}
                <ArrowRightToLine size={15} /> OutReach
              </label>
              <label
                className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                  sendTo.includes("linkedin")
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sendTo.includes("linkedin")}
                  onChange={() => toggleSendTo("linkedin")}
                  className="mr-1"
                />{" "}
                <Link size={15} /> LinkedIn
              </label>
              <label
                className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                  sendTo.includes("sms")
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sendTo.includes("sms")}
                  onChange={() => toggleSendTo("sms")}
                  className="mr-1"
                />{" "}
                <Smartphone size={15} /> SMS/WhatsApp
              </label>
            </div>
            {/* Footer/Send */}
            <div className="flex justify-end items-center mt-auto">
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Save Message Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[350px]">
            <h3 className="mb-4 text-lg font-semibold">
              Save Message Template
            </h3>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Title..."
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSavePrompt(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Fetch Modal */}

      <FetchSavedMessageModal
        open={showFetch}
        onClose={() => setShowFetch(false)}
        onImport={(template) => {
          setMsg(template.message);
          setOriginalMsg(template.message);
          setSelectedTemplate(template.id);
        }}
        groups={mockGroups}
        templates={mockTemplates}
      />

      <AddLeadSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSubmit={(data) => {
          // save to backend
          setShowSidebar(false);
        }}
      />
    </div>
  );
}
