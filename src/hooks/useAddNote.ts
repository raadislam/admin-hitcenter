import api from "@/lib/axios";

export async function addNote(employeeId: string, note: string) {
  const response = await api.post(`/employees/${employeeId}/notes`, { note });
  return response.data;
}
