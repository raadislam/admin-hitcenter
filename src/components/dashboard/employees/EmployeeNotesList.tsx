// components/employees/EmployeeNotesList.tsx
import { EmployeeNote } from "@/types/employees";

export default function EmployeeNotesList({
  notes,
}: {
  notes: EmployeeNote[];
}) {
  if (notes.length === 0)
    return <p className="italic text-sm text-gray-500">No notes added yet.</p>;

  return (
    <ul className="mt-3 space-y-2 text-sm">
      {notes.map((note) => (
        <li key={note.id} className="border p-3 rounded-md bg-white">
          <p>{note.note}</p>
          <div className="text-xs text-gray-500 mt-1">
            Added by <b>{note.created_at}</b> on{" "}
            {new Date(note.created_at).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
