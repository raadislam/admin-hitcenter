const STATUSES = ["Active", "Inactive"];

export default function StatusFilterPopover({
  open,
  anchorRef,
  selected,
  onChange,
  onApply,
  onClose,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement>;
  selected: string[];
  onChange: (statuses: string[]) => void;
  onApply: (statuses: string[]) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute z-20 bg-white border rounded-lg shadow-xl p-4 mt-2 min-w-[160px]">
      <div className="flex flex-col gap-2">
        {STATUSES.map((status) => (
          <label key={status} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(status)}
              onChange={() => {
                if (selected.includes(status)) {
                  onChange(selected.filter((s) => s !== status));
                } else {
                  onChange([...selected, status]);
                }
              }}
            />
            {status}
          </label>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="text-xs font-medium px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
          onClick={() => onApply(selected)}
        >
          Apply
        </button>
        <button
          className="text-xs font-medium px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
