"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import SlideFrame from "./SlideFrame";
import { useGuest } from "@/lib/guest-context";

const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export default function GuestbookSlide() {
  const guest = useGuest();
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: guest.id, message: message.trim(), confirm }),
      });
      if (!res.ok) throw new Error();
      setMessage("");
      setConfirm("");
      setSent(true);
      fetch("/api/wa/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guestId: guest.id, confirm }) }).catch(() => {});
    } catch {
      setError("Gagal mengirim");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <SlideFrame />
      <div style={{ height: "100%", padding: "20px", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{
          background: "rgba(228,221,215,0.6)", backdropFilter: "blur(4px)",
          borderRadius: 24, padding: "24px 20px", border: "1px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--inv-accent)", letterSpacing: 3, marginBottom: 12 }}>
            KIRIM UCAPAN & KONFIRMASI
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--inv-base)", marginBottom: 16 }}>
            {guest.title} {guest.name}
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--inv-accent)", marginBottom: 8 }}>Terima Kasih!</div>
              <div style={{ fontSize: 13, color: "var(--inv-base)", lineHeight: 1.6 }}>
                Ucapan & doa restu Anda sudah kami terima ❤️
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan & doa restu..."
                rows={3}
                style={{
                  width: "100%", fontFamily: "Marcellus, serif", fontSize: 13,
                  color: "var(--inv-base)", background: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(174,116,0,0.15)", borderRadius: 12,
                  padding: "10px 12px", outline: "none", resize: "none",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
                {["hadir","tidak hadir","ragu"].map((v) => (
                  <label key={v} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontFamily: "Marcellus, serif", fontSize: 12,
                    color: "var(--inv-base)", cursor: "pointer",
                  }}>
                    <input type="radio" name="confirm" value={v}
                      checked={confirm === v}
                      onChange={(e) => setConfirm(e.target.value)}
                      style={{ accentColor: "var(--inv-accent)" }}
                    />
                    {v === "hadir" ? "Hadir" : v === "tidak hadir" ? "Tidak Hadir" : "Ragu"}
                  </label>
                ))}
              </div>
              {error && <div style={{ textAlign: "center", fontSize: 12, color: "#c00", marginTop: 8 }}>{error}</div>}
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button type="submit" disabled={sending || !message.trim()}
                  style={{
                    fontFamily: "DM Serif Display, serif", fontSize: 13, letterSpacing: 2,
                    color: "#fff", background: sending ? "rgba(174,116,0,0.5)" : "var(--inv-accent)",
                    border: "none", borderRadius: 50, padding: "10px 36px",
                    cursor: sending || !message.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {sending ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
