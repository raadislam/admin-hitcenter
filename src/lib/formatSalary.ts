export function formatSalary(amount: string | number, currency = "USD") {
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.]/g, ""))
      : amount;
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US", { style: "currency", currency });
}
