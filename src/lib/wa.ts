const BASE = process.env.EVOLUTION_API_URL ?? "";
const KEY = process.env.EVOLUTION_API_KEY ?? "";
const INSTANCE = "nikah";

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
    if (text) throw new Error(`Evolution API ${res.status}: ${text}`);
    throw new Error(`Evolution API ${res.status}`);
  }
  return res.json();
}

export async function connectWA() {
  qrCache = null;
  // Create instance with proper name field
  try { await api("POST", `instance/create`, { name: INSTANCE }); } catch {}
  // Connect
  try {
    const data = await api("POST", `instance/connect`, { name: INSTANCE });
    qrCache = data?.base64 ?? data?.qrcode ?? data?.qr ?? null;
    return data;
  } catch {
    return null;
  }
}

export function disconnectWA() {
  api("POST", `instance/disconnect`, { name: INSTANCE }).catch(() => {});
}

export function deleteSession() {
  qrCache = null;
  api("DELETE", `instance/delete/${INSTANCE}`).catch(() => {});
}

export async function getStatus() {
  try {
    const data = await api("GET", `instance/info/${INSTANCE}`);
    const state = data?.instance?.state ?? data?.state ?? "";
    const connected = state === "open" || data?.connected === true;
    const connecting = state === "connecting" || state === "syncing" || state === "pairing";
    if (connected) qrCache = null;
    return { connected, connecting, qr: data?.qrcode || qrCache || null, qrExpired: false };
  } catch {
    return { connected: false, connecting: false, qr: qrCache || null, qrExpired: false };
  }
}

export async function sendMessage(phone: string, text: string) {
  const number = phone.replace(/[^0-9]/g, "");
  return api("POST", "message/text", { number, text, options: { delay: 1200 } });
}

export async function getSock() { return null; }
