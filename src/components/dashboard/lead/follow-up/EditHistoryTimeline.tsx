import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export function EditHistoryTimeline({ history }: { history: any[] }) {
  const [showAll, setShowAll] = useState(false);

  if (!history.length)
    return (
      <div className="text-xs text-gray-400">No previous status changes.</div>
    );

  // Show only latest 3, expandable to all
  const visible = showAll ? history : history.slice(0, 3);

  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 rounded" />
      <ul className="flex flex-col gap-6">
        {visible.map((h, idx) => (
          <li key={idx} className="relative flex gap-4">
            {/* Timeline Dot/Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-300 shadow">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={h.avatar} />
                  <AvatarFallback>{h.user[0]}</AvatarFallback>
                </Avatar>
              </div>
              {idx !== visible.length - 1 && (
                <div className="flex-1 w-0.5 bg-gray-200 mx-auto" />
              )}
            </div>
            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm">{h.user}</span>
                <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5">
                  {h.status}
                </Badge>
                <span className="text-xs text-gray-400">{fmt(h.datetime)}</span>
              </div>
              <div className="text-xs mt-1">
                <span className="font-semibold">Remarks:</span>{" "}
                {h.remarks ? (
                  h.remarks
                ) : (
                  <span className="italic text-gray-400">No remarks</span>
                )}
              </div>
              {h.appointment && (
                <div className="text-xs mt-1 text-gray-500">
                  <span className="font-semibold">Appointment:</span>{" "}
                  {fmt(h.appointment)}
                </div>
              )}
              {h.course && (
                <div className="text-xs mt-1 text-gray-500">
                  <span className="font-semibold">Interested Course:</span>{" "}
                  {h.course}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {history.length > 3 && (
        <button
          className="text-xs text-blue-600 mt-4 ml-3 hover:underline"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Show Less" : `Show All (${history.length})`}
        </button>
      )}
    </div>
  );
}
