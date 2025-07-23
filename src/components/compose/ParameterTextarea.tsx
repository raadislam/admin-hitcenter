export function ParameterTextarea({
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
  // Insert at cursor
  function handleInsert(placeholder: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const newValue = before + placeholder + after;
    onChange(newValue);
    setTimeout(() => {
      ta.setSelectionRange(
        start + placeholder.length,
        start + placeholder.length
      );
      ta.focus();
    }, 0);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {parameters.length === 0 ? (
          <span className="text-xs text-gray-400">No parameters found.</span>
        ) : (
          parameters.map((param) => (
            <button
              key={param.placeholder}
              type="button"
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-semibold border border-blue-200 hover:bg-blue-200 focus:outline-none transition"
              onClick={() => handleInsert(param.placeholder)}
              disabled={disabled}
              tabIndex={0}
            >
              {param.label}
            </button>
          ))
        )}
      </div>
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
    </div>
  );
}
