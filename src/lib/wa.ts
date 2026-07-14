import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { mkdirSync, existsSync, rmSync, readdir } from "fs";
import { join } from "path";

let sock: ReturnType<typeof makeWASocket> | null = null;
let qrBuffer: string | null = null;
let connected = false;
let connecting = false;
let qrExpired = false;

const SESSION_DIR = join(process.cwd(), "wa_session");

function ensureDir() {
  if (!existsSync(SESSION_DIR)) mkdirSync(SESSION_DIR, { recursive: true });
}

ensureDir();

export async function connectWA() {
  if (sock || connecting) return;
  connecting = true;
  qrBuffer = null;
  qrExpired = false;

  // Start fresh every time — wipe any stale creds before connecting
  try { rmSync(SESSION_DIR, { recursive: true, force: true }); } catch {}
  ensureDir();

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    syncFullHistory: false,
    browser: ["Nikah WA", "Chrome", "1.0"],
    qrTimeout: 30,
    emitOwnEvents: false,
  });

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr && !connected && !qrBuffer) qrBuffer = qr;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error).output.statusCode;
      connected = false;
      connecting = false;
      qrExpired = true;
      sock = null;

      if (reason === DisconnectReason.loggedOut) {
        try { rmSync(SESSION_DIR, { recursive: true, force: true }); } catch {}
        ensureDir();
      }
    }

    if (connection === "open") {
      connected = true;
      connecting = false;
      qrBuffer = null;
      qrExpired = false;
    }

    if (connection === "connecting") {
      connecting = true;
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

export function disconnectWA() {
  if (sock) {
    sock.end(new Error("manual disconnect"));
    sock = null;
  }
  connected = false;
  connecting = false;
  qrBuffer = null;
  qrExpired = false;
}

export function deleteSession() {
  disconnectWA();
  try { rmSync(SESSION_DIR, { recursive: true, force: true }); } catch {}
  ensureDir();
}

export function getStatus() {
  return { connected, connecting, qr: qrBuffer, qrExpired };
}

export async function getSock() {
  if (!connected) return null;
  return sock;
}
