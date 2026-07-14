"use client";

import { useEffect, useState, createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { TableSkeleton, CardSkeleton } from "@/components/Skeleton";

type Guest = { id: string; name: string; slug: string; phone: string | null; status: string; title: string };
type Comment = { id: string; guestId: string; message: string; confirm: string; createdAt: string; guest: { name: string } };
type Template = { id: string; name: string; subject: string; body: string };
type Tab = "Tamu" | "Ucapan" | "Template" | "Kirim WA" | "Statistik" | "Admin";

const TABS: Tab[] = ["Tamu", "Ucapan", "Template", "Kirim WA", "Statistik", "Admin"];
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
          {tab === "Admin" && <AdminTab />}
        </ConfirmProvider>
      </NotifProvider>
      <footer style={{ marginTop: 40, padding: "24px 0", borderTop: "1px solid var(--inv-border)", textAlign: "center", lineHeight: 1.8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#000", fontWeight: 700, fontSize: 12 }}>
          <span>Dibuat oleh</span>
          <svg viewBox="0 0 1024 1024" width="14" height="14" fill="#000"><path d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"/></svg>
          <a href="https://github.com/TEGAR-SRC" target="_blank" rel="noopener noreferrer" style={{ color: "#000", textDecoration: "none", fontWeight: 700 }}>tegararrahman</a>
        </div>
        <div style={{ marginTop: 12, color: "#000", fontWeight: 600, fontSize: 11 }}>Dibangun dengan</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
          <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nextdotjs/wordmark-light.svg" alt="Next.js" style={{ height: 16, opacity: 0.7 }} />
          <span style={{ color: "#000", fontSize: 7, opacity: 0.3 }}>●</span>
          <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/go/light.svg" alt="Go" style={{ height: 18, opacity: 0.7 }} />
          <span style={{ color: "#000", fontSize: 7, opacity: 0.3 }}>●</span>
          <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/redis/default.svg" alt="Redis" style={{ height: 18, opacity: 0.7 }} />
          <span style={{ color: "#000", fontSize: 7, opacity: 0.3 }}>●</span>
          <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/typescript/default.svg" alt="TypeScript" style={{ height: 18, opacity: 0.7 }} />
          <span style={{ color: "#000", fontSize: 7, opacity: 0.3 }}>●</span>
          <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/tailwindcss/default.svg" alt="Tailwind" style={{ height: 16, opacity: 0.7 }} />
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { show } = useContext(NotifCtx);
  const { ask } = useContext(ConfirmCtx);

  const fetchComments = async () => { setLoading(true); const r = await fetch("/api/comments?limit=100"); if (r.ok) { const d = await r.json(); setComments(d.comments ?? d); } setLoading(false); };
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

  if (loading) return <TableSkeleton />;
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
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Template | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { show } = useContext(NotifCtx);

  const fetchTemplates = async () => {
    setLoading(true);
    const r = await fetch("/api/templates"); if (!r.ok) return;
    const list: Template[] = await r.json(); setTemplates(list);
    const def = list.find((t) => t.name === "undangan") || list[0];
    if (def) { setSelected(def); setSubject(def.subject); setBody(def.body); }
    setLoading(false);
  };
  useEffect(() => { fetchTemplates(); }, []);

  const save = async () => {
    if (!selected) return;
    const r = await fetch(`/api/templates/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, body }) });
    if (r.ok) { const u = await r.json(); setSelected(u); setSubject(u.subject); setBody(u.body); fetchTemplates(); show("Tersimpan"); }
  };

  if (loading) return <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}><TableSkeleton cols={2} rows={3} /></div>;
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

  if (!stats) return <><CardSkeleton /><TableSkeleton /></>;
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

type AdminUser = { id: string; email: string; createdAt: string };

const WA_INSTANCE = "nikah";
const EVO_BASE = process.env.NEXT_PUBLIC_EVOLUTION_API_URL || "/api/wa";
const EVO_KEY = process.env.NEXT_PUBLIC_EVOLUTION_API_KEY || "";

function AdminTab() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [waStatus, setWaStatus] = useState<any>(null);
  const [waQr, setWaQr] = useState<string | null>(null);
  const [waChecking, setWaChecking] = useState(false);
  const { show } = useContext(NotifCtx);
  const { ask } = useContext(ConfirmCtx);

  const fetchAdmins = async () => {
    setLoading(true);
    const r = await fetch("/api/admin");
    if (r.ok) setAdmins(await r.json());
    setLoading(false);
  };
  useEffect(() => { fetchAdmins(); }, []);

  const checkWA = async () => {
    setWaChecking(true);
    try {
      const r = await fetch("/api/wa/status");
      const d = await r.json();
      setWaStatus(d);
      if (d.qr) setWaQr(d.qr);
      if (d.connected) setWaQr(null);
    } catch {}
    setWaChecking(false);
  };
  useEffect(() => { checkWA(); const id = setInterval(checkWA, 5000); return () => clearInterval(id); }, []);

  const addAdmin = async () => {
    if (!email.trim() || !password.trim()) { show("Isi email dan password", "err"); return; }
    const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), password }) });
    if (r.ok) { setEmail(""); setPassword(""); fetchAdmins(); show("Admin ditambahkan"); }
    else { const e = await r.json(); show(e.error || "Gagal", "err"); }
  };

  const updateAdmin = async (id: string) => {
    if (!editEmail.trim() && !editPassword.trim()) { show("Isi email atau password baru", "err"); return; }
    const body: Record<string, string> = {};
    if (editEmail.trim()) body.email = editEmail.trim();
    if (editPassword.trim()) body.password = editPassword;
    const r = await fetch(`/api/admin/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) { setEditId(null); setEditEmail(""); setEditPassword(""); fetchAdmins(); show("Admin diupdate"); }
    else { const e = await r.json(); show(e.error || "Gagal", "err"); }
  };

  const deleteAdmin = async (id: string) => {
    if (!(await ask("Hapus admin ini?"))) return;
    await fetch(`/api/admin/${id}`, { method: "DELETE" });
    fetchAdmins(); show("Admin dihapus");
  };

  if (loading) return <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}><TableSkeleton cols={3} rows={3} /></div>;

  return (
    <div>
      <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 0 200px" }}><label style={s.label}>Email</label><input style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@nikah.com" /></div>
          <div style={{ flex: "1 0 150px" }}><label style={s.label}>Password</label><input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 karakter" /></div>
          <div><button style={s.btn()} onClick={addAdmin}>Tambah Admin</button></div>
        </div>
      </div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}><table style={s.table}>
        <thead><tr><th style={s.th}>Email</th><th style={s.th}>Dibuat</th><th style={s.th}>Aksi</th></tr></thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              {editId === a.id ? (
                <>
                  <td style={s.td}><input style={s.input} value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder={a.email} /></td>
                  <td style={s.td}>{new Date(a.createdAt).toLocaleDateString("id-ID")}</td>
                  <td style={s.td}>
                    <button style={s.btn()} onClick={() => updateAdmin(a.id)}>Simpan</button>
                    <button style={s.btn("var(--inv-base)")} onClick={() => { setEditId(null); setEditEmail(""); setEditPassword(""); }}>Batal</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={s.td}>{a.email}</td>
                  <td style={s.td}>{new Date(a.createdAt).toLocaleDateString("id-ID")}</td>
                  <td style={s.td}>
                    <button style={s.btn()} onClick={() => { setEditId(a.id); setEditEmail(a.email); setEditPassword(""); }}>Edit</button>
                    <button style={s.btn("#b33")} onClick={() => deleteAdmin(a.id)}>Hapus</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {admins.length === 0 && <tr><td style={s.td} colSpan={3}>Belum ada admin.</td></tr>}
        </tbody>
      </table></div>

      {/* --- WA API Management --- */}
      <div style={{ marginTop: 24, marginBottom: 16, padding: 16, borderRadius: 8, border: "1px solid var(--inv-border)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>WhatsApp API (Evolution GO)</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13 }}>
          <span>Status:</span>
          <span style={{
            display: "inline-block", width: 10, height: 10, borderRadius: "50%",
            background: waStatus?.connected ? "#28a745" : waStatus?.connecting ? "#ffc107" : "#dc3545",
          }} />
          <strong>{waStatus?.connected ? "Terhubung" : waStatus?.connecting ? "Menghubungkan..." : "Terputus"}</strong>
          {waChecking && <span style={{ fontSize: 11, opacity: 0.5 }}>mengecek...</span>}
        </div>
        <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.7 }}>Instance: <code>{WA_INSTANCE}</code></div>
        {waQr && (
          <div style={{ textAlign: "center", padding: 12, background: "#fff", borderRadius: 8, marginBottom: 12 }}>
            <img src={waQr.startsWith("data:") ? waQr : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(waQr)}`} alt="QR" style={{ width: 200, height: 200 }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button style={s.btn("var(--inv-accent)")} onClick={async () => { await fetch("/api/wa/connect", { method: "POST" }); show("Menghubungkan..."); }}>Hubungkan</button>
          <button style={s.btn("#dc3545")} onClick={async () => { await fetch("/api/wa/disconnect", { method: "POST", body: "{}", headers: { "Content-Type": "application/json" } }); show("Terputus"); }}>Putuskan</button>
          <button style={s.btn("#b33")} onClick={async () => { await fetch("/api/wa/disconnect", { method: "POST", body: JSON.stringify({ deleteSession: true }), headers: { "Content-Type": "application/json" } }); show("Sesi dihapus"); }}>Hapus Sesi</button>
          <button style={s.btn("var(--inv-base)")} onClick={() => { checkWA(); show("Status diperbarui"); }}>Refresh</button>
        </div>
      </div>
    </div>
  );
}

type WALog = { id: string; type: string; guestId: string | null; detail: string | null; createdAt: string };

function KirimWATab() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewGuest, setPreviewGuest] = useState<Guest | null>(null);
  const [instances, setInstances] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<WALog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [waPage, setWaPage] = useState(0);
  const [waRows, setWaRows] = useState(10);
  const [manualPhone, setManualPhone] = useState("");
  const [manualMsg, setManualMsg] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [manualErr, setManualErr] = useState("");
  const { show } = useContext(NotifCtx);

  const connectedInst = instances.find((i: any) => i.connected);
  const waConnected = !!connectedInst;

  const checkWA = useCallback(async () => {
    try { const r = await fetch("/api/wa/status"); const d = await r.json(); setInstances(d.instances || []); } catch {}
  }, []);

  useEffect(() => {
    checkWA();
    const id = setInterval(checkWA, 5000);
    return () => clearInterval(id);
  }, [checkWA]);

  useEffect(() => { (async () => { setLoading(true); const [gR, tR] = await Promise.all([fetch("/api/guests"), fetch("/api/templates")]); if (gR.ok) setGuests(await gR.json()); if (tR.ok) { const list: Template[] = await tR.json(); const d = list.find((t) => t.name === "undangan") || list[0]; if (d) setTemplate(d); } setLoading(false); })(); }, []);

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

  const pagBtn = (disabled: boolean, onClick: () => void, label: string, active?: boolean) => (
    <button disabled={disabled} onClick={onClick}
      style={{ padding: "3px 8px", border: "1px solid var(--inv-border)", borderRadius: 4, background: active ? "var(--inv-accent)" : "var(--inv-bg)", color: disabled ? "var(--inv-border)" : active ? "var(--btn-color)" : "var(--inv-base)", cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: active ? 700 : 400 }}>{label}</button>
  );

  const wrapTable = (content: any) => <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>{content}</div>;

  if (loading) return <CardSkeleton />;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {instances.map((inst: any) => (
            <div key={inst.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, padding: "2px 8px", borderRadius: 4, background: inst.connected ? "rgba(40,167,69,0.1)" : "rgba(220,53,69,0.06)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: inst.connected ? "#28a745" : "#dc3545", display: "inline-block" }} />
              <strong>{inst.name}</strong>
              {inst.connected ? "✅" : "❌"}
            </div>
          ))}
          {instances.length === 0 && <span style={{ fontSize: 12, opacity: 0.5 }}>Tidak ada instance</span>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {waConnected && <button style={s.btn("var(--inv-accent)")} onClick={() => setShowManual(true)}>Kirim Manual</button>}
          {waConnected && <button style={s.btn("#dc3545")} onClick={async () => { await fetch("/api/wa/disconnect", { method: "POST", body: "{}", headers: { "Content-Type": "application/json" } }); show("Terputus"); }}>Putuskan</button>}
          <button style={s.btn("var(--inv-base)")} onClick={() => { setShowLogs(!showLogs); if (!showLogs) fetchLogs(); }}>{showLogs ? "Tutup Log" : "Log"}</button>
        </div>
      </div>

      {/* Manual send popup */}
      {showManual && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", zIndex: 999 }}>
          <div style={{ background: "var(--inv-bg)", borderRadius: 12, padding: 24, maxWidth: 400, width: "90%" }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>Kirim Pesan Manual</div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Nomor WA</label>
              <input style={s.input} value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} placeholder="628xxx" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Pesan</label>
              <textarea style={s.textarea} value={manualMsg} onChange={(e) => setManualMsg(e.target.value)} placeholder="Tulis pesan..." rows={4} />
            </div>
            {manualErr && <div style={{ color: "#c00", fontSize: 12, marginBottom: 8 }}>{manualErr}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={s.btn("var(--inv-base)")} onClick={() => { setShowManual(false); setManualPhone(""); setManualMsg(""); setManualErr(""); }}>Batal</button>
              <button style={s.btn()} onClick={async () => {
                if (!manualPhone.trim() || !manualMsg.trim()) { setManualErr("Isi nomor dan pesan"); return; }
                setManualErr("");
                const r = await fetch("/api/wa/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: manualPhone.trim(), message: manualMsg.trim() }) });
                if (r.ok) { show("Pesan terkirim"); setShowManual(false); setManualPhone(""); setManualMsg(""); fetchLogs(); }
                else { const e = await r.json(); setManualErr(e.error || "Gagal"); }
              }}>Kirim</button>
            </div>
          </div>
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
