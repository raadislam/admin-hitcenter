import React, { useRef } from "react";

// Simple, modern icon buttons (SVG, but you can use Lucide/Material if you like)
const BoldIcon = () => (
  <svg
    width={18}
    height={18}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M5.246 3.744a.75.75 0 0 1 .75-.75h7.125a4.875 4.875 0 0 1 3.346 8.422 5.25 5.25 0 0 1-2.97 9.58h-7.5a.75.75 0 0 1-.75-.75V3.744Zm7.125 6.75a2.625 2.625 0 0 0 0-5.25H8.246v5.25h4.125Zm-4.125 2.251v6h4.5a3 3 0 0 0 0-6h-4.5Z"
      clip-rule="evenodd"
    />
  </svg>
);
const ItalicIcon = () => (
  <svg
    width={18}
    height={18}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M10.497 3.744a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-3.275l-5.357 15.002h2.632a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5h3.275l5.357-15.002h-2.632a.75.75 0 0 1-.75-.75Z"
      clip-rule="evenodd"
    />
  </svg>
);
const UnderlineIcon = () => (
  <svg
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    className="stroke-2"
  >
    <path d="M6 4v6a3 3 0 0 0 6 0V4" />
    <path d="M4 20h10" />
  </svg>
);
const ListIcon = () => (
  <svg
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    className="stroke-2"
  >
    <path d="M7 6h9M7 12h9M7 18h9" />
    <circle cx="3" cy="6" r="1.5" />
    <circle cx="3" cy="12" r="1.5" />
    <circle cx="3" cy="18" r="1.5" />
  </svg>
);
const NumListIcon = () => (
  <svg
    width={18}
    height={18}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M7.491 5.992a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.49 11.995a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.491 17.994a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.24 3.745a.75.75 0 0 1 .75-.75h1.125a.75.75 0 0 1 .75.75v3h.375a.75.75 0 0 1 0 1.5H2.99a.75.75 0 0 1 0-1.5h.375v-2.25H2.99a.75.75 0 0 1-.75-.75ZM2.79 10.602a.75.75 0 0 1 0-1.06 1.875 1.875 0 1 1 2.652 2.651l-.55.55h.35a.75.75 0 0 1 0 1.5h-2.16a.75.75 0 0 1-.53-1.281l1.83-1.83a.375.375 0 0 0-.53-.53.75.75 0 0 1-1.062 0ZM2.24 15.745a.75.75 0 0 1 .75-.75h1.125a1.875 1.875 0 0 1 1.501 2.999 1.875 1.875 0 0 1-1.501 3H2.99a.75.75 0 0 1 0-1.501h1.125a.375.375 0 0 0 .036-.748H3.74a.75.75 0 0 1-.75-.75v-.002a.75.75 0 0 1 .75-.75h.411a.375.375 0 0 0-.036-.748H2.99a.75.75 0 0 1-.75-.75Z"
      clip-rule="evenodd"
    />
  </svg>
);

type Parameter = { label: string; placeholder: string };
type Props = {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  parameters: Parameter[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ToolbarTextarea({
  textareaRef: parentRef,
  parameters,
  value,
  onChange,
  disabled,
  placeholder,
}: Props) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = parentRef || internalRef;

  // --- Formatting actions
  function format(type: "bold" | "italic" | "underline") {
    const ta = textareaRef.current;
    if (!ta) return;
    const [start, end] = [ta.selectionStart, ta.selectionEnd];
    let marker = "";
    if (type === "bold") marker = "**";
    if (type === "italic") marker = "*";
    if (type === "underline") marker = "__";
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);
    const newValue = before + marker + selected + marker + after;
    onChange(newValue);
    // Keep selection on formatted text
    setTimeout(() => {
      ta.setSelectionRange(start + marker.length, end + marker.length);
      ta.focus();
    }, 0);
  }

  function handleList(type: "bullet" | "number") {
    const ta = textareaRef.current;
    if (!ta) return;
    const [start, end] = [ta.selectionStart, ta.selectionEnd];
    const selectedText = value.slice(start, end) || "";
    const lines = selectedText.split("\n");
    let updatedLines = [];
    if (type === "number") {
      updatedLines = lines.map(
        (line, i) => `${i + 1}. ${line.replace(/^\d+\.\s?/, "")}`
      );
    } else {
      updatedLines = lines.map((line) =>
        line.startsWith("• ") ? line : `• ${line.replace(/^•\s?/, "")}`
      );
    }
    const before = value.slice(0, start);
    const after = value.slice(end);
    const newValue = before + updatedLines.join("\n") + after;
    onChange(newValue);
    setTimeout(() => {
      ta.setSelectionRange(
        before.length,
        before.length + updatedLines.join("\n").length
      );
      ta.focus();
    }, 0);
  }

  function handleInsertParameter(placeholder?: string) {
    if (!placeholder) return;
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart, selectionEnd } = ta;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const newValue = before + placeholder + after;
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(
        selectionStart + placeholder.length,
        selectionStart + placeholder.length
      );
    }, 0);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b pb-1 mb-2 px-1 bg-[#f9fafb] rounded-t-xl">
        <button
          type="button"
          title="Bold"
          onClick={() => format("bold")}
          className="toolbar-btn"
          tabIndex={-1}
        >
          <BoldIcon />
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => format("italic")}
          className="toolbar-btn"
          tabIndex={-1}
        >
          <ItalicIcon />
        </button>
        <button
          type="button"
          title="Underline"
          onClick={() => format("underline")}
          className="toolbar-btn"
          tabIndex={-1}
        >
          <UnderlineIcon />
        </button>
        <button
          type="button"
          title="Bulleted list"
          onClick={() => handleList("bullet")}
          className="toolbar-btn"
          tabIndex={-1}
        >
          <ListIcon />
        </button>
        <button
          type="button"
          title="Numbered list"
          onClick={() => handleList("number")}
          className="toolbar-btn"
          tabIndex={-1}
        >
          <NumListIcon />
        </button>

        <span className="ml-3 text-xs text-gray-500 font-medium">Insert:</span>
        {parameters.length === 0 && (
          <span className="text-xs text-gray-400 italic ml-1">
            No parameter
          </span>
        )}
        {parameters.map((param) => (
          <button
            key={param.placeholder}
            type="button"
            className="toolbar-chip"
            title={param.placeholder}
            onClick={() => handleInsertParameter(param.placeholder)}
          >
            {param.label}
          </button>
        ))}
      </div>
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-b-xl min-h-[140px] px-4 py-3 font-mono text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-300 shadow transition"
        placeholder={placeholder}
        disabled={disabled}
        spellCheck
      />
    </div>
  );
}
