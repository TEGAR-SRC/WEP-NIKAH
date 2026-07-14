const BASE = process.env.EVOLUTION_API_URL ?? "";
const GLOBAL_KEY = process.env.EVOLUTION_API_KEY ?? "";

let instanceToken = "";

async function api(method: string, path: string, body?: any, key?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  headers["apikey"] = key || GLOBAL_KEY;
  const res = await fetch(`${BASE}/${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const t = await res.text(); throw new Error(`Evolution API ${res.status}: ${t || "error"}`); }
  return res.json();
}

export async function getInstances() {
  const data = await api("GET", "instance/all");
  const list = data?.data ?? data?.instances ?? [];
  const active = list.find((i: any) => i.connected);
  if (active?.token) instanceToken = active.token;
  return list;
}

export async function sendMessage(phone: string, text: string) {
  const number = phone.replace(/[^0-9]/g, "");
  const key = instanceToken || GLOBAL_KEY;
  return api("POST", "send/text", { message: { number, text, delay: 1200 } }, key);
}
