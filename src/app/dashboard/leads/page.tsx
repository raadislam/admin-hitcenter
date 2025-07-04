"use client";
import FetchSavedMessageModal, {
  MessageGroup,
  MessageTemplate,
} from "@/components/dashboard/lead/FetchSavedMessageModal";

import AddLeadSidebar from "@/components/dashboard/lead/AddLeadSidebar";
import { Pagination } from "@/components/dashboard/lead/Pagination";
import StatusBadgeEditable from "@/components/dashboard/lead/StatusBadge";
import api from "@/lib/axios";
import {
  ArrowRightToLine,
  Copy,
  Download,
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
import { useCallback, useEffect, useRef, useState } from "react";

// Mock Lead Data
const mockLeads = [
  {
    id: 1,
    name: "Shahid Miah",
    company: "Wavespace",
    linkedin: "linkedin.com/in/uxshahid/",
    email: "thuhang.nute@gmail.com",
    status: "Interested", // <- new field
  },
  // ...
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
  const [courses, setCourses] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [openPopoverLeadId, setOpenPopoverLeadId] = useState<number | null>(
    null
  );
  const [leads, setLeads] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // 1. Memoize the fetch function (prevents unnecessary re-creation)
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads", {
        params: {
          page: currentPage,
          per_page: perPage,
          search: search?.trim() || undefined,
        },
      });
      // Defensive: Support both paginated (with .data/.meta) and flat array APIs
      setLeads(data.data || data);
      setTotal(data.meta?.total ?? data.total ?? 0);
      setLastPage(data.meta?.last_page ?? data.last_page ?? 1);
    } catch (err) {
      // Optional: Set error state here if desired
      setLeads([]);
      setTotal(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search]);

  // 2. Effect runs when dependencies change (guaranteed latest function)
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Fetch leads from backend
  useEffect(() => {
    setLoading(true);
    api
      .get("/leads")
      .then((res) => setLeads(res.data.data || res.data)) // adapt as needed
      .finally(() => setLoading(false));
  }, []);

  // Optionally add a search filter on frontend
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.lead_id?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone_number?.toLowerCase().includes(search.toLowerCase())
  );

  // 1. Fetch courses from backend
  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]));
  }, []);

  // 2. Submit new lead
  const handleCreateLead = async (leadData: any) => {
    setLoading(true);
    setSuccessMsg("");
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
      setSuccessMsg("Lead created! Lead ID: " + res.data.data.lead_id);
      setShowSidebar(false);
      // Optionally: reload leads list here
    } catch (e: any) {
      setSuccessMsg(
        "Failed to create lead. " + (e?.response?.data?.message || "")
      );
    }
    setLoading(false);
  };

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(""), 3000); // 3000ms = 3s
    return () => clearTimeout(timer);
  }, [successMsg]);

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
      {successMsg && (
        <div className="my-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded">
          {successMsg}
        </div>
      )}
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
                <MessageSquare size={18} /> Fetch Saved Message
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEAD TABLE */}
          <div className="flex-1 bg-white rounded-xl shadow border p-5">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
              <button className="flex items-center gap-2 bg-[var(--color-primary-option-two)] hover:bg-[var(--color-primary-option-one)] text-white rounded-md px-4 py-2 text-sm font-medium shadow transition">
                <RefreshCcw size={18} /> Refresh Table: Clear Filter
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
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setSearch(e.target.value);
                    }}
                  />
                </div>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="border px-2 py-1 rounded ml-2"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
                <button className="flex items-center gap-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-auto rounded-xl border border-gray-100 bg-white shadow">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#FAFBFC] text-gray-600 border-b">
                    <th className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={checked.length === filteredLeads.length}
                        onChange={(e) =>
                          setChecked(
                            e.target.checked
                              ? filteredLeads.map((l) => l.id)
                              : []
                          )
                        }
                        className="accent-blue-600 w-4 h-4"
                      />
                    </th>
                    <th className="py-3 px-2 text-left font-semibold">
                      Name & Company
                    </th>
                    <th className="py-3 px-2 text-left font-semibold">
                      Status
                    </th>
                    <th className="py-3 px-2 text-left font-semibold">
                      Phone Number
                    </th>
                    <th className="py-3 px-2 text-left font-semibold">Email</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400 font-medium"
                      >
                        <div className="flex items-center justify-center h-full">
                          {/* Use your best spinner */}
                          <svg
                            className="animate-spin h-8 w-8 text-primary"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, i) => (
                      <tr
                        key={lead.id}
                        className={`transition ${
                          i % 2 === 1 ? "bg-[#FAFBFC]" : ""
                        } hover:bg-blue-50/50 group`}
                      >
                        <td className="px-2 py-3">
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
                            className="accent-blue-600 w-4 h-4"
                          />
                        </td>
                        <td className="flex items-center gap-3 px-2 py-3">
                          <div>
                            <div className="font-semibold text-gray-800 text-base">
                              {lead.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {lead.lead_id}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <StatusBadgeEditable
                            key={lead.id}
                            status={lead.status}
                            leadId={lead.id}
                            open={openPopoverLeadId === lead.id}
                            onOpen={() => setOpenPopoverLeadId(lead.id)}
                            onClose={() => setOpenPopoverLeadId(null)}
                            onChange={(newStatus) => {
                              setLeads((leads) =>
                                leads.map((l) =>
                                  l.id === lead.id
                                    ? { ...l, status: newStatus }
                                    : l
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="px-2 py-3 font-medium text-gray-800">
                          {lead.phone_number}
                        </td>
                        <td className="px-2 py-3 font-medium text-gray-800">
                          {lead.email}
                        </td>
                        <td className="px-2 py-3 text-right">
                          <button className="p-2 hover:bg-gray-200 rounded-full transition">
                            <Trash2 size={16} className="text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* Pagination Bar */}
            <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-500">
              <span>
                Results{" "}
                {leads.length === 0 ? 0 : perPage * (currentPage - 1) + 1}-{" "}
                {leads.length === 0
                  ? 0
                  : perPage * (currentPage - 1) + leads.length}{" "}
                of {total} Lead
              </span>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                lastPage={lastPage}
              />
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
        onSubmit={handleCreateLead}
        courses={courses}
        loading={loading}
      />
    </div>
  );
}
