const BASE = process.env.EVOLUTION_API_URL ?? "";
const KEY = process.env.EVOLUTION_API_KEY ?? "";
const INSTANCE = "nikah";

async function api(method: string, path: string, body?: any) {
  const res = await fetch(`${BASE}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "apikey": KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Evolution API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function connectWA() {
  try {
    await api("POST", `instance/create`, { instanceName: INSTANCE });
  } catch {}
  const data = await api("POST", `instance/connect`, { instanceName: INSTANCE });
  return data;
}

export function disconnectWA() {
  api("POST", `instance/disconnect`, { instanceName: INSTANCE }).catch(() => {});
}

export function deleteSession() {
  api("DELETE", `instance/delete/${INSTANCE}`).catch(() => {});
}

export async function getStatus() {
  try {
    const data = await api("GET", `instance/info/${INSTANCE}`);
    const state = data?.instance?.state ?? data?.state ?? "";
    return {
      connected: state === "open",
      connecting: state === "connecting" || state === "syncing",
      qr: data?.base64 ?? data?.qrcode ?? null,
      qrExpired: false,
    };
  } catch {
    return { connected: false, connecting: false, qr: null, qrExpired: false };
  }
}

export async function sendMessage(phone: string, text: string) {
  const number = phone.replace(/[^0-9]/g, "");
  return api("POST", "message/text", {
    number,
    text,
    instanceName: INSTANCE,
    options: { delay: 1200 },
  });
}

export async function getSock() {
  return null;
}
