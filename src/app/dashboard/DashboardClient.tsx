"use client";

import { useEffect, useState } from "react";

type Guest = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  status: string;
  title: string;
};

type Comment = {
  id: string;
  guestId: string;
  message: string;
  confirm: string;
  createdAt: string;
  guest: { name: string };
};

type Template = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

type Tab = "Tamu" | "Ucapan" | "Template" | "Kirim WA";

const TABS: Tab[] = ["Tamu", "Ucapan", "Template", "Kirim WA"];

const TITLES = ["Bapak", "Ibu", "Bapak/Ibu"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const s = {
  container: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "24px 16px",
    background: "var(--inv-bg)",
    color: "var(--inv-base)",
    fontFamily: "var(--font-base)",
    minHeight: "100vh",
  } as React.CSSProperties,
  h1: { fontSize: 24, marginBottom: 16 },
  tabs: { display: "flex", gap: 4, borderBottom: "2px solid var(--inv-border)", marginBottom: 20 },
  tab: (active: boolean): React.CSSProperties => ({
    padding: "8px 18px",
    cursor: "pointer",
    border: "none",
    background: active ? "var(--inv-accent)" : "transparent",
    color: active ? "var(--btn-color)" : "var(--inv-base)",
    borderRadius: "8px 8px 0 0",
    fontWeight: active ? 700 : 400,
    fontSize: 14,
  }),
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
  th: { textAlign: "left" as const, padding: "8px 6px", borderBottom: "1px solid var(--inv-border)", fontWeight: 700 },
  td: { padding: "8px 6px", borderBottom: "1px solid var(--inv-border)", verticalAlign: "middle" as const },
  btn: (color = "var(--inv-accent)"): React.CSSProperties => ({
    padding: "5px 12px",
    border: "none",
    borderRadius: 4,
    background: color,
    color: "var(--btn-color)",
    cursor: "pointer",
    fontSize: 12,
    marginRight: 4,
    whiteSpace: "nowrap",
  }),
  input: {
    width: "100%",
    padding: "6px 8px",
    border: "1px solid var(--inv-border)",
    borderRadius: 4,
    background: "var(--inv-bg)",
    color: "var(--inv-base)",
    fontSize: 13,
    boxSizing: "border-box" as const,
  },
  select: {
    width: "100%",
    padding: "6px 8px",
    border: "1px solid var(--inv-border)",
    borderRadius: 4,
    background: "var(--inv-bg)",
    color: "var(--inv-base)",
    fontSize: 13,
  },
  label: { display: "block", fontSize: 12, marginBottom: 2, fontWeight: 600 },
  formRow: { display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" as const },
  formGroup: { flex: "1 0 140px" },
  textarea: {
    width: "100%",
    padding: "6px 8px",
    border: "1px solid var(--inv-border)",
    borderRadius: 4,
    background: "var(--inv-bg)",
    color: "var(--inv-base)",
    fontSize: 13,
    boxSizing: "border-box" as const,
    minHeight: 120,
    resize: "vertical" as const,
    fontFamily: "monospace",
  } as React.CSSProperties,
  hint: { fontSize: 11, color: "var(--inv-accent)", marginTop: 2 },
  previewBox: {
    padding: 12,
    border: "1px solid var(--inv-border)",
    borderRadius: 4,
    marginTop: 8,
    fontSize: 13,
    whiteSpace: "pre-wrap" as const,
    background: "rgba(0,0,0,0.03)",
  },
  checkbox: { marginRight: 6 },
};

export default function DashboardClient() {
  const [tab, setTab] = useState<Tab>("Tamu");

  return (
    <div style={s.container}>
      <h1 style={s.h1}>Dashboard</h1>
      <div style={s.tabs}>
        {TABS.map((t) => (
          <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {tab === "Tamu" && <GuestsTab />}
      {tab === "Ucapan" && <CommentsTab />}
      {tab === "Template" && <TemplateTab />}
      {tab === "Kirim WA" && <KirimWATab />}
    </div>
  );
}

function GuestsTab() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Bapak/Ibu");
  const [phone, setPhone] = useState("");

  const fetchGuests = async () => {
    const res = await fetch("/api/guests");
    if (res.ok) setGuests(await res.json());
  };

  useEffect(() => { fetchGuests(); }, []);

  const addGuest = async () => {
    if (!name.trim()) return;
    const slug = slugify(name);
    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slug, title, phone: phone.trim() || undefined }),
    });
    if (res.ok) {
      setName("");
      setPhone("");
      setTitle("Bapak/Ibu");
      fetchGuests();
    } else {
      const err = await res.json();
      alert(err.error || "Gagal menambah tamu");
    }
  };

  const deleteGuest = async (slug: string) => {
    if (!confirm("Hapus tamu ini?")) return;
    const res = await fetch(`/api/guests/${slug}`, { method: "DELETE" });
    if (res.ok) fetchGuests();
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={s.formRow}>
          <div style={s.formGroup}>
            <label style={s.label}>Nama</label>
            <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama tamu" />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Title</label>
            <select style={s.select} value={title} onChange={(e) => setTitle(e.target.value)}>
              {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Phone (opsional)</label>
            <input style={s.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxx" />
          </div>
          <div>
            <button style={s.btn()} onClick={addGuest}>Tambah</button>
          </div>
        </div>
        <div style={{ fontSize: 11, marginTop: 4, color: "var(--inv-accent)" }}>
          Slug: {name ? slugify(name) : "(auto dari nama)"}
        </div>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Nama</th>
            <th style={s.th}>Title</th>
            <th style={s.th}>Slug</th>
            <th style={s.th}>Phone</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td style={s.td}>{g.name}</td>
              <td style={s.td}>{g.title}</td>
              <td style={s.td}><code>{g.slug}</code></td>
              <td style={s.td}>{g.phone ?? "—"}</td>
              <td style={s.td}>{g.status}</td>
              <td style={s.td}>
                <button style={s.btn()} onClick={() => {
                  navigator.clipboard.writeText(`https://nikah.tegar-src.xyz/undangan/${g.slug}`);
                }}>Salin Link</button>
                <button style={s.btn("#b33")} onClick={() => deleteGuest(g.slug)}>Hapus</button>
              </td>
            </tr>
          ))}
          {guests.length === 0 && (
            <tr><td style={s.td} colSpan={6}>Belum ada tamu.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const res = await fetch("/api/comments");
    if (res.ok) setComments(await res.json());
  };

  useEffect(() => { fetchComments(); }, []);

  const deleteComment = async (id: string) => {
    if (!confirm("Hapus ucapan ini?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) fetchComments();
  };

  const confirmLabel = (c: string) => {
    if (c === "hadir") return "Hadir";
    if (c === "tidak hadir") return "Tidak Hadir";
    if (c === "ragu") return "Ragu";
    return "—";
  };

  return (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={s.th}>Nama</th>
          <th style={s.th}>Pesan</th>
          <th style={s.th}>Konfirmasi</th>
          <th style={s.th}>Tanggal</th>
          <th style={s.th}>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((c) => (
          <tr key={c.id}>
            <td style={s.td}>{c.guest.name}</td>
            <td style={s.td}>{c.message}</td>
            <td style={s.td}>{confirmLabel(c.confirm)}</td>
            <td style={s.td}>{new Date(c.createdAt).toLocaleDateString("id-ID")}</td>
            <td style={s.td}>
              <button style={s.btn("#b33")} onClick={() => deleteComment(c.id)}>Hapus</button>
            </td>
          </tr>
        ))}
        {comments.length === 0 && (
          <tr><td style={s.td} colSpan={5}>Belum ada ucapan.</td></tr>
        )}
      </tbody>
    </table>
  );
}

function TemplateTab() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const fetchTemplates = async () => {
    const res = await fetch("/api/templates");
    if (!res.ok) return;
    const list: Template[] = await res.json();
    setTemplates(list);
    const def = list.find((t) => t.name === "undangan") || list[0];
    if (def) {
      setSelected(def);
      setSubject(def.subject);
      setBody(def.body);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const selectTemplate = (id: string) => {
    const t = templates.find((x) => x.id === id);
    if (t) {
      setSelected(t);
      setSubject(t.subject);
      setBody(t.body);
    }
  };

  const save = async () => {
    if (!selected) return;
    const res = await fetch(`/api/templates/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSelected(updated);
      setSubject(updated.subject);
      setBody(updated.body);
      fetchTemplates();
      alert("Tersimpan");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>Pilih Template</label>
        <select style={{ ...s.select, maxWidth: 300 }} value={selected?.id ?? ""} onChange={(e) => selectTemplate(e.target.value)}>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>Subjek</label>
        <input style={s.input} value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>Body</label>
        <textarea style={s.textarea} value={body} onChange={(e) => setBody(e.target.value)} />
        <div style={s.hint}>Placeholder: {`{title}`}, {`{name}`}, {`{slug}`}</div>
      </div>
      <button style={s.btn()} onClick={save}>Simpan</button>
    </div>
  );
}

function KirimWATab() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [template, setTemplate] = useState<Template | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewGuest, setPreviewGuest] = useState<Guest | null>(null);
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    const [gRes, tRes] = await Promise.all([fetch("/api/guests"), fetch("/api/templates")]);
    if (gRes.ok) setGuests(await gRes.json());
    if (tRes.ok) {
      const list: Template[] = await tRes.json();
      const def = list.find((t) => t.name === "undangan") || list[0];
      if (def) setTemplate(def);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const fillMessage = (g: Guest) => {
    if (!template) return "";
    return template.body.replace(/\{title\}/g, g.title).replace(/\{name\}/g, g.name).replace(/\{slug\}/g, g.slug);
  };

  const send = async () => {
    const selected = guests.filter((g) => selectedIds.has(g.id));
    if (!selected.length) return alert("Pilih minimal satu tamu");
    if (!template) return alert("Template tidak ditemukan");
    setSending(true);
    for (const g of selected) {
      const message = fillMessage(g);
      await fetch("/api/send-wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: g.id, phone: g.phone, message }),
      });
    }
    setSending(false);
    alert(`Tautan WA untuk ${selected.length} tamu telah dibuat. Buka log untuk melihat.`);
  };

  return (
    <div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: 32 }}>
              <input type="checkbox" style={s.checkbox}
                onChange={(e) => {
                  if (e.target.checked) setSelectedIds(new Set(guests.map((g) => g.id)));
                  else setSelectedIds(new Set());
                }}
                checked={selectedIds.size === guests.length && guests.length > 0} />
            </th>
            <th style={s.th}>Nama</th>
            <th style={s.th}>Phone</th>
            <th style={s.th}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td style={s.td}>
                <input type="checkbox" style={s.checkbox} checked={selectedIds.has(g.id)} onChange={() => toggle(g.id)} />
              </td>
              <td style={s.td}>{g.name}</td>
              <td style={s.td}>{g.phone ?? "—"}</td>
              <td style={s.td}>
                <button style={s.btn()} onClick={() => setPreviewGuest(previewGuest?.id === g.id ? null : g)}>
                  {previewGuest?.id === g.id ? "Tutup" : "Preview"}
                </button>
              </td>
            </tr>
          ))}
          {guests.length === 0 && (
            <tr><td style={s.td} colSpan={4}>Belum ada tamu.</td></tr>
          )}
        </tbody>
      </table>
      {previewGuest && (
        <div style={s.previewBox}>
          <strong>Preview untuk {previewGuest.name}:</strong><br />
          {fillMessage(previewGuest)}
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <button style={s.btn()} onClick={send} disabled={sending}>
          {sending ? "Mengirim..." : `Kirim WA ke ${selectedIds.size} tamu`}
        </button>
      </div>
    </div>
  );
}
