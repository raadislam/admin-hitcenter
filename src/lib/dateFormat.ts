export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return "Invalid Date";

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" }); // e.g., May
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
