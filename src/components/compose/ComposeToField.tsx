// components/ComposeToField.tsx
import { Recipient } from "@/types/compose";
import { User, X } from "lucide-react";

export function ComposeToField({
  recipients,
  setRecipients,
}: {
  recipients: Recipient[];
  setRecipients: (r: Recipient[]) => void;
}) {
  console.log(recipients);
  return (
    <div className="flex flex-wrap items-center gap-2 px-5 pt-2 pb-2 min-h-[32px]">
      {recipients.map((r, i) => (
        <span
          key={i}
          className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200 mr-1 mb-1"
        >
          <User className="w-3 h-3 mr-1 text-blue-400" />
          {r.name ? <span className="mr-1">{r.name} || </span> : null}
          <span className="mr-1 font-mono">{r.email}</span>
          <button
            onClick={() =>
              setRecipients(recipients.filter((_, idx) => idx !== i))
            }
            className="ml-1 text-blue-400 hover:text-blue-700 focus:outline-none"
            aria-label="Remove"
            tabIndex={-1}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {/* <input
        className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm py-0.5"
        placeholder="Type email & press Enter"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            setRecipients([
              ...recipients,
              {
                email: e.currentTarget.value.trim(),
              },
            ]);
            e.currentTarget.value = "";
          }
        }}
      /> */}
    </div>
  );
}
