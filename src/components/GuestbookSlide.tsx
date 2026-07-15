"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import SlideFrame from "./SlideFrame";
import { useGuest } from "@/lib/guest-context";

const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

const colors = ["#AE7400","#956032","#5D4E37","#8B6914","#6B4F3A","#9B7B3E","#7A5E3C","#B8860B","#8B5E3C","#A0762C"];

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  const color = colors[name.length % colors.length];
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, fontWeight: 700, flexShrink: 0 }}>{initial}</div>;
}

export default function GuestbookSlide() {
  const guest = useGuest();
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComments = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/comments?page=${p}&limit=5`);
      if (!r.ok) return;
      const d = await r.json();
      setComments(d.comments || []);
      setTotalPages(d.totalPages || 1);
      setPage(d.page || 1);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchComments(1); }, [fetchComments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true); setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: guest.id, message: message.trim(), confirm }),
      });
      if (!res.ok) throw new Error();
      setMessage(""); setConfirm(""); setSent(true);
      await fetchComments(1);
      fetch("/api/wa/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guestId: guest.id, confirm }) }).catch(() => {});
    } catch { setError("Gagal mengirim"); } finally { setSending(false); }
  };

  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <SlideFrame />
      <div style={{ padding: "20px" }}>
        <div style={{ background: "rgba(228,221,215,0.6)", backdropFilter: "blur(4px)", borderRadius: 24, padding: "24px 20px", border: "1px solid rgba(255,255,255,0.3)" }}>
          <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--inv-accent)", letterSpacing: 3, marginBottom: 12 }}>KIRIM UCAPAN & KONFIRMASI</div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--inv-accent)" }}>Terima Kasih {guest.title} {guest.name}!</div>
              <div style={{ fontSize: 13, color: "var(--inv-base)", marginTop: 8 }}>Ucapan & doa restu Anda sudah kami terima ❤️</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan & doa restu..."
                rows={3}
                style={{ width: "100%", fontFamily: "Marcellus, serif", fontSize: 13, color: "var(--inv-base)", background: "rgba(255,255,255,0.4)", border: "1px solid rgba(174,116,0,0.15)", borderRadius: 12, padding: "10px 12px", outline: "none", resize: "none", boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
                {["hadir","tidak hadir","ragu"].map((v) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Marcellus, serif", fontSize: 12, color: "var(--inv-base)", cursor: "pointer" }}>
                    <input type="radio" name="confirm" value={v} checked={confirm === v} onChange={(e) => setConfirm(e.target.value)} style={{ accentColor: "var(--inv-accent)" }} />
                    {v === "hadir" ? "Hadir" : v === "tidak hadir" ? "Tidak Hadir" : "Ragu"}
                  </label>
                ))}
              </div>
              {error && <div style={{ textAlign: "center", fontSize: 12, color: "#c00", marginTop: 8 }}>{error}</div>}
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button type="submit" disabled={sending || !message.trim()}
                  style={{ fontFamily: "DM Serif Display, serif", fontSize: 13, letterSpacing: 2, color: "#fff", background: sending ? "rgba(174,116,0,0.5)" : "var(--inv-accent)", border: "none", borderRadius: 50, padding: "10px 36px", cursor: sending || !message.trim() ? "not-allowed" : "pointer" }}
                >{sending ? "Mengirim..." : "Kirim"}</button>
              </div>
            </form>
          )}

          <div style={{ marginTop: 20, borderTop: "1px solid rgba(174,116,0,0.15)", paddingTop: 16 }}>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 12, color: "var(--inv-accent)", textAlign: "center", letterSpacing: 3, marginBottom: 12 }}>Ucapan & Doa</div>
            {loading ? (
              <div style={{ textAlign: "center", fontFamily: "Marcellus, serif", fontSize: 12, opacity: 0.5 }}>Memuat...</div>
            ) : comments.length === 0 ? (
              <div style={{ textAlign: "center", fontFamily: "Marcellus, serif", fontSize: 12, opacity: 0.5 }}>Belum ada ucapan</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {comments.map((c: any) => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.3)", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Avatar name={c.guest?.name || "?"} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 12, color: "var(--inv-accent)" }}>{c.guest?.title} {c.guest?.name}</span>
                          {c.confirm && <span style={{ fontFamily: "Marcellus, serif", fontSize: 10, color: "var(--inv-accent)", opacity: 0.7 }}>{c.confirm === "hadir" ? "Hadir" : c.confirm === "tidak hadir" ? "Tidak Hadir" : "Ragu"}</span>}
                        </div>
                        <div style={{ fontFamily: "Marcellus, serif", fontSize: 10, color: "var(--inv-base)", opacity: 0.5, marginTop: 1 }}>{formatDate(c.createdAt)}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "Marcellus, serif", fontSize: 12, color: "var(--inv-base)", lineHeight: 1.5 }}>{c.message}</div>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
                <button onClick={() => fetchComments(page - 1)} disabled={page <= 1}
                  style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid var(--inv-border)", background: "transparent", color: page <= 1 ? "var(--inv-border)" : "var(--inv-base)", cursor: page <= 1 ? "default" : "pointer", fontSize: 12 }}>Sebelumnya</button>
                <span style={{ fontSize: 12, alignSelf: "center", opacity: 0.6 }}>{page} / {totalPages}</span>
                <button onClick={() => fetchComments(page + 1)} disabled={page >= totalPages}
                  style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid var(--inv-border)", background: "transparent", color: page >= totalPages ? "var(--inv-border)" : "var(--inv-base)", cursor: page >= totalPages ? "default" : "pointer", fontSize: 12 }}>Selanjutnya</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
