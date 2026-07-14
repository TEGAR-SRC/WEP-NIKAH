"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) router.push("/dashboard");
    else setError("Password salah");
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
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" autoFocus
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--inv-border)",
            background: "var(--inv-bg)", color: "var(--inv-base)", fontSize: 14, boxSizing: "border-box",
          }}
        />
        {error && <div style={{ color: "#c00", fontSize: 12, marginTop: 8 }}>{error}</div>}
        <button type="submit" style={{
          width: "100%", marginTop: 16, padding: "10px", borderRadius: 8, border: "none",
          background: "var(--inv-accent)", color: "var(--btn-color)", fontSize: 14, cursor: "pointer",
        }}>
          Masuk
        </button>
      </form>
    </div>
  );
}
