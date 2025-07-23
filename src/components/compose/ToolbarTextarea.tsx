const TOOLBAR = [
  {
    key: "bold",
    label: "B",
    style: "font-bold",
    tooltip: "Bold (Ctrl+B)",
    wrap: "**", // Markdown style
  },
  {
    key: "italic",
    label: <span className="italic">I</span>,
    style: "italic",
    tooltip: "Italic (Ctrl+I)",
    wrap: "_",
  },
  {
    key: "underline",
    label: <span style={{ textDecoration: "underline" }}>U</span>,
    style: "underline",
    tooltip: "Underline (Ctrl+U)",
    wrap: "__",
  },
  {
    key: "ul",
    label: <span>&bull; List</span>,
    style: "",
    tooltip: "Bullet List",
    block: "- ",
  },
  {
    key: "ol",
    label: <span>1. List</span>,
    style: "",
    tooltip: "Numbered List",
    block: "1. ",
  },
];

export function ToolbarTextarea({
  textareaRef,
  parameters,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  parameters: { label: string; placeholder: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  // Insert formatting at selection
  function handleFormat(type: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart,
      end = ta.selectionEnd;
    const selected = value.slice(start, end);

    // B/I/U (wrap), List (prefix block)
    let insertVal = value;
    if (["bold", "italic", "underline"].includes(type)) {
      const wrap = TOOLBAR.find((t) => t.key === type)!.wrap!;
      insertVal =
        value.slice(0, start) +
        wrap +
        (selected || "Text") +
        wrap +
        value.slice(end);
      onChange(insertVal);
      setTimeout(() => {
        ta.setSelectionRange(
          start + wrap.length,
          start + wrap.length + (selected ? selected.length : 4)
        );
        ta.focus();
      }, 0);
    } else if (type === "ul" || type === "ol") {
      const block = TOOLBAR.find((t) => t.key === type)!.block!;
      // Add block marker to each selected line
      const before = value.slice(0, start);
      const selText = selected || "List item";
      const after = value.slice(end);
      const newText = selText
        .split("\n")
        .map((line) => (line.startsWith(block) ? line : block + line))
        .join("\n");
      insertVal = before + newText + after;
      onChange(insertVal);
      setTimeout(() => {
        ta.setSelectionRange(start + block.length, start + newText.length);
        ta.focus();
      }, 0);
    }
  }

  // Insert parameter at cursor
  function handleInsert(placeholder: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart,
      end = ta.selectionEnd;
    const insertVal = value.slice(0, start) + placeholder + value.slice(end);
    onChange(insertVal);
    setTimeout(() => {
      ta.setSelectionRange(
        start + placeholder.length,
        start + placeholder.length
      );
      ta.focus();
    }, 0);
  }

  // Format preview for user: basic bold/italic/underline/lists highlighting
  function formatPreview(val: string) {
    // Simple real-time render (for UX, not email output)
    let html = val
      .replace(/(\*\*)(.*?)\1/g, "<b>$2</b>")
      .replace(/(_)(.*?)\1/g, "<i>$2</i>")
      .replace(/(__)(.*?)\1/g, "<u>$2</u>")
      .replace(
        /^(- |1\. )(.*)$/gm,
        '<span class="text-blue-600 font-bold">$1</span>$2'
      );
    // Parameters highlight
    html = html.replace(
      /(\{\{.*?\}\})/g,
      '<span class="bg-yellow-100 text-yellow-800 px-1 rounded">$1</span>'
    );
    return html;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 pt-1">
        {TOOLBAR.map((item) => (
          <button
            key={item.key}
            title={item.tooltip}
            type="button"
            disabled={disabled}
            className={`
              px-2 py-1 rounded
              border border-gray-200 bg-gray-50
              text-gray-700 font-semibold text-sm
              hover:bg-blue-100 focus:outline-none
              transition
            `}
            onClick={() => handleFormat(item.key)}
            tabIndex={0}
          >
            <span className={item.style}>{item.label}</span>
          </button>
        ))}
        <span className="mx-2 text-gray-300">|</span>
        {parameters.map((param) => (
          <button
            key={param.placeholder}
            type="button"
            className="inline-flex items-center px-2 py-1 rounded bg-blue-50 border border-blue-200 text-xs text-blue-700 font-mono font-semibold hover:bg-blue-100"
            onClick={() => handleInsert(param.placeholder)}
            disabled={disabled}
          >
            {param.label}
          </button>
        ))}
      </div>
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        className="w-full px-4 py-3 border rounded-lg resize-none min-h-[200px] font-mono text-sm bg-gray-50 focus:outline-blue-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck
        style={{ whiteSpace: "pre-wrap" }}
      />
      {/* Live preview */}
      <div className="px-2 pb-2 text-xs text-gray-500 font-mono">
        Preview:
        <div
          className="mt-1 p-2 bg-gray-50 border rounded"
          dangerouslySetInnerHTML={{ __html: formatPreview(value) }}
        />
      </div>
    </div>
  );
}
