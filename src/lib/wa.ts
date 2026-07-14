import makeWASocket, { DisconnectReason, useMultiFileAuthState, WAMessageKey } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";

let sock: ReturnType<typeof makeWASocket> | null = null;
let qrBuffer: string | null = null;
let connected = false;

const SESSION_DIR = join(process.cwd(), "wa_session");
if (!existsSync(SESSION_DIR)) mkdirSync(SESSION_DIR, { recursive: true });

export async function getWA() {
  if (sock && connected) return sock;

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    syncFullHistory: false,
    browser: ["Nikah WA", "Chrome", "1.0"],
  });

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr) qrBuffer = qr;
    if (connection === "close") {
      connected = false;
      const reason = new Boom(lastDisconnect?.error).output.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        sock = null;
        qrBuffer = null;
      } else {
        setTimeout(() => { sock = null; qrBuffer = null; getWA(); }, 5000);
      }
    }
    if (connection === "open") {
      connected = true;
      qrBuffer = null;
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

export function getQR() {
  return qrBuffer;
}

export function isConnected() {
  return connected;
}

export function resetWA() {
  sock?.end(undefined);
  sock = null;
  qrBuffer = null;
  connected = false;
}
