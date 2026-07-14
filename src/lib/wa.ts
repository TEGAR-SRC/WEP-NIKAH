const BASE = process.env.EVOLUTION_API_URL ?? "";
const KEY = process.env.EVOLUTION_API_KEY ?? "";
const INSTANCE = "TEGAR-HP";

let qrCache: string | null = null;

async function api(method: string, path: string, body?: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (KEY) headers["apikey"] = KEY;
  const res = await fetch(`${BASE}/${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Evolution API ${res.status}: ${text || "unknown"}`);
  }
  return res.json();
}

export async function connectWA() {
  qrCache = null;
  const data = await api("POST", `instance/connect`, { name: INSTANCE });
  return data;
}

export function disconnectWA() {
  api("POST", `instance/disconnect`, { name: INSTANCE }).catch(() => {});
}

export function deleteSession() {
  qrCache = null;
  try { api("DELETE", `instance/delete/${INSTANCE}`); } catch {}
}

export async function getStatus() {
  try {
    const data = await api("GET", `instance/info/${INSTANCE}`);
    const connected = data?.connected === true;
    return { connected, connecting: false, qr: null, qrExpired: false };
  } catch {
    return { connected: false, connecting: false, qr: null, qrExpired: false };
  }
}

export async function sendMessage(phone: string, text: string) {
  const number = phone.replace(/[^0-9]/g, "");
  return api("POST", "message/text", { number, text, delay: 1200 });
}

export async function getSock() { return null; }
