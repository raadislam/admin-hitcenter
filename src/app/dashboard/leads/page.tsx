"use client";
import FetchSavedMessageModal from "@/components/dashboard/lead/FetchSavedMessageModal";

import AddLeadSidebar from "@/components/dashboard/lead/AddLeadSidebar";
import { Pagination } from "@/components/dashboard/lead/Pagination";
import SaveMessageModal from "@/components/dashboard/lead/SaveMessageModal";
import StatusBadgeWithDropdown from "@/components/dashboard/lead/StatusBadgeWithDropdown";
import StatusFilterPopover from "@/components/dashboard/lead/StatusFilterPopover";
import { useToast } from "@/components/Toast/ToastProvider";
import api from "@/lib/axios";
import {
  ArrowRightToLine,
  Copy,
  Download,
  Filter,
  Link,
  Mail,
  Plus,
  Save,
  Search,
  Smartphone,
  Trash2,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
// Message Parameters (dynamic insert options)
const msgParams = [
  { key: "status", label: "Status" },
  { key: "lead_id", label: "Lead ID" },
  { key: "name", label: "Name" },
  { key: "course", label: "Interested Course" },
];

export default function LeadPage() {
  const showToast = useToast();
  const [checked, setChecked] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState(""); // Email/message textarea state
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [saveTitle, setSaveTitle] = useState("");
  const [originalMsg, setOriginalMsg] = useState(""); // For update check
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [sendTo, setSendTo] = useState<string[]>(["gmail"]);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [courses, setCourses] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [status, setStatus] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState(""); // for banner
  const [emailLoading, setEmailLoading] = useState(false); // for banner

  const filterBtnRef = useRef<HTMLButtonElement>(null);
  // 1. Memoize the fetch function (prevents unnecessary re-creation)
  // Fetch leads and counts from backend
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads", {
        params: {
          page: currentPage,
          per_page: perPage,
          status: statusFilters.length > 0 ? statusFilters : undefined, // <-- multiple
          search: search.trim() || undefined,
        },
      });
      setLeads(data.data || data);
      setTotal(data.meta?.total ?? data.total ?? 0);
      setLastPage(data.meta?.last_page ?? data.last_page ?? 1);

      setTotal(data.meta?.total ?? data.total ?? 0);
      setLastPage(data.meta?.last_page ?? data.last_page ?? 1);
    } catch (err) {
      setLeads([]);
      setTotal(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, status]);

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

  // Delete a lead
  async function handleDeleteLead(leadId: number) {
    console.log(leadId);
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    setDeleteLoading(leadId);
    try {
      const res = await api.delete(`/leads/${leadId}`);
      if (res.data.success) {
        setLeads((leads) => leads.filter((l) => l.id !== leadId));
        showToast({
          type: "success",
          title: "Successful",
          message: "Lead deleted successfully!",
        });
      } else {
        showToast({
          type: "error",
          title: "Something went wrong",
          message: res.data.message || "Failed to delete lead.",
        });
      }
    } catch (e: any) {
      // Show backend error if available
      showToast({
        type: "error",
        title: "Something went wrong",
        message:
          e?.response?.data?.message ||
          "Failed to delete lead. Please try again.",
      });
    }
    setDeleteLoading(null);
  }

  // Batch lead delete
  async function handleBatchDelete() {
    if (checked.length === 0) return;
    if (
      !window.confirm(
        `Are you sure to delete ${checked.length} selected leads?`
      )
    )
      return;

    setLoading(true);
    try {
      await api.delete("/leads/batch", {
        data: { ids: checked },
      });
      // Remove deleted from UI
      await fetchLeads();
      setChecked([]);
    } catch (e) {
      alert("Failed to delete leads!");
    }
    setLoading(false);
  }

  // Optionally add a search filter on frontend
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.lead_id?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone_number?.toLowerCase().includes(search.toLowerCase())
  );

  // // 1. Fetch courses from backend
  // useEffect(() => {
  //   api
  //     .get("/courses")
  //     .then((res) => setCourses(res.data))
  //     .catch(() => setCourses([]));
  // }, []);

  // 2. Submit new lead
  const handleCreateLead = async (leadData: any) => {
    setLoading(true);
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
      showToast({
        type: "success",
        title: "Lead created!",
        message: "Lead ID: " + res.data.data.lead_id,
      });
      setShowSidebar(false);
      fetchLeads();
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Failed to create lead",
        message: e?.response?.data?.message || "",
      });
    }
    setLoading(false);
  };

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

  async function handleUpdate() {
    if (!selectedTemplate) {
      showToast({
        type: "warning",
        title: "Warning",
        message: "No template selected.",
      });
      return;
    }

    if (!saveTitle || !msg || !selectedGroup) {
      showToast({
        type: "warning",
        title: "Warning",
        message: "Title, message, and group are required.",
      });
      return;
    }

    try {
      await api.put(`/message-templates/${selectedTemplate}`, {
        title: saveTitle,
        message: msg,
        group_id: selectedGroup,
      });

      setOriginalMsg(msg);
      showToast({
        type: "success",
        title: "Template Updated!",
        message: "Template updated successfully!",
      }); // to disable update button afterward
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Something went wrong!",
        message: err?.response?.data?.message || "Failed to update template.",
      });
    }
  }

  const resetForm = () => {
    setSelectedGroup("");
    setSaveTitle("");
    setMsg(""); // clear the message textarea
    setOriginalMsg(""); // reset change tracker
    setSelectedTemplate(null); // exit update mode
  };

  // Handle copy
  function handleCopy() {
    navigator.clipboard.writeText(msg);
  }

  // Send logic (demo)
  async function handleSend() {
    setEmailLoading(true);

    if (checked.length === 0) {
      showToast({
        type: "warning",
        title: "Warning",
        message: "Please select at least one lead!",
      });
      setEmailLoading(false);
      return;
    }
    if (sendTo.length === 0) {
      showToast({
        type: "warning",
        title: "Warning",
        message: "Please select at least one platform!",
      });

      setEmailLoading(false);
      return;
    }
    try {
      const res = await api.post("/leads/send-message", {
        lead_ids: checked,
        message: msg,
        platforms: sendTo, // This is your array: ['gmail', 'outreach', 'linkedin', 'sms']
      });
      showToast({
        type: "success",
        title: "Message Sent!",
        message: "Your message has been sent successfully.",
      });
      setTimeout(() => setEmailSuccessMsg(""), 3000);
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Something went wrong!",
        message: e?.response?.data?.message || "Failed to send message.",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  // Platform selection
  function toggleSendTo(opt: string) {
    setSendTo((list) =>
      list.includes(opt) ? list.filter((s) => s !== opt) : [...list, opt]
    );
  }

  function handleFetchSavedTemplate() {
    setShowFetchModal(true);
  }

  return (
    <div className="bg-[#f6f7f9] min-h-[100vh]">
      <div className=" mx-auto">
        {/* Main Content */}

        <div className="flex flex-col md:flex-row gap-6">
          {/* LEAD TABLE */}
          <div className="flex-1 bg-white rounded-xl shadow border p-5">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="flex items-center gap-2 border rounded-md px-4 py-2 bg-white hover:bg-[var(--color-secondary)] hover:border-[var(--color-primary)] transition text-sm font-medium"
                >
                  <Plus size={18} /> Add lead
                </button>
                <button
                  className={`
                      flex items-center gap-2 px-4 py-2 rounded-md border
                      ${
                        checked.length
                          ? "bg-red-50 text-red-600 border-red-300"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }
                      font-semibold text-sm transition
                    `}
                  disabled={!checked.length || loading}
                  onClick={handleBatchDelete}
                >
                  <Trash2 size={16} />
                  Delete
                  {checked.length > 0 && (
                    <span className="ml-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                      {checked.length}
                    </span>
                  )}
                </button>
                {/* ...other top controls (filter etc) */}
              </div>

              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    className="pl-8 pr-2 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:bg-white focus:outline-none"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setSearch(e.target.value);
                    }}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <button
                      ref={filterBtnRef}
                      className={`flex items-center gap-1 border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold bg-white shadow-sm transition hover:bg-blue-50 ${
                        statusFilters.length > 0
                          ? "text-blue-600 border-blue-300 bg-blue-50"
                          : ""
                      }`}
                      style={{ minWidth: 110, height: 44 }}
                      onClick={() => setShowStatusDropdown((v) => !v)}
                    >
                      <Filter size={18} className="mr-1" />
                      Filters
                      {statusFilters.length > 0 && (
                        <span className="ml-2 bg-blue-600 text-white rounded-md px-2 py-0.5 text-xs font-bold">
                          {statusFilters.length}
                        </span>
                      )}
                    </button>
                    <StatusFilterPopover
                      open={showStatusDropdown}
                      anchorRef={
                        filterBtnRef as React.RefObject<HTMLButtonElement>
                      }
                      selected={statusFilters}
                      onChange={setStatusFilters}
                      onApply={(statuses) => {
                        setStatus(statuses);
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                      onClose={() => setShowStatusDropdown(false)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white shadow">
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
                          <StatusBadgeWithDropdown
                            leadId={lead.id}
                            status={lead.status}
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
                          <button
                            className="p-2 hover:bg-red-100 rounded-full transition"
                            onClick={() => handleDeleteLead(lead.id)}
                            disabled={deleteLoading === lead.id}
                            title="Delete Lead"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-500">
              <div>
                <span className="mr-2">
                  Results{" "}
                  {leads.length === 0 ? 0 : perPage * (currentPage - 1) + 1}-{" "}
                  {leads.length === 0
                    ? 0
                    : perPage * (currentPage - 1) + leads.length}{" "}
                  of {total} Lead
                </span>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="
                    border border-[#E6E8EC]
                    rounded-[10px]
                    bg-[#F5F6FA]
                    px-4
                    py-2.5
                    text-[15px]
                    font-medium
                    shadow-sm
                    focus:border-blue-400 focus:bg-white
                    transition
                    outline-none
                    min-w-[115px]
                    appearance-none
                    relative
                    "
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg fill='none' stroke='black' stroke-width='2' viewBox='0 0 24 24' width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.25em 1.25em",
                  }}
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
              </div>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                lastPage={lastPage}
              />
            </div>
          </div>

          {/* RIGHT: Email Composer */}
          <div className="flex-1 min-w-[340px] bg-white rounded-xl shadow border p-5 flex flex-col max-w-[480px] max-h-[650px] ">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800 text-lg">
                Generated Email
              </span>

              <button
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium shadow"
                onClick={handleFetchSavedTemplate}
              >
                <Download size={16} /> Message Template
              </button>
            </div>
            {emailSuccessMsg && (
              <div className="mb-3 p-3 bg-green-100 text-green-800 text-sm rounded border border-green-300">
                ✅ {emailSuccessMsg}
              </div>
            )}
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
              <button
                onClick={resetForm}
                className="flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <Undo2 size={16} /> Reset
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
                    onClick={() => setShowSaveModal(true)}
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
                disabled={emailLoading}
              >
                {emailLoading ? "Sending..." : "Send"}
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

      <SaveMessageModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSaved={() => {
          setShowSaveModal(false);
          showToast({
            type: "success",
            title: "Message Sent!",
            message: "Message template saved successfully.",
          });
        }}
        message={msg}
      />

      {/* Fetch Modal */}

      <FetchSavedMessageModal
        open={showFetchModal}
        onClose={() => setShowFetchModal(false)}
        onImport={(template) => {
          setMsg(template.message); // Paste into email textarea
          setOriginalMsg(template.message); // Track original
          setSelectedTemplate(template.id); // For update later
          setSelectedGroup(String(template.group_id));
          setSaveTitle(template.title);
        }}
      />

      <AddLeadSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSubmit={handleCreateLead}
        loading={loading}
      />
    </div>
  );
}
