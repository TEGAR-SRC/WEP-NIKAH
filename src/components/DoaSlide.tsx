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
                <div style={{ fontSize: 36, marginBottom: 8 }}>🙏</div>
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
                        { value: "hadir", label: "✅ Hadir" },
                        { value: "tidak hadir", label: "❌ Tidak" },
                        { value: "ragu", label: "🤔 Ragu" },
                      ].map((opt) => (
                        <button key={opt.value} type="button" onClick={() => setConfirm(opt.value)}
                          style={{
                            padding: "6px 14px", borderRadius: 20, border: "1px solid var(--inv-accent)",
                            background: confirm === opt.value ? "var(--inv-accent)" : "transparent",
                            color: confirm === opt.value ? "var(--btn-color)" : "var(--inv-accent)",
                            fontSize: 12, cursor: "pointer", fontFamily: "Marcellus, serif",
                          }}
                        >
                          {opt.label}
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
