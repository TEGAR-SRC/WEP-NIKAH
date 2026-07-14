const BASE = process.env.EVOLUTION_API_URL ?? "";
const KEY = process.env.EVOLUTION_API_KEY ?? "";

async function api(method: string, path: string, body?: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (KEY) headers["apikey"] = KEY;
  const res = await fetch(`${BASE}/${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const t = await res.text(); throw new Error(`Evolution API ${res.status}: ${t || "error"}`); }
  return res.json();
}

export async function getInstances() {
  const data = await api("GET", "instance/all");
  return data?.data ?? data?.instances ?? [];
}

export async function sendMessage(phone: string, text: string) {
  const number = phone.replace(/[^0-9]/g, "");
  return api("POST", "message/text", { number, text, delay: 1200 });
}
