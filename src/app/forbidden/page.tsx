import Link from "next/link";

export default function Forbidden() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--inv-bg)", color: "var(--inv-base)", fontFamily: "var(--font-base)", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 72, fontWeight: 700, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif", lineHeight: 1 }}>403</div>
      <div style={{ fontSize: 18, marginTop: 8, fontFamily: "DM Serif Display, serif", color: "var(--inv-accent)" }}>Akses Ditolak</div>
      <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.6, maxWidth: 300 }}>
        Anda tidak memiliki akses ke halaman ini.
      </div>
      <Link href="/" style={{ marginTop: 20, padding: "10px 28px", borderRadius: 50, border: "1px solid var(--inv-accent)", color: "var(--inv-accent)", textDecoration: "none", fontSize: 13, fontFamily: "Marcellus, serif" }}>Kembali ke Beranda</Link>
    </div>
  );
}
