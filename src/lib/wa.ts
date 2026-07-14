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
if (!existsSync(SESSION_DIR)) mkdirSync(SESSION_DIR, { recursive: true });

async function isSessionValid() {
  try {
    const files = await fsReaddir(SESSION_DIR);
    return files.includes("creds.json");
  } catch {
    return false;
  }
}

export async function connectWA() {
  if (sock || connecting) return;
  connecting = true;
  qrBuffer = null;
  qrExpired = false;

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    syncFullHistory: false,
    browser: ["Nikah WA", "Chrome", "1.0"],
    qrTimeout: 30, // QR valid 30 detik
    emitOwnEvents: false,
  });

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    // Only capture first QR, ignore regenerated ones
    if (qr && !connected && !qrBuffer) {
      qrBuffer = qr;
    }

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error).output.statusCode;
      connected = false;
      connecting = false;
      qrExpired = true;

      if (reason === DisconnectReason.loggedOut) {
        try { rmSync(SESSION_DIR, { recursive: true, force: true }); } catch {}
        mkdirSync(SESSION_DIR, { recursive: true });
      }

      sock = null;
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
  mkdirSync(SESSION_DIR, { recursive: true });
}

export function getStatus() {
  return { connected, connecting, qr: qrBuffer, qrExpired };
}

export async function getSock() {
  if (!connected) return null;
  return sock;
}

function fsReaddir(dir: string): Promise<string[]> {
  return new Promise((resolve) => readdir(dir, (err, files) => resolve(err ? [] : files)));
}
