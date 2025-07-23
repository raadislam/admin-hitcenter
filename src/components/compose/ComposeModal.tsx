"use client";
import { useComposeStore } from "@/hooks/useComposeStore";
import api from "@/lib/axios";
import { Mail, MessageCircle, Minus, Smartphone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ComposeToField } from "./ComposeToField";
import { ParameterTextarea } from "./ParameterTextarea";
import { ToolbarTextarea } from "./ToolbarTextarea";

// --- Platform options ---
const PLATFORMS = [
  {
    key: "email",
    label: "Email",
    icon: Mail,
    color: "bg-blue-600",
    text: "text-white",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500",
    text: "text-white",
  },
  {
    key: "sms",
    label: "SMS",
    icon: Smartphone,
    color: "bg-fuchsia-600",
    text: "text-white",
  },
];

export function ComposeModal() {
  const {
    open,
    hide,
    recipients,
    setRecipients,
    minimized,
    minimize,
    maximize,
  } = useComposeStore();

  const [subject, setSubject] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["email"]);
  const [message, setMessage] = useState("");
  const [showParams, setShowParams] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paramData, setParamData] = useState<Record<string, any>>({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch personalized parameters for each recipient from backend
  useEffect(() => {
    const fetchParams = async () => {
      if (!recipients.length) return setParamData({});

      try {
        // Pass an array of {type, id, email} (or however you identify them)
        const res = await api.post("/compose/parameters", {
          recipients: recipients.map((r) => ({
            type: r.type,
            id: r.id,
            email: r.email,
            status: r.status,
          })),
        });
        setParamData(res.data.parameters || {});
      } catch (e) {
        setParamData({});
      }
    };
    fetchParams();
  }, [recipients]);

  // Helper: Insert parameter at cursor
  function handleInsert(placeholder: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart,
      end = ta.selectionEnd;
    const value = message.slice(0, start) + placeholder + message.slice(end);
    setMessage(value);
    setTimeout(() => {
      ta.setSelectionRange(
        start + placeholder.length,
        start + placeholder.length
      );
      ta.focus();
    }, 0);
  }

  // Compose parameter list (first recipient shown for reference)
  let parameters: { label: string; placeholder: string }[] = [];
  if (recipients.length && paramData[recipients[0].id]) {
    parameters = Object.entries(paramData[recipients[0].id]).map(
      ([key, value]) => ({
        label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        placeholder: `{{${key}}}`,
      })
    );
  }

  // --- Send handler ---
  async function handleSend() {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Send the recipients, subject, platforms, and message template
      await api.post("/compose/send", {
        recipients,
        subject,
        platforms,
        message,
      });
      setSuccess("Message sent successfully!");
      setMessage("");
      setSubject("");
      // Optionally, close after send: hide();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to send. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // --- UI ---
  if (!open) return null;
  if (minimized)
    return (
      <div className="fixed bottom-2 right-8 z-[9999]">
        <button
          onClick={maximize}
          className="bg-white px-6 py-3 border rounded-xl shadow-lg flex items-center gap-2 font-medium text-blue-600 hover:bg-blue-50"
        >
          <Mail className="w-4 h-4" /> New Message
        </button>
      </div>
    );

  return (
    <div className="fixed bottom-6 right-8 z-[9999] w-[32vw] min-w-[340px] max-w-xl bg-white border rounded-2xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <span className="font-semibold text-base text-gray-800">
          New Message
        </span>
        <div className="flex gap-1">
          <button className="p-1 rounded hover:bg-gray-100" onClick={minimize}>
            <Minus className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100" onClick={hide}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* To field */}
      <div className="flex items-center px-5 pt-2 text-xs text-gray-500 font-medium">
        To
      </div>
      <ComposeToField recipients={recipients} setRecipients={setRecipients} />
      {/* Subject */}
      <input
        className="w-full px-5 py-2 border-b focus:outline-none text-sm"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={loading}
      />
      {/* Platforms */}
      <div className="flex gap-2 px-5 py-3">
        {PLATFORMS.map(({ key, label, icon: Icon, color, text }) => (
          <button
            key={key}
            className={`flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 text-sm font-medium shadow-sm
              ${
                platforms.includes(key)
                  ? `${color} ${text} border-2 border-blue-700`
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
            onClick={() =>
              setPlatforms(
                platforms.includes(key)
                  ? platforms.filter((p) => p !== key)
                  : [...platforms, key]
              )
            }
            type="button"
            disabled={loading}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
      {/* Parameter Toggle */}
      <ToolbarTextarea
        textareaRef={textareaRef}
        parameters={parameters}
        value={message}
        onChange={setMessage}
        disabled={loading}
        placeholder={`Type your message...\n\nUse toolbar or parameters for personalization.`}
      />
      <ParameterTextarea
        textareaRef={textareaRef}
        parameters={parameters}
        value={message}
        onChange={setMessage}
        disabled={loading}
        placeholder={`Type your message...\n\nUse parameters for personalization.`}
      />
      {/* Error / Success */}
      {(error || success) && (
        <div
          className={`px-5 pb-2 text-sm ${
            error ? "text-red-600" : "text-green-700"
          }`}
        >
          {error || success}
        </div>
      )}
      {/* Footer */}
      <div className="flex justify-end px-5 py-3 border-t">
        <button
          className="bg-blue-600 text-white px-8 py-2 rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition"
          onClick={handleSend}
          disabled={
            loading ||
            !recipients.length ||
            !message.trim() ||
            !platforms.length
          }
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
