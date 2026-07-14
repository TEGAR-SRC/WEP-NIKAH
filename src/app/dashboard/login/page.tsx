"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Isi email dan password"); return; }
    if (!token) { setError("Verifikasi captcha dulu"); return; }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password, turnstileToken: token }),
    });
    if (res.ok) router.push("/dashboard");
    else setError("Email atau password salah");
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
        <div style={{ marginBottom: 8 }}>
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setToken} />
        </div>
        {error && <div style={{ color: "#c00", fontSize: 12, marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{
          width: "100%", padding: "10px", borderRadius: 8, border: "none",
          background: "var(--inv-accent)", color: "var(--btn-color)", fontSize: 14, cursor: "pointer",
        }}>
          Masuk
        </button>
      </form>
    </div>
  );
}
