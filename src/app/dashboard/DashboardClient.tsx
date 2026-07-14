"use client";

import { useEffect, useState, createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { TableSkeleton, CardSkeleton } from "@/components/Skeleton";

type Guest = { id: string; name: string; slug: string; phone: string | null; status: string; title: string };
type Comment = { id: string; guestId: string; message: string; confirm: string; createdAt: string; guest: { name: string } };
type Template = { id: string; name: string; subject: string; body: string };
type Tab = "Tamu" | "Ucapan" | "Template" | "Kirim WA" | "Statistik";

const TABS: Tab[] = ["Tamu", "Ucapan", "Template", "Kirim WA", "Statistik"];
const TITLES = ["Bapak", "Ibu", "Bapak/Ibu"];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function Pagination({ page, totalPages, rows, onPage, onRows }: { page: number; totalPages: number; rows: number; onPage: (p: number) => void; onRows: (r: number) => void }) {
  return (
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
        <span style={{ opacity: 0.6 }}>Rows:</span>
        <select value={rows} onChange={(e) => { onRows(Number(e.target.value)); onPage(0); }}
          style={{ padding: "4px 8px", border: "1px solid var(--inv-accent)", borderRadius: 6, background: "rgba(174,116,0,0.06)", color: "var(--inv-accent)", fontSize: 13, fontWeight: 600, outline: "none", cursor: "pointer" }}>
          {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <button disabled={page === 0} onClick={() => onPage(page - 1)}
          style={{ padding: "4px 10px", border: "1px solid var(--inv-border)", borderRadius: 6, background: "transparent", color: page === 0 ? "var(--inv-border)" : "#000", cursor: page === 0 ? "default" : "pointer", fontSize: 16, fontWeight: 700, opacity: page === 0 ? 0.3 : 1, lineHeight: 1 }}>‹</button>
        {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => (
          <button key={i} onClick={() => onPage(i)}
            style={{ minWidth: 32, padding: "4px 0", border: i === page ? "none" : "1px solid var(--inv-border)", borderRadius: 6, background: i === page ? "var(--inv-accent)" : "transparent", color: i === page ? "var(--btn-color)" : "var(--inv-base)", cursor: "pointer", fontSize: 13, fontWeight: i === page ? 700 : 400 }}>{i + 1}</button>
        ))}
        {totalPages > 8 && <span style={{ fontSize: 13, opacity: 0.4 }}>...</span>}
        <button disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)}
          style={{ padding: "4px 10px", border: "1px solid var(--inv-border)", borderRadius: 6, background: "transparent", color: page >= totalPages - 1 ? "var(--inv-border)" : "#000", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 16, fontWeight: 700, opacity: page >= totalPages - 1 ? 0.3 : 1, lineHeight: 1 }}>›</button>
      </div>
    </div>
  );
}

const s = {
  container: { maxWidth: 800, margin: "0 auto", padding: "24px 16px", background: "var(--inv-bg)", color: "var(--inv-base)", fontFamily: "var(--font-base)", minHeight: "100vh" } as React.CSSProperties,
  h1: { fontSize: 24, marginBottom: 16 },
  tabs: { display: "flex", gap: 4, borderBottom: "2px solid var(--inv-border)", marginBottom: 20, overflowX: "auto", WebkitOverflowScrolling: "touch", flexShrink: 0, scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties,
  tab: (a: boolean): React.CSSProperties => ({ padding: "8px 12px", cursor: "pointer", border: "none", background: a ? "var(--inv-accent)" : "transparent", color: a ? "var(--btn-color)" : "var(--inv-base)", borderRadius: "8px 8px 0 0", fontWeight: a ? 700 : 400, fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 }),
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
  th: { textAlign: "left" as const, padding: "8px 6px", borderBottom: "1px solid var(--inv-border)", fontWeight: 700 },
  td: { padding: "8px 6px", borderBottom: "1px solid var(--inv-border)", verticalAlign: "middle" as const },
  btn: (c = "var(--inv-accent)"): React.CSSProperties => ({ padding: "5px 12px", border: "none", borderRadius: 4, background: c, color: "var(--btn-color)", cursor: "pointer", fontSize: 12, marginRight: 4, whiteSpace: "nowrap" }),
  input: { width: "100%", padding: "6px 8px", border: "1px solid var(--inv-border)", borderRadius: 4, background: "var(--inv-bg)", color: "var(--inv-base)", fontSize: 13, boxSizing: "border-box" as const },
  select: { width: "100%", padding: "6px 8px", border: "1px solid var(--inv-border)", borderRadius: 4, background: "var(--inv-bg)", color: "var(--inv-base)", fontSize: 13 },
  label: { display: "block", fontSize: 12, marginBottom: 2, fontWeight: 600 },
  formRow: { display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" as const },
  formGroup: { flex: "1 0 140px" },
  textarea: { width: "100%", padding: "6px 8px", border: "1px solid var(--inv-border)", borderRadius: 4, background: "var(--inv-bg)", color: "var(--inv-base)", fontSize: 13, boxSizing: "border-box" as const, minHeight: 120, resize: "vertical" as const, fontFamily: "monospace" } as React.CSSProperties,
  hint: { fontSize: 11, color: "var(--inv-accent)", marginTop: 2 },
  previewBox: { padding: 12, border: "1px solid var(--inv-border)", borderRadius: 4, marginTop: 8, fontSize: 13, whiteSpace: "pre-wrap" as const, background: "rgba(0,0,0,0.03)" },
  checkbox: { marginRight: 6 },
  toast: (t: "ok" | "err"): React.CSSProperties => ({ padding: "8px 16px", borderRadius: 8, marginBottom: 12, fontSize: 13, background: t === "ok" ? "#d4edda" : "#f8d7da", color: t === "ok" ? "#155724" : "#721c24", border: `1px solid ${t === "ok" ? "#c3e6cb" : "#f5c6cb"}` }),
  overlay: { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", zIndex: 999 } as React.CSSProperties,
  dialog: { background: "var(--inv-bg)", borderRadius: 12, padding: 24, maxWidth: 320, width: "90%", textAlign: "center" as const, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" } as React.CSSProperties,
};

const NotifCtx = createContext<{ show: (msg: string, type?: "ok" | "err") => void }>({ show: () => {} });
const ConfirmCtx = createContext<{ ask: (msg: string) => Promise<boolean> }>({ ask: async () => false });

function NotifProvider({ children }: { children: ReactNode }) {
  const [notif, setNotif] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const show = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }, []);
  return (
    <NotifCtx.Provider value={{ show }}>
      {notif && <div style={s.toast(notif.type)}>{notif.msg}</div>}
      {children}
    </NotifCtx.Provider>
  );
}

function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ msg: string; resolve: (v: boolean) => void } | null>(null);
  const ask = useCallback((msg: string) => new Promise<boolean>((r) => setState({ msg, resolve: r })), []);
  return (
    <ConfirmCtx.Provider value={{ ask }}>
      {children}
      {state && (
        <div style={s.overlay} onClick={() => { state.resolve(false); setState(null); }}>
          <div style={s.dialog} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 14, marginBottom: 16 }}>{state.msg}</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button style={s.btn("var(--inv-accent)")} onClick={() => { state.resolve(true); setState(null); }}>Ya</button>
              <button style={s.btn("var(--inv-base)")} onClick={() => { state.resolve(false); setState(null); }}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}

export default function DashboardClient() {
  const [tab, setTab] = useState<Tab>("Tamu");

  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  return (
    <div style={s.container}>
      <h1 style={s.h1}>Dashboard</h1>
      <div style={s.tabs}>
        {TABS.map((t) => (
          <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <NotifProvider>
        <ConfirmProvider>
          {tab === "Tamu" && <GuestsTab />}
          {tab === "Ucapan" && <CommentsTab />}
          {tab === "Template" && <TemplateTab />}
          {tab === "Kirim WA" && <KirimWATab />}
          {tab === "Statistik" && <StatsTab />}
        </ConfirmProvider>
      </NotifProvider>
      <footer style={{ marginTop: 40, padding: "24px 0", borderTop: "1px solid var(--inv-border)", textAlign: "center", fontSize: 12, opacity: 0.6, lineHeight: 1.8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
          <span>Dibuat oleh</span>
          <a href="https://github.com/TEGAR-SRC" target="_blank" rel="noopener noreferrer" style={{ color: "var(--inv-accent)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <svg viewBox="0 0 1024 1024" width="16" height="16" fill="var(--inv-accent)"><path d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"/></svg>
            tegararrahman
          </a>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="var(--inv-base)"><defs><linearGradient id="a" x1="55.6%" x2="83.2%" y1="56.4%" y2="96.1%"><stop offset="0%" stop-color="var(--inv-base)"/><stop offset="100%" stop-color="var(--inv-base)" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="50%" x2="50%" y1="0%" y2="73.4%"><stop offset="0%" stop-color="var(--inv-base)"/><stop offset="100%" stop-color="var(--inv-base)" stop-opacity="0"/></linearGradient></defs><circle cx="128" cy="128" r="128" fill="var(--inv-base)"/><path fill="url(#a)" d="M212.6 224L98.3 76.8H76.8v102.4h17.2V98.7L199.1 234.5a128 128 0 0 0 13.5-10.4"/><path fill="url(#b)" d="M163.6 76.8h17v102.4h-17z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 445" width="18" height="19" fill="var(--inv-base)"><path d="M323.2 324.2c2.8-23.6 2-27.1 19.6-23.2l4.5.4c13.5.6 31.2-2.2 41.6-7 22.3-10.4 35.6-27.7 13.6-23.2-50.3 10.4-53.8-6.6-53.8-6.6 53.1-78.8 75.3-178.8 56.2-203.3-52.3-66.8-142.8-35.2-144.3-34.4l-.5.1c-9.9-2.1-21.1-3.3-33.5-3.5-22.8-.4-40.1 6-53.2 15.9 0 0-161.4-66.5-153.9 83.6 1.6 32 45.8 241.7 98.5 178.3 19.2-23.1 37.8-42.7 37.8-42.7 9.3 6.1 20.3 9.3 31.9 8.1l.9-.7c-.3 2.9-.2 5.7.4 9-13.6 15.2-9.6 17.8-36.7 23.4-27.5 5.7-11.3 15.7-.8 18.4 12.8 3.2 42.3 7.7 62.3-20.2l-.8 3.2c5.3 4.2 5 30.6 5.7 49.4.8 18.9 2 36.4 5.9 46.8 3.8 10.4 8.4 37 44 29.4 29.8-6.4 52.6-15.6 54.7-101.1" style="fill:var(--inv-base);stroke:var(--inv-base);stroke-width:37.4"/><path d="M187.7 274.1c-1.4-8.9 2.9-19.5 7.5-32 6.9-18.6 22.9-37.2 10.1-96.3-9.5-44-73.4-9.2-73.4-3.2s2.9 30.3-1.1 58.5c-5.1 37 23.5 68.2 56.5 65" style="fill:var(--inv-bg)"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 220" width="20" height="17" fill="var(--inv-base)"><path d="M246 169c-13.7 7-84.5 36.2-99.5 44-15.1 7.9-23.5 7.8-35.4 2.1C99.2 209.4 24 179 10.3 172.5 3.6 169.3 0 166.5 0 164v-26s98-21.3 113.9-27c15.8-5.6 21.3-5.8 34.8-.9 13.4 5 94 19.5 107.3 24.3V160c0 2.5-3 5.3-10 9" fill="#912626"/><path d="M246 143.2c-13.7 7.1-84.5 36.2-99.5 44-15.1 8-23.5 7.9-35.4 2.2-11.9-5.7-87.2-36.1-100.8-42.6-13.5-6.5-13.8-11-.5-16.2 13.4-5.2 88.2-34.6 104-40.3 16-5.6 21.4-5.8 34.9-1 13.4 5 83.8 33 97.1 37.9 13.3 4.9 13.8 8.9.2 16" fill="#C6302B"/><path d="M246 127c-13.7 7.2-84.5 36.3-99.5 44.2-15.1 7.8-23.5 7.7-35.4 2-11.9-5.6-87.2-36-100.8-42.6-6.7-3.2-10.3-6-10.3-8.5V96.2s98-21.3 113.9-27c15.8-5.7 21.3-5.9 34.8-1 13.4 5 94 19.5 107.3 24.4V118c0 2.5-3 5.4-10 9" fill="#912626"/><path d="M246 101.4c-13.7 7-84.5 36.2-99.5 44-15.1 7.9-23.5 7.8-35.4 2.1C99.2 141.8 24 111.4 10.3 105c-13.5-6.5-13.8-11-.5-16.1C23.2 83.5 98 54 113.8 48.5c16-5.7 21.4-6 34.9-1 13.4 5 83.8 33 97.1 37.8 13.3 5 13.8 9 .2 16" fill="#C6302B"/><path d="M246 83.7c-13.7 7-84.5 36.2-99.5 44-15.1 7.9-23.5 7.8-35.4 2.1C99.2 124.1 24 93.7 10.3 87.2 3.6 84 0 81.2 0 78.7v-26s98-21.3 113.9-27c15.8-5.6 21.3-5.8 34.8-.9 13.4 5 94 19.5 107.3 24.4v25.5c0 2.5-3 5.3-10 9" fill="#912626"/><path d="M246 58c-13.7 7-84.5 36.1-99.5 44-15.1 7.9-23.5 7.8-35.4 2C99.2 98.5 24 68 10.3 61.6c-13.5-6.5-13.8-11-.5-16.2C23.2 40.1 98 10.7 113.8 5c16-5.6 21.4-5.8 34.9-.9 13.4 5 83.8 33 97.1 37.8 13.3 4.9 13.8 9 .2 16" fill="#C6302B"/><path d="m159.3 32.8-22 2.2-5 11.9-8-13.2L99 31.4l19-6.9-5.8-10.5 17.8 7 16.7-5.5-4.5 10.9 17 6.4M131 90.3l-41-17 58.8-9.1-17.8 26M74 39.3c17.5 0 31.5 5.5 31.5 12.2 0 6.8-14 12.2-31.4 12.2s-31.5-5.4-31.5-12.2c0-6.7 14.1-12.2 31.5-12.2" fill="#FFF"/></svg>
        </div>
      </footer>
    </div>
  );
}

function GuestsTab() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Bapak/Ibu");
  const [phone, setPhone] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { show } = useContext(NotifCtx);
  const { ask } = useContext(ConfirmCtx);

  const fetchGuests = async () => { setLoading(true); const r = await fetch("/api/guests"); if (r.ok) setGuests(await r.json()); setLoading(false); };
  useEffect(() => { fetchGuests(); }, []);

  const addGuest = async () => {
    if (!name.trim()) return;
    const slug = slugify(name);
    const r = await fetch("/api/guests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), slug, title, phone: phone.trim() || undefined }) });
    if (r.ok) { setName(""); setPhone(""); setTitle("Bapak/Ibu"); fetchGuests(); show("Tamu berhasil ditambahkan"); }
    else { const e = await r.json(); show(e.error || "Gagal", "err"); }
  };

  const deleteGuest = async (slug: string) => {
    if (!(await ask("Hapus tamu ini?"))) return;
    await fetch(`/api/guests/${slug}`, { method: "DELETE" });
    fetchGuests(); show("Tamu dihapus");
  };

  const totalPages = Math.max(1, Math.ceil(guests.length / rowsPerPage));
  const paged = guests.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  if (loading) return <><CardSkeleton /><TableSkeleton /></>;
  return (
    <div>
      <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 0 140px" }}><label style={s.label}>Nama</label><input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama tamu" /></div>
          <div style={{ flex: "0 0 110px" }}><label style={s.label}>Title</label><select style={s.select} value={title} onChange={(e) => setTitle(e.target.value)}>{TITLES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div style={{ flex: "1 0 120px" }}><label style={s.label}>Phone</label><input style={s.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxx" /></div>
          <div><button style={s.btn()} onClick={addGuest}>Tambah</button></div>
        </div>
        <div style={{ fontSize: 11, marginTop: 4, color: "var(--inv-accent)" }}>Slug: {name ? slugify(name) : "(auto)"}</div>
      </div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}><table style={s.table}>
        <thead><tr><th style={s.th}>Nama</th><th style={s.th}>Title</th><th style={s.th}>Slug</th><th style={s.th}>Phone</th><th style={s.th}>Status</th><th style={s.th}>Aksi</th></tr></thead>
        <tbody>
          {paged.map((g) => (
            <tr key={g.id}>
              <td style={s.td}>{g.name}</td><td style={s.td}>{g.title}</td><td style={s.td}><code>{g.slug}</code></td><td style={s.td}>{g.phone ?? "—"}</td><td style={s.td}>{g.status}</td>
              <td style={s.td}><div style={{ display: "flex", gap: 6 }}>
                <button style={s.btn()} onClick={() => { const base = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin; navigator.clipboard.writeText(`${base}/undangan/${g.slug}`); show("Link tersalin"); }}>Salin Link</button>
                <button style={s.btn("#b33")} onClick={() => deleteGuest(g.slug)}>Hapus</button>
              </div></td>
            </tr>
          ))}
          {guests.length === 0 && <tr><td style={s.td} colSpan={6}>Belum ada tamu.</td></tr>}
        </tbody>
      </table></div>
      <Pagination page={page} totalPages={totalPages} rows={rowsPerPage} onPage={setPage} onRows={setRowsPerPage} />
    </div>
  );
}

function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { show } = useContext(NotifCtx);
  const { ask } = useContext(ConfirmCtx);

  const fetchComments = async () => { const r = await fetch("/api/comments?limit=100"); if (r.ok) { const d = await r.json(); setComments(d.comments ?? d); } };
  useEffect(() => { fetchComments(); }, []);

  const deleteComment = async (id: string) => {
    if (!(await ask("Hapus ucapan ini?"))) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    fetchComments(); show("Ucapan dihapus");
  };

  const confirmLabel = (c: string) => c === "hadir" ? "Hadir" : c === "tidak hadir" ? "Tidak Hadir" : c === "ragu" ? "Ragu" : "—";

  const filtered = comments.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.guest.name.toLowerCase().includes(q) || c.message.toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <input style={{ ...s.input, flex: 1 }} placeholder="Cari nama atau pesan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
      </div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}><table style={s.table}>
        <thead><tr><th style={s.th}>Nama</th><th style={s.th}>Pesan</th><th style={s.th}>Konfirmasi</th><th style={s.th}>Tanggal</th><th style={s.th}>Aksi</th></tr></thead>
        <tbody>
          {paged.map((c) => (
            <tr key={c.id}>
              <td style={s.td}>{c.guest.name}</td><td style={s.td}>{c.message}</td><td style={s.td}>{confirmLabel(c.confirm)}</td>
              <td style={s.td}>{new Date(c.createdAt).toLocaleDateString("id-ID")}</td>
              <td style={s.td}><button style={s.btn("#b33")} onClick={() => deleteComment(c.id)}>Hapus</button></td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td style={s.td} colSpan={5}>Belum ada ucapan.</td></tr>}
        </tbody>
      </table></div>
      <Pagination page={page} totalPages={totalPages} rows={rowsPerPage} onPage={setPage} onRows={setRowsPerPage} />
    </div>
  );
}

function TemplateTab() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { show } = useContext(NotifCtx);

  const fetchTemplates = async () => {
    const r = await fetch("/api/templates"); if (!r.ok) return;
    const list: Template[] = await r.json(); setTemplates(list);
    const def = list.find((t) => t.name === "undangan") || list[0];
    if (def) { setSelected(def); setSubject(def.subject); setBody(def.body); }
  };
  useEffect(() => { fetchTemplates(); }, []);

  const save = async () => {
    if (!selected) return;
    const r = await fetch(`/api/templates/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, body }) });
    if (r.ok) { const u = await r.json(); setSelected(u); setSubject(u.subject); setBody(u.body); fetchTemplates(); show("Tersimpan"); }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>Pilih Template</label>
        <select style={{ ...s.select, maxWidth: 300 }} value={selected?.id ?? ""} onChange={(e) => { const t = templates.find((x) => x.id === e.target.value); if (t) { setSelected(t); setSubject(t.subject); setBody(t.body); } }}>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}><label style={s.label}>Subjek</label><input style={s.input} value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>Body</label><textarea style={s.textarea} value={body} onChange={(e) => setBody(e.target.value)} />
        <div style={s.hint}>Placeholder: {`{title}`}, {`{name}`}, {`{slug}`}, {`{BASE_URL}`}</div>
      </div>
      <button style={s.btn()} onClick={save}>Simpan</button>
    </div>
  );
}

type GuestStat = { id: string; name: string; title: string; slug: string; phone: string | null; opened: boolean; visitCount: number; lastVisit: string | null; waSent: boolean };
type ChartItem = { label: string; count: number; unique: number };
type PathStat = { path: string; count: number };
type RecentVisit = { id: string; type: string; guestId: string | null; ip: string; ua: string; path: string; time: string };
type StatsData = { totalGuests: number; totalVisits: number; totalPageviews: number; uniqueVisitors: number; openedCount: number; notOpenedCount: number; guestStats: GuestStat[]; chart: ChartItem[]; topPaths: PathStat[]; recent: RecentVisit[]; filterDays: number };

const RANGES = [
  { label: "1 Hari", days: 1 }, { label: "3 Hari", days: 3 }, { label: "7 Hari", days: 7 },
  { label: "1 Bulan", days: 30 }, { label: "3 Bulan", days: 90 }, { label: "6 Bulan", days: 180 }, { label: "1 Tahun", days: 365 },
];

function StatsTab() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [rangeDays, setRangeDays] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "opened" | "not">("all");
  const [showRecent, setShowRecent] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchStats = async (days: number) => {
    const q = days > 0 ? `?days=${days}` : "";
    const r = await fetch(`/api/stats${q}`);
    if (r.ok) setStats(await r.json());
  };
  useEffect(() => { fetchStats(rangeDays); }, [rangeDays]);

  if (!stats) return <div style={{ fontSize: 13 }}>Memuat...</div>;

  const maxChart = Math.max(...stats.chart.map((c) => c.count), 1);
  const filtered = stats.guestStats
    .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    .filter((g) => filter === "all" || (filter === "opened" ? g.opened : !g.opened));
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div>
      {/* Date range filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {RANGES.map((r) => (
          <button key={r.days} onClick={() => { setRangeDays(r.days); setPage(0); }}
            style={{ padding: "5px 12px", border: "1px solid var(--inv-border)", borderRadius: 6, cursor: "pointer", fontSize: 12, background: rangeDays === r.days ? "var(--inv-accent)" : "transparent", color: rangeDays === r.days ? "var(--btn-color)" : "var(--inv-base)", fontWeight: rangeDays === r.days ? 700 : 400 }}>
            {r.label}
          </button>
        ))}
        <button onClick={() => { setRangeDays(0); setPage(0); }}
          style={{ padding: "5px 12px", border: "1px solid var(--inv-border)", borderRadius: 6, cursor: "pointer", fontSize: 12, background: rangeDays === 0 ? "var(--inv-accent)" : "transparent", color: rangeDays === 0 ? "var(--btn-color)" : "var(--inv-base)", fontWeight: rangeDays === 0 ? 700 : 400 }}>
          Semua Waktu
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Total Tamu", value: stats.totalGuests },
          { label: "Kunjungan", value: stats.totalVisits },
          { label: "Pageview", value: stats.totalPageviews },
          { label: "Pengunjung Unik", value: stats.uniqueVisitors },
          { label: "Sudah Buka", value: stats.openedCount },
          { label: "Belum Buka", value: stats.notOpenedCount },
        ].map(({ label, value }) => (
          <div key={label} style={{ flex: "1 0 100px", padding: 10, borderRadius: 8, border: "1px solid var(--inv-border)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>{value}</div>
            <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Chart — SVG line graph */}
      {stats.chart.length > 1 && (
        <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Grafik Kunjungan {rangeDays > 0 ? `(${rangeDays} hari terakhir)` : "(semua waktu)"}
          </div>
          <div style={{ position: "relative", width: "100%", height: 120 }}>
            <svg viewBox={`0 0 ${stats.chart.length * 30} 120`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: 120 }}>
              <defs>
                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--inv-accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--inv-accent)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {(() => {
                const w = 30, h = 100;
                const pts = stats.chart.map((d, i) => ({ x: i * w + w / 2, y: h - (d.count / maxChart) * 90 }));
                const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                const area = `M${pts[0].x},100 ${pts.map((p) => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length - 1].x},100 Z`;
                return <>
                  <path d={area} fill="url(#lineFill)" />
                  <path d={line} fill="none" stroke="var(--inv-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--inv-accent)" stroke="#fff" strokeWidth="1.5">
                      <title>{stats.chart[i].label}: {stats.chart[i].count} kunjungan</title>
                    </circle>
                  ))}
                </>;
              })()}
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, opacity: 0.4, marginTop: 2 }}>
            <span>{stats.chart[0]?.label}</span>
            <span>{stats.chart[stats.chart.length - 1]?.label}</span>
          </div>
        </div>
      )}

      {/* Top paths */}
      {stats.topPaths.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Halaman Terpopuler</div>
          {stats.topPaths.map((p) => (
            <div key={p.path} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <span style={{ opacity: 0.7 }}>{p.path}</span><span style={{ fontWeight: 600 }}>{p.count}x</span>
            </div>
          ))}
        </div>
      )}

      {/* Guest table */}
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <input style={{ ...s.input, flex: 1 }} placeholder="Cari tamu..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button style={s.btn(filter === "all" ? "var(--inv-accent)" : "var(--inv-base)")} onClick={() => setFilter("all")}>Semua</button>
        <button style={s.btn(filter === "opened" ? "var(--inv-accent)" : "var(--inv-base)")} onClick={() => setFilter("opened")}>Sudah</button>
        <button style={s.btn(filter === "not" ? "var(--inv-accent)" : "var(--inv-base)")} onClick={() => setFilter("not")}>Belum</button>
      </div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}><table style={s.table}>
        <thead><tr><th style={s.th}>Nama</th><th style={s.th}>Link</th><th style={s.th}>Dibuka</th><th style={s.th}>Kunjungan</th><th style={s.th}>Terakhir</th><th style={s.th}>WA</th></tr></thead>
        <tbody>
          {paged.map((g) => (
            <tr key={g.id}>
              <td style={s.td}>{g.title} {g.name}</td>
              <td style={s.td}><code style={{ fontSize: 11 }}>{g.slug}</code></td>
              <td style={s.td}>{g.opened ? "✅" : "❌"}</td>
              <td style={s.td}>{g.visitCount}x</td>
              <td style={s.td}>{g.lastVisit ? new Date(g.lastVisit).toLocaleDateString("id-ID") : "—"}</td>
              <td style={s.td}>{g.waSent ? "✅" : "—"}</td>
            </tr>
          ))}
          {paged.length === 0 && <tr><td style={s.td} colSpan={6}>Tidak ada tamu.</td></tr>}
        </tbody>
      </table></div>
      <Pagination page={page} totalPages={totalPages} rows={rowsPerPage} onPage={setPage} onRows={setRowsPerPage} />
      {/* Recent */}
      <div style={{ marginTop: 16 }}>
        <button style={s.btn("var(--inv-base)")} onClick={() => setShowRecent(!showRecent)}>
          {showRecent ? "Sembunyikan" : "Lihat"} Kunjungan Terbaru ({stats.recent.length})
        </button>
        {showRecent && (
          <div style={{ marginTop: 8, maxHeight: 300, overflowY: "auto", border: "1px solid var(--inv-border)", borderRadius: 8, padding: 8 }}>
            <table style={{ ...s.table, fontSize: 11 }}>
              <thead><tr><th style={s.th}>Waktu</th><th style={s.th}>IP</th><th style={s.th}>Halaman</th><th style={s.th}>UA</th></tr></thead>
              <tbody>
                {stats.recent.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((r) => (
                  <tr key={r.id}>
                    <td style={s.td}>{new Date(r.time).toLocaleString("id-ID")}</td>
                    <td style={s.td}><code>{r.ip}</code></td>
                    <td style={s.td}><code>{r.path}</code></td>
                    <td style={{ ...s.td, fontSize: 10, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.ua}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

type WALog = { id: string; type: string; guestId: string | null; detail: string | null; createdAt: string };

function KirimWATab() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [template, setTemplate] = useState<Template | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewGuest, setPreviewGuest] = useState<Guest | null>(null);
  const [waConnected, setWaConnected] = useState(false);
  const [waConnecting, setWaConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrExpired, setQrExpired] = useState(false);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<WALog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [waPage, setWaPage] = useState(0);
  const [waRows, setWaRows] = useState(10);
  const { show } = useContext(NotifCtx);

  const checkWA = useCallback(async () => {
    try {
      const r = await fetch("/api/wa/status");
      const d = await r.json();
      setWaConnected(d.connected);
      setWaConnecting(d.connecting);
      if (d.qr && !d.connected) setQrCode(d.qr);
      if (d.connected) { setQrCode(null); setQrExpired(false); }
      if (d.qrExpired) setQrExpired(true);
    } catch {}
  }, []);

  useEffect(() => {
    checkWA();
    const id = setInterval(checkWA, 5000);
    return () => clearInterval(id);
  }, [checkWA]);

  useEffect(() => { (async () => { const [gR, tR] = await Promise.all([fetch("/api/guests"), fetch("/api/templates")]); if (gR.ok) setGuests(await gR.json()); if (tR.ok) { const list: Template[] = await tR.json(); const d = list.find((t) => t.name === "undangan") || list[0]; if (d) setTemplate(d); } })(); }, []);

  const fetchLogs = async () => { try { const r = await fetch("/api/wa/logs"); if (r.ok) setLogs(await r.json()); } catch {} };

  const toggle = (id: string) => { const n = new Set(selectedIds); if (n.has(id)) n.delete(id); else n.add(id); setSelectedIds(n); };
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
  const fillMessage = (g: Guest) => template ? template.body.replace(/\{title\}/g, g.title).replace(/\{name\}/g, g.name).replace(/\{slug\}/g, g.slug).replace(/\{BASE_URL\}/g, baseUrl) : "";

  const sendToGuest = async (g: Guest) => {
    const msg = fillMessage(g);
    if (!msg) return false;
    const r = await fetch("/api/wa/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guestId: g.id, message: msg }) });
    return r.ok;
  };

  const sendSelected = async () => {
    const selected = guests.filter((g) => selectedIds.has(g.id) && g.phone);
    if (!selected.length) { show("Pilih tamu dengan nomor WA", "err"); return; }
    setSending(true);
    let ok = 0, fail = 0;
    for (const g of selected) {
      if (await sendToGuest(g)) ok++; else fail++;
    }
    setSending(false);
    fetchLogs();
    show(`${ok} terkirim, ${fail} gagal`);
  };

  const waTotalPages = Math.max(1, Math.ceil(guests.filter((g) => g.phone).length / waRows));
  const waPaged = guests.filter((g) => g.phone).slice(waPage * waRows, (waPage + 1) * waRows);
  const waNoPhone = guests.filter((g) => !g.phone);

  const statusColor = waConnected ? "#28a745" : waConnecting ? "#ffc107" : "#dc3545";
  const statusText = waConnected ? "Terhubung" : waConnecting ? "Menghubungkan..." : "Terputus";

  const pagBtn = (disabled: boolean, onClick: () => void, label: string, active?: boolean) => (
    <button disabled={disabled} onClick={onClick}
      style={{ padding: "3px 8px", border: "1px solid var(--inv-border)", borderRadius: 4, background: active ? "var(--inv-accent)" : "var(--inv-bg)", color: disabled ? "var(--inv-border)" : active ? "var(--btn-color)" : "var(--inv-base)", cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: active ? 700 : 400 }}>{label}</button>
  );

  const wrapTable = (content: any) => <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>{content}</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: statusColor, display: "inline-block" }} />
          <span style={{ fontSize: 13 }}>WhatsApp: <strong>{statusText}</strong></span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {!waConnected && !waConnecting && <button style={s.btn("var(--inv-accent)")} onClick={() => { fetch("/api/wa/connect", { method: "POST" }); show("Menghubungkan..."); }}>Hubungkan</button>}
          {waConnecting && <button style={s.btn("#ffc107")} onClick={() => { fetch("/api/wa/disconnect", { method: "POST", body: "{}", headers: { "Content-Type": "application/json" } }); show("Dibatalkan"); }}>Batal</button>}
          {waConnected && <button style={s.btn("#dc3545")} onClick={async () => { await fetch("/api/wa/disconnect", { method: "POST", body: JSON.stringify({ deleteSession: false }), headers: { "Content-Type": "application/json" } }); show("Terputus"); }}>Putuskan</button>}
          <button style={s.btn("#b33")} onClick={async () => { await fetch("/api/wa/disconnect", { method: "POST", body: JSON.stringify({ deleteSession: true }), headers: { "Content-Type": "application/json" } }); show("Sesi dihapus"); }}>Hapus Sesi</button>
          <button style={s.btn("var(--inv-base)")} onClick={() => { setShowLogs(!showLogs); if (!showLogs) fetchLogs(); }}>{showLogs ? "Tutup Log" : "Log"}</button>
        </div>
      </div>

      {!waConnected && qrCode && !qrExpired && (
        <div style={{ textAlign: "center", padding: "16px 0", borderBottom: "1px solid var(--inv-border)", marginBottom: 16 }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrCode)}`} alt="QR" style={{ width: 220, height: 220, borderRadius: 8 }} />
          <div style={{ fontSize: 12, marginTop: 10, color: "var(--inv-base)", opacity: 0.7 }}>
            Scan dengan WhatsApp {"=>"} Titik Tiga {"=>"} Perangkat Tertaut
          </div>
        </div>
      )}
      {!waConnected && qrExpired && (
        <div style={{ textAlign: "center", padding: "16px 0", borderBottom: "1px solid var(--inv-border)", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#c00", marginBottom: 8 }}>QR code kadaluarsa. Klik Hubungkan lagi.</div>
          <button style={s.btn("var(--inv-accent)")} onClick={() => { fetch("/api/wa/connect", { method: "POST" }); show("Menghubungkan..."); setQrExpired(false); }}>Hubungkan Ulang</button>
        </div>
      )}

      {showLogs && (
        <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)", maxHeight: 200, overflowY: "auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Log Pesan</div>
          {logs.length === 0 && <div style={{ fontSize: 12, opacity: 0.6 }}>Belum ada log.</div>}
          {logs.map((l) => (
            <div key={l.id} style={{ fontSize: 11, marginBottom: 4, lineHeight: 1.4 }}>
              <span style={{ opacity: 0.5 }}>{new Date(l.createdAt).toLocaleString("id-ID")}</span>
              {" "}{l.type === "sent_wa" ? "✅" : "📋"}{" "}
              <span style={{ color: l.detail?.includes("gagal") || l.detail?.includes("error") ? "#c00" : "inherit" }}>
                {l.detail || l.type}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
        <button style={s.btn()} onClick={sendSelected} disabled={sending}>
          {sending ? "Mengirim..." : `Kirim ke ${selectedIds.size} tamu`}
        </button>
      </div>
      {wrapTable(
        <table style={s.table}>
          <thead><tr>
            <th style={{ ...s.th, width: 32 }}><input type="checkbox" style={s.checkbox} onChange={(e) => { if (e.target.checked) setSelectedIds(new Set(guests.map((g) => g.id))); else setSelectedIds(new Set()); }} checked={selectedIds.size === guests.length && guests.length > 0} /></th>
            <th style={s.th}>Nama</th><th style={s.th}>Phone</th><th style={s.th}>Preview</th><th style={s.th}>Kirim</th>
          </tr></thead>
          <tbody>
            {[...waPaged, ...waNoPhone].map((g) => (
              <tr key={g.id}>
                <td style={s.td}><input type="checkbox" style={s.checkbox} checked={selectedIds.has(g.id)} onChange={() => toggle(g.id)} /></td>
                <td style={s.td}>{g.name}</td><td style={s.td}>{g.phone ?? "—"}</td>
                <td style={s.td}><button style={s.btn()} onClick={() => setPreviewGuest(previewGuest?.id === g.id ? null : g)}>{previewGuest?.id === g.id ? "Tutup" : "Preview"}</button></td>
                <td style={s.td}>{g.phone ? <button style={s.btn("var(--inv-accent)")} onClick={async () => { if (await sendToGuest(g)) { show("Terkirim"); fetchLogs(); } else show("Gagal", "err"); }}>Kirim</button> : "—"}</td>
              </tr>
            ))}
            {guests.length === 0 && <tr><td style={s.td} colSpan={5}>Belum ada tamu.</td></tr>}
          </tbody>
        </table>
      )}
      {previewGuest && <div style={s.previewBox}><strong>Preview untuk {previewGuest.name}:</strong><br />{fillMessage(previewGuest)}</div>}
      <Pagination page={waPage} totalPages={waTotalPages} rows={waRows} onPage={setWaPage} onRows={setWaRows} />
    </div>
  );
}
