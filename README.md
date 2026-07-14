# 💍 WEP-NIKAH

Undangan pernikahan digital dengan fitur lengkap: link unik per tamu, guestbook, dashboard admin, WhatsApp Baileys, statistik kunjungan, dan proteksi captcha.

🌐 **Demo:** [https://nikah.tegar-src.xyz](https://nikah.tegar-src.xyz)

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 🎬 Video intro + slide undangan | Fullscreen video, auto-slide |
| 🔗 Link unik per tamu | `/undangan/{slug}` — proteksi akses |
| 💬 Guestbook + Captcha | Ucapan & konfirmasi kehadiran |
| 📊 Dashboard admin | CRUD tamu, template, statistik |
| 📈 Statistik kunjungan | Chart, IP, pageview, filter tanggal |
| 📱 WhatsApp Baileys | QR scan, kirim pesan per tamu / blast |
| 🛡️ Turnstile Captcha | Proteksi form komentar & login |
| ☁️ R2 Object Storage | Asset gambar/video via CDN |
| 🔍 SEO dinamis | Sitemap, metadata per halaman |

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| **Next.js 16** — App Router | Framework utama |
| **TypeScript** | Type safety |
| **PostgreSQL** + **Prisma** | Database & ORM |
| **Cloudflare R2** | Asset storage (S3-compatible) |
| **Cloudflare Turnstile** | Captcha |
| **Baileys** | WhatsApp Web API |
| **Vercel Analytics** | Visitor tracking |

## 🚀 Cara Install & Jalankan

```bash
# 1. Clone
git clone https://github.com/TEGAR-SRC/WEP-NIKAH.git
cd WEP-NIKAH

# 2. Install
npm install

# 3. Copy env
cp .env.public .env
# lalu isi DATABASE_URL, R2 keys, dll

# 4. Setup database
npx prisma db push
npx tsx prisma/seed.ts

# 5. Generate Prisma client
npx prisma generate

# 6. Jalankan dev
npm run dev
```
s
## 🔐 Environment Variables

Buka `.env.public` untuk template lengkap, lalu isi di `.env`:

| Variable | Wajib | Untuk |
|----------|-------|-------|
| `DATABASE_URL` | ✅ | PostgreSQL / SQLite |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Domain publik |
| `R2_ENDPOINT` | ✅ | S3 endpoint |
| `R2_ACCESS_KEY_ID` | ✅ | S3 access key |
| `R2_SECRET_ACCESS_KEY` | ✅ | S3 secret key |
| `R2_BUCKET` | ✅ | Bucket name |
| `R2_PREFIX` | ✅ | Prefix path |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | ✅ | Turnstile secret key |

## 📂 Struktur Folder

```
src/
├── app/
│   ├── api/          # API routes (auth, guests, comments, wa, stats, r2)
│   ├── dashboard/    # Admin dashboard (login + tabs)
│   ├── undangan/     # Undangan per slug
│   └── layout.tsx    # Root layout + fonts + analytics
├── components/       # React components (slides, guestbook, skeleton)
└── lib/              # Prisma client, WA service, guest context
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Seed data (10 tamu, 20 ucapan, 10 template)
```

## 🌐 Deployment

### Vercel (rekomendasi)
```bash
npm run build    # prisma generate + next build
```
Set env vars di Vercel Dashboard → Settings → Environment Variables.

### Cloudflare Workers
```bash
npm run build:cf    # opennextjs-cloudflare build
npm run deploy:cf   # wrangler deploy
```
Set env vars di Cloudflare Dashboard → Workers & Pages → Settings → Variables.

> **Catatan:** Fitur WhatsApp Baileys membutuhkan Node.js persistent — tidak jalan di Cloudflare Workers. Gunakan VPS/Vercel untuk fitur WA.

## 📊 Akun Default (Dashboard)

| Email | Password |
|-------|----------|
| admin@nikah.com | admin123 |

## 📄 Lisensi

Open source — bebas digunakan untuk pembelajaran dan pengembangan.

---

**Dikembangkan oleh [tegararrahman](https://github.com/TEGAR-SRC)**
Dibangun dengan Next.js · Go · Redis · TypeScript · Tailwind CSS
