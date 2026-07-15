"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (!email.trim() || !password.trim()) { setError("Isi email dan password"); return; }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Email atau password salah");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Server timeout — database kemungkinan sedang down.");
      } else {
        setError("Terjadi kesalahan koneksi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "var(--inv-bg)", color: "var(--inv-base)",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "rgba(228,221,215,0.8)", padding: 32, borderRadius: 16,
        border: "1px solid rgba(174,116,0,0.2)", width: 320,
      }}>
        <h1 style={{ fontSize: 24, marginBottom: 20, fontFamily: "DM Serif Display, serif", color: "var(--inv-accent)" }}>
          Dashboard
        </h1>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nikah.com" autoFocus
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--inv-border)",
              background: "var(--inv-bg)", color: "var(--inv-base)", fontSize: 14, boxSizing: "border-box",
            }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--inv-border)",
              background: "var(--inv-bg)", color: "var(--inv-base)", fontSize: 14, boxSizing: "border-box",
            }} />
        </div>
        {error && <div style={{ color: "#c00", fontSize: 12, marginBottom: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "10px", borderRadius: 8, border: "none",
          background: "var(--inv-accent)", color: "var(--btn-color)", fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
