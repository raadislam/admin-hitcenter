// components/ParameterPanel.tsx
type Parameter = { label: string; value: string; placeholder: string };

export function ParameterPanel({
  parameters,
  onInsert,
}: {
  parameters: Parameter[];
  onInsert: (placeholder: string) => void;
}) {
  if (!parameters.length) return null;
  return (
    <div className="border rounded-lg bg-gray-50 p-2 px-4 mt-2 text-xs flex flex-wrap gap-3 items-center">
      <span className="font-bold text-blue-800 mr-2">Parameters:</span>
      {parameters.map((p) => (
        <button
          key={p.label}
          onClick={() => onInsert(p.placeholder)}
          className="rounded-full border border-blue-200 px-2 py-0.5 bg-blue-50 text-blue-800 font-semibold mr-1 hover:bg-blue-100 transition"
          type="button"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
