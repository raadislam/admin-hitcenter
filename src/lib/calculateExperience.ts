export function calculateExperienceDuration(joiningDate: any): string {
  const joined = new Date(joiningDate);
  const now = new Date();

  let years = now.getFullYear() - joined.getFullYear();
  let months = now.getMonth() - joined.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearStr = years > 0 ? `${years} Year${years > 1 ? "s" : ""}` : "";
  const monthStr = months > 0 ? `${months} Month${months > 1 ? "s" : ""}` : "";

  return [yearStr, monthStr].filter(Boolean).join(" ");
}
