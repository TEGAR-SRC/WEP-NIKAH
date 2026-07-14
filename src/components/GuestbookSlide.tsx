"use client";

import { useState, useEffect, FormEvent } from "react";
import SlideFrame from "./SlideFrame";
import { useGuest } from "@/lib/guest-context";

interface CommentItem {
  id: string;
  message: string;
  confirm: string;
  createdAt: string;
  guest: { name: string; title: string };
}

export default function GuestbookSlide() {
  const guest = useGuest();
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, []);

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
      if (!res.ok) throw new Error("Gagal mengirim");
      const created = await res.json();
      setComments((prev) => [created, ...prev]);
      setMessage("");
      setConfirm("");
      setSent(true);
    } catch {
      setError("Gagal mengirim, coba lagi");
    } finally {
      setSending(false);
    }
  };

  const confirmLabels: { value: string; label: string }[] = [
    { value: "hadir", label: "Hadir" },
    { value: "tidak hadir", label: "Tidak Hadir" },
    { value: "ragu", label: "Ragu" },
  ];

  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%", padding: "20px" }}>
        <div className="animate__animated animate__fadeIn animate__slower" style={{
          width: "100%",
          maxHeight: "100%",
          overflowY: "auto",
          background: "rgba(228,221,215,0.6)",
          backdropFilter: "blur(4px)",
          borderRadius: 24,
          padding: "28px 20px",
          border: "1px solid rgba(255,255,255,0.3)",
        }}>
          <div className="text-center">
            <div style={{
              fontFamily: "DM Serif Display, serif",
              color: "var(--inv-accent)",
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 4,
            }}>
              Kirim Ucapan & Konfirmasi
            </div>
            <div style={{
              width: 40,
              height: 2,
              background: "var(--inv-accent)",
              margin: "8px auto 16px",
              opacity: 0.4,
            }} />
          </div>

          <div style={{
            fontFamily: "Marcellus, serif",
            fontSize: 13,
            color: "var(--inv-base)",
            textAlign: "center",
            marginBottom: 16,
          }}>
            {guest.title} {guest.name}
          </div>

          {sent ? (
            <div style={{
              textAlign: "center",
              fontFamily: "Marcellus, serif",
              fontSize: 13,
              color: "var(--inv-accent)",
              padding: "12px 0",
            }}>
              Terima kasih atas ucapan & doanya 🙏
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan & doa restu..."
                rows={3}
                style={{
                  width: "100%",
                  fontFamily: "Marcellus, serif",
                  fontSize: 13,
                  color: "var(--inv-base)",
                  background: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(174,116,0,0.15)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />

              <div style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                justifyContent: "center",
              }}>
                {confirmLabels.map(({ value, label }) => (
                  <label key={value} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "Marcellus, serif",
                    fontSize: 12,
                    color: "var(--inv-base)",
                    cursor: "pointer",
                  }}>
                    <input
                      type="radio"
                      name="confirm"
                      value={value}
                      checked={confirm === value}
                      onChange={(e) => setConfirm(e.target.value)}
                      style={{ accentColor: "var(--inv-accent)" }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              {error && (
                <div style={{
                  textAlign: "center",
                  fontFamily: "Marcellus, serif",
                  fontSize: 12,
                  color: "#c00",
                  marginTop: 8,
                }}>
                  {error}
                </div>
              )}

              <div className="flex justify-center" style={{ marginTop: 12 }}>
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: 13,
                    letterSpacing: 2,
                    color: "var(--btn-color, #fff)",
                    background: sending ? "rgba(174,116,0,0.5)" : "var(--inv-accent)",
                    border: "none",
                    borderRadius: 50,
                    padding: "10px 36px",
                    cursor: sending || !message.trim() ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s",
                  }}
                >
                  {sending ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </form>
          )}

          <div style={{
            marginTop: 20,
            borderTop: "1px solid rgba(174,116,0,0.15)",
            paddingTop: 16,
          }}>
            {comments.length === 0 ? (
              <div style={{
                textAlign: "center",
                fontFamily: "Marcellus, serif",
                fontSize: 12,
                color: "var(--inv-base)",
                opacity: 0.5,
              }}>
                Belum ada ucapan
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {comments.map((c) => (
                  <div key={c.id} style={{
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}>
                      <span style={{
                        fontFamily: "DM Serif Display, serif",
                        fontSize: 12,
                        color: "var(--inv-accent)",
                      }}>
                        {c.guest.title} {c.guest.name}
                      </span>
                      {c.confirm && (
                        <span style={{
                          fontFamily: "Marcellus, serif",
                          fontSize: 10,
                          color: "var(--inv-accent)",
                          opacity: 0.7,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}>
                          {c.confirm}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: "Marcellus, serif",
                      fontSize: 12,
                      color: "var(--inv-base)",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                    }}>
                      {c.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
