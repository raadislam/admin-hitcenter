import React, { useRef } from "react";

// Simple, modern icon buttons (SVG, but you can use Lucide/Material if you like)
const BoldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={18}
    height={18}
  >
    <path
      fill="currentColor"
      d="M17.25 8c0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79c0-1.52-.86-2.82-2.15-3.42c.97-.67 1.65-1.77 1.65-2.79M10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5"
    ></path>
  </svg>
);
const ItalicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={18}
    height={18}
  >
    <path
      fill="currentColor"
      d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"
    ></path>
  </svg>
);
const UnderlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={18}
    height={18}
  >
    <path
      fill="currentColor"
      d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6m-7 2v2h14v-2z"
    ></path>
  </svg>
);
const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    width={18}
    height={18}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="1" cy="2.5" r=".5"></circle>
      <path d="M4.5 2.5h9"></path>
      <circle cx="1" cy="7" r=".5"></circle>
      <path d="M4.5 7h9"></path>
      <circle cx="1" cy="11.5" r=".5"></circle>
      <path d="M4.5 11.5h9"></path>
    </g>
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
