"use client";

import { useState } from "react";
import SlideFrame from "./SlideFrame";
import { useGuest } from "@/lib/guest-context";

export default function DoaSlide() {
  const guest = useGuest();
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (!confirm) return;
    setSending(true);
    setError("");
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: guest.id, message: message.trim(), confirm }),
      });
      if (!r.ok) throw new Error();
      setSent(true);
      fetch("/api/wa/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guestId: guest.id, confirm }) }).catch(() => {});
    } catch {
      setError("Gagal");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%", padding: "20px" }}>
        <div className="animate__animated animate__fadeIn animate__slower" style={{
          width: "100%",
          background: "rgba(228,221,215,0.6)",
          backdropFilter: "blur(4px)",
          borderRadius: 24,
          padding: "28px 20px",
          border: "1px solid rgba(255,255,255,0.3)",
        }}>
          <div className="font-latin color-accent text-center" style={{ fontSize: 26 }}>Do&rsquo;a Untuk Pengantin</div>
          <div style={{ width: 40, height: 2, background: "var(--inv-accent)", margin: "12px auto 16px", opacity: 0.4 }} />
          <div className="text-center">
            <div style={{ fontSize: 14, padding: "0 12px", lineHeight: 2.2, color: "var(--inv-base)" }}>
              &ldquo;Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, dan mengumpulkan kalian berdua dalam kebaikan&rdquo;<br /><br />[HR. Abu Daud]
            </div>

            {sent ? (
              <div style={{ padding: "16px 0" }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="var(--inv-accent)" style={{ marginBottom: 8 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--inv-accent)" }}>Terima Kasih!</div>
                <div style={{ fontSize: 13, color: "var(--inv-base)", marginTop: 4 }}>Konfirmasi & doa Anda sudah kami terima ❤️</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: "var(--inv-base)", marginTop: 16, lineHeight: 1.6 }}>
                  {guest.title} {guest.name}
                </div>
                <button type="button" onClick={() => setShow(!show)}
                  style={{
                    padding: "10px 28px", borderRadius: 50, border: "1px solid var(--inv-accent)",
                    background: show ? "var(--inv-accent)" : "transparent",
                    color: show ? "var(--btn-color)" : "var(--inv-accent)",
                    fontSize: 13, cursor: "pointer", marginTop: 10,
                    fontFamily: "Marcellus, serif", letterSpacing: 1,
                  }}
                >
                  {show ? "Tutup" : "Konfirmasi & Kirim Ucapan"}
                </button>

                {show && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(174,116,0,0.06)" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 10 }}>
                      {[
                        { value: "hadir", label: "Hadir", svg: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> },
                        { value: "tidak hadir", label: "Tidak", svg: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg> },
                        { value: "ragu", label: "Ragu", svg: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg> },
                      ].map((opt) => (
                          <button key={opt.value} type="button" onClick={() => setConfirm(opt.value)}
                          style={{
                            padding: "6px 14px", borderRadius: 20, border: "1px solid var(--inv-accent)",
                            background: confirm === opt.value ? "var(--inv-accent)" : "transparent",
                            color: confirm === opt.value ? "var(--btn-color)" : "var(--inv-accent)",
                            fontSize: 12, cursor: "pointer", fontFamily: "Marcellus, serif",
                            display: "inline-flex", alignItems: "center", gap: 4,
                          }}
                        >
                          {opt.svg} {opt.label}
                        </button>
                      ))}
                    </div>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tulis doa/ucapan (opsional)..."
                      rows={2}
                      style={{
                        width: "100%", fontFamily: "Marcellus, serif", fontSize: 12,
                        color: "var(--inv-base)", background: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(174,116,0,0.15)", borderRadius: 8,
                        padding: "8px 10px", outline: "none", resize: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    {error && <div style={{ fontSize: 12, color: "#c00", marginTop: 6 }}>{error}</div>}
                    <button type="button" onClick={send} disabled={sending || !confirm}
                      style={{
                        width: "100%", marginTop: 8, padding: "8px", borderRadius: 50, border: "none",
                        background: sending || !confirm ? "rgba(174,116,0,0.3)" : "var(--inv-accent)",
                        color: "var(--btn-color)", fontSize: 13, cursor: sending || !confirm ? "default" : "pointer",
                        fontFamily: "Marcellus, serif",
                      }}
                    >
                      {sending ? "Mengirim..." : "Kirim"}
                    </button>
                  </div>
                )}
              </>
            )}

            <div style={{ fontSize: 12, color: "var(--inv-base)", opacity: 0.7, marginTop: 14 }}>
              Batas akhir konfirmasi<br /><span style={{ fontFamily: "DM Serif Display, serif", color: "var(--inv-accent)", fontSize: 14 }}>20 Juli 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
