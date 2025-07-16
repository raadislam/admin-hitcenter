"use client";

const STATUS_COLORS: Record<string, string> = {
  Interested: "bg-blue-100 border-blue-600 text-blue-700",
  "Follow Up": "border-yellow-500 bg-yellow-100 text-yellow-700",
  Admitted: "border-green-700 bg-green-100 text-green-700",
  Canceled: "border-gray-500 bg-gray-200 text-gray-600",
};

type StatusKey = "all" | "Interested" | "Follow Up" | "Admitted" | "Canceled";

interface Props {
  counts: Record<StatusKey, number>;
  selected: StatusKey;
  onSelect: (s: StatusKey) => void;
}

export default function LeadStatusFilterBar({
  counts,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex items-center  bg-[#F7FAFC] rounded-md border border-[#DDE2E6] pl-4 mb-3 w-fit">
      {/* All */}
      <button
        onClick={() => onSelect("all")}
        className={`px-7 py-1 rounded-md font-semibold text-[0.85rem] transition
          ${
            selected === "all"
              ? "bg-white text-black shadow-sm"
              : "bg-transparent text-[#19213D] hover:bg-white/80"
          }
          focus:outline-none border-none
        `}
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        All
      </button>
      {/* Statuses */}
      {(["Admitted", "Canceled", "Interested", "Follow Up"] as StatusKey[]).map(
        (status) => (
          <button
            key={status}
            onClick={() => onSelect(status)}
            className={`flex items-center gap-2 px-2 py-2 rounded-md transition ${
              selected === status
                ? "bg-white text-black shadow"
                : "bg-transparent text-[#1253AE] hover:bg-white/80"
            }`}
            style={{
              minWidth: 136,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <span
              className={`text-sm font-semibold px-3 py-1 border rounded-md ${STATUS_COLORS[status]}`}
              style={{ fontSize: "0.85rem", minWidth: 38, textAlign: "center" }}
            >
              {counts[status] ?? 0}
            </span>
            <span className="text-[0.85rem] text-gray-950">{status}</span>
          </button>
        )
      )}
    </div>
  );
}
