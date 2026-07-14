"use client";

import { useEffect, useState, createContext, useContext, ReactNode, useCallback, useRef } from "react";

type Guest = { id: string; name: string; slug: string; phone: string | null; status: string; title: string };
type Comment = { id: string; guestId: string; message: string; confirm: string; createdAt: string; guest: { name: string } };
type Template = { id: string; name: string; subject: string; body: string };
type Tab = "Tamu" | "Ucapan" | "Template" | "Kirim WA" | "Statistik";

const TABS: Tab[] = ["Tamu", "Ucapan", "Template", "Kirim WA", "Statistik"];
const TITLES = ["Bapak", "Ibu", "Bapak/Ibu"];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const s = {
  container: { maxWidth: 800, margin: "0 auto", padding: "24px 16px", background: "var(--inv-bg)", color: "var(--inv-base)", fontFamily: "var(--font-base)", minHeight: "100vh" } as React.CSSProperties,
  h1: { fontSize: 24, marginBottom: 16 },
  tabs: { display: "flex", gap: 4, borderBottom: "2px solid var(--inv-border)", marginBottom: 20 },
  tab: (a: boolean): React.CSSProperties => ({ padding: "8px 18px", cursor: "pointer", border: "none", background: a ? "var(--inv-accent)" : "transparent", color: a ? "var(--btn-color)" : "var(--inv-base)", borderRadius: "8px 8px 0 0", fontWeight: a ? 700 : 400, fontSize: 14 }),
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
    </div>
  );
}

function GuestsTab() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Bapak/Ibu");
  const [phone, setPhone] = useState("");
  const { show } = useContext(NotifCtx);
  const { ask } = useContext(ConfirmCtx);

  const fetchGuests = async () => { const r = await fetch("/api/guests"); if (r.ok) setGuests(await r.json()); };
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

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={s.formRow}>
          <div style={s.formGroup}><label style={s.label}>Nama</label><input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama tamu" /></div>
          <div style={s.formGroup}><label style={s.label}>Title</label><select style={s.select} value={title} onChange={(e) => setTitle(e.target.value)}>{TITLES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div style={s.formGroup}><label style={s.label}>Phone</label><input style={s.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxx" /></div>
          <div><button style={s.btn()} onClick={addGuest}>Tambah</button></div>
        </div>
        <div style={{ fontSize: 11, marginTop: 4, color: "var(--inv-accent)" }}>Slug: {name ? slugify(name) : "(auto dari nama)"}</div>
      </div>
      <table style={s.table}>
        <thead><tr><th style={s.th}>Nama</th><th style={s.th}>Title</th><th style={s.th}>Slug</th><th style={s.th}>Phone</th><th style={s.th}>Status</th><th style={s.th}>Aksi</th></tr></thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td style={s.td}>{g.name}</td><td style={s.td}>{g.title}</td><td style={s.td}><code>{g.slug}</code></td><td style={s.td}>{g.phone ?? "—"}</td><td style={s.td}>{g.status}</td>
              <td style={s.td}>
                <button style={s.btn()} onClick={() => { const base = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin; navigator.clipboard.writeText(`${base}/undangan/${g.slug}`); show("Link tersalin"); }}>Salin Link</button>
                <button style={s.btn("#b33")} onClick={() => deleteGuest(g.slug)}>Hapus</button>
              </td>
            </tr>
          ))}
          {guests.length === 0 && <tr><td style={s.td} colSpan={6}>Belum ada tamu.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const { show } = useContext(NotifCtx);
  const { ask } = useContext(ConfirmCtx);

  const fetchComments = async () => { const r = await fetch("/api/comments"); if (r.ok) setComments(await r.json()); };
  useEffect(() => { fetchComments(); }, []);

  const deleteComment = async (id: string) => {
    if (!(await ask("Hapus ucapan ini?"))) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    fetchComments(); show("Ucapan dihapus");
  };

  const confirmLabel = (c: string) => c === "hadir" ? "Hadir" : c === "tidak hadir" ? "Tidak Hadir" : c === "ragu" ? "Ragu" : "—";

  return (
    <table style={s.table}>
      <thead><tr><th style={s.th}>Nama</th><th style={s.th}>Pesan</th><th style={s.th}>Konfirmasi</th><th style={s.th}>Tanggal</th><th style={s.th}>Aksi</th></tr></thead>
      <tbody>
        {comments.map((c) => (
          <tr key={c.id}>
            <td style={s.td}>{c.guest.name}</td><td style={s.td}>{c.message}</td><td style={s.td}>{confirmLabel(c.confirm)}</td>
            <td style={s.td}>{new Date(c.createdAt).toLocaleDateString("id-ID")}</td>
            <td style={s.td}><button style={s.btn("#b33")} onClick={() => deleteComment(c.id)}>Hapus</button></td>
          </tr>
        ))}
        {comments.length === 0 && <tr><td style={s.td} colSpan={5}>Belum ada ucapan.</td></tr>}
      </tbody>
    </table>
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
type ChartDay = { date: string; count: number; unique: number };
type PathStat = { path: string; count: number };
type RecentVisit = { id: string; type: string; guestId: string | null; ip: string; ua: string; path: string; time: string };
type StatsData = { totalGuests: number; totalVisits: number; totalPageviews: number; uniqueVisitors: number; openedCount: number; notOpenedCount: number; guestStats: GuestStat[]; chart: ChartDay[]; topPaths: PathStat[]; recent: RecentVisit[] };

function StatsTab() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "opened" | "not">("all");
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => { fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {}); }, []);

  if (!stats) return <div style={{ fontSize: 13 }}>Memuat...</div>;

  const maxChart = Math.max(...stats.chart.map((c) => c.count), 1);
  const filtered = stats.guestStats
    .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    .filter((g) => filter === "all" || (filter === "opened" ? g.opened : !g.opened));

  return (
    <div>
      {/* Clickable stat cards */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Total Tamu", value: stats.totalGuests, key: "all" as const },
          { label: "Total Kunjungan", value: stats.totalVisits, key: "all" as const },
          { label: "Total Pageview", value: stats.totalPageviews, key: "all" as const },
          { label: "Pengunjung Unik", value: stats.uniqueVisitors, key: "all" as const },
          { label: "Sudah Buka", value: stats.openedCount, key: "opened" as const },
          { label: "Belum Buka", value: stats.notOpenedCount, key: "not" as const },
        ].map(({ label, value, key }) => (
          <div key={label} onClick={() => key !== "all" && setFilter(key)}
            style={{ flex: "1 0 120px", padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)", textAlign: "center", cursor: key !== "all" ? "pointer" : "default", background: filter === key ? "rgba(174,116,0,0.08)" : "transparent" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>{value}</div>
            <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {stats.chart.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Kunjungan 14 Hari Terakhir</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
            {stats.chart.map((d) => (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div title={`${d.date}: ${d.count} kunjungan, ${d.unique} unik`} style={{ width: "100%", background: "var(--inv-accent)", height: `${(d.count / maxChart) * 70}px`, borderRadius: "4px 4px 0 0", minHeight: 4, opacity: 0.8 }} />
                <div style={{ fontSize: 8, marginTop: 2, opacity: 0.5, transform: "rotate(-45deg)" }}>{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top paths */}
      {stats.topPaths.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid var(--inv-border)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Halaman Terpopuler</div>
          {stats.topPaths.map((p) => (
            <div key={p.path} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <span style={{ opacity: 0.7 }}>{p.path}</span>
              <span style={{ fontWeight: 600 }}>{p.count}x</span>
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
      <table style={s.table}>
        <thead><tr>
          <th style={s.th}>Nama</th><th style={s.th}>Link</th><th style={s.th}>Dibuka</th><th style={s.th}>Kunjungan</th><th style={s.th}>Terakhir</th><th style={s.th}>WA</th>
        </tr></thead>
        <tbody>
          {filtered.map((g) => (
            <tr key={g.id}>
              <td style={s.td}>{g.title} {g.name}</td>
              <td style={s.td}><code style={{ fontSize: 11 }}>{g.slug}</code></td>
              <td style={s.td}>{g.opened ? "✅" : "❌"}</td>
              <td style={s.td}>{g.visitCount}x</td>
              <td style={s.td}>{g.lastVisit ? new Date(g.lastVisit).toLocaleDateString("id-ID") : "—"}</td>
              <td style={s.td}>{g.waSent ? "✅" : "—"}</td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td style={s.td} colSpan={6}>Tidak ada tamu.</td></tr>}
        </tbody>
      </table>

      {/* Recent visits toggle */}
      <div style={{ marginTop: 16 }}>
        <button style={s.btn("var(--inv-base)")} onClick={() => setShowRecent(!showRecent)}>
          {showRecent ? "Sembunyikan" : "Lihat"} Kunjungan Terbaru ({stats.recent.length})
        </button>
        {showRecent && (
          <div style={{ marginTop: 8, maxHeight: 300, overflowY: "auto", border: "1px solid var(--inv-border)", borderRadius: 8, padding: 8 }}>
            <table style={{ ...s.table, fontSize: 11 }}>
              <thead><tr><th style={s.th}>Waktu</th><th style={s.th}>Tipe</th><th style={s.th}>IP</th><th style={s.th}>Halaman</th><th style={s.th}>UA</th></tr></thead>
              <tbody>
                {stats.recent.map((r) => (
                  <tr key={r.id}>
                    <td style={s.td}>{new Date(r.time).toLocaleString("id-ID")}</td>
                    <td style={s.td}>{r.type === "visit" ? "📩" : "👁"}</td>
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

  const statusColor = waConnected ? "#28a745" : waConnecting ? "#ffc107" : "#dc3545";
  const statusText = waConnected ? "Terhubung" : waConnecting ? "Menghubungkan..." : "Terputus";

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

      <table style={s.table}>
        <thead><tr>
          <th style={{ ...s.th, width: 32 }}><input type="checkbox" style={s.checkbox} onChange={(e) => { if (e.target.checked) setSelectedIds(new Set(guests.map((g) => g.id))); else setSelectedIds(new Set()); }} checked={selectedIds.size === guests.length && guests.length > 0} /></th>
          <th style={s.th}>Nama</th><th style={s.th}>Phone</th><th style={s.th}>Preview</th><th style={s.th}>Kirim</th>
        </tr></thead>
        <tbody>
          {guests.map((g) => (
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
      {previewGuest && <div style={s.previewBox}><strong>Preview untuk {previewGuest.name}:</strong><br />{fillMessage(previewGuest)}</div>}
      <div style={{ marginTop: 16 }}>
        <button style={s.btn()} onClick={sendSelected} disabled={sending}>
          {sending ? "Mengirim..." : `Kirim ke ${selectedIds.size} tamu`}
        </button>
      </div>
    </div>
  );
}
