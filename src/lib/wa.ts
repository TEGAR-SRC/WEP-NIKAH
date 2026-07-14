import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { mkdirSync, existsSync, rmSync } from "fs";
import { join } from "path";

let sock: ReturnType<typeof makeWASocket> | null = null;
let qrBuffer: string | null = null;
let connected = false;
let connecting = false;

const SESSION_DIR = join(process.cwd(), "wa_session");
if (!existsSync(SESSION_DIR)) mkdirSync(SESSION_DIR, { recursive: true });

export async function connectWA() {
  if (sock || connecting) return;
  connecting = true;
  qrBuffer = null;

  // If session dir has no files, delete stale creds
  try {
    const files = await fsReadDir(SESSION_DIR);
    if (files.length === 0) {
      rmSync(SESSION_DIR, { recursive: true, force: true });
      mkdirSync(SESSION_DIR, { recursive: true });
    }
  } catch {}

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    syncFullHistory: false,
    browser: ["Nikah WA", "Chrome", "1.0"],
  });

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr && !connected) qrBuffer = qr;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error).output.statusCode;
      connected = false;
      connecting = false;
      sock = null;
      qrBuffer = null;

      // Device removed/replaced → wipe session so next connect gets fresh QR
      if (reason === DisconnectReason.loggedOut) {
        try { rmSync(SESSION_DIR, { recursive: true, force: true }); } catch {}
        mkdirSync(SESSION_DIR, { recursive: true });
      }
    }

    if (connection === "open") {
      connected = true;
      connecting = false;
      qrBuffer = null;
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
}

export function deleteSession() {
  disconnectWA();
  try { rmSync(SESSION_DIR, { recursive: true, force: true }); } catch {}
  mkdirSync(SESSION_DIR, { recursive: true });
}

export function getStatus() {
  return { connected, connecting, qr: qrBuffer };
}

export async function getSock() {
  return sock;
}

// Promisify fs.readdir
import { readdir } from "fs";
function fsReadDir(dir: string): Promise<string[]> {
  return new Promise((resolve) => {
    readdir(dir, (err, files) => resolve(err ? [] : files));
  });
}
