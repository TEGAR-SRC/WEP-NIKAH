import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "argon2";

const url = process.env.DATABASE_URL ?? "postgresql://xxken:xxkenxyz@104.250.122.51:35432/nikah";
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const guests = [
  { name: "Vebriza Juinda Putri Zahara", slug: "vebriza", phone: "6281234567890", title: "Ibu" },
  { name: "Joko Prayitno", slug: "joko-prayitno", phone: "6281234567891", title: "Bapak" },
  { name: "Sri Harwanti", slug: "sri-harwanti", phone: "6281234567892", title: "Ibu" },
  { name: "Sarmadan", slug: "sarmadan", phone: "6281234567893", title: "Bapak" },
  { name: "Nurhayati", slug: "nurhayati", phone: "6281234567894", title: "Ibu" },
  { name: "Fajar Nugraha", slug: "fajar-nugraha", phone: "6281234567895", title: "Bapak" },
  { name: "Dewi Sartika", slug: "dewi-sartika", phone: "6281234567896", title: "Ibu" },
  { name: "Rudi Hartono", slug: "rudi-hartono", phone: "6281234567897", title: "Bapak" },
  { name: "Siti Rahmawati", slug: "siti-rahmawati", phone: "6281234567898", title: "Ibu" },
  { name: "Ahmad Syauqi", slug: "ahmad-syauqi", phone: "6281234567899", title: "Bapak" },
];

const comments = [
  { message: "Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah!", confirm: "hadir", guestIdx: 2 },
  { message: "Barakallah! Semoga menjadi keluarga yang bahagia dunia akhirat.", confirm: "hadir", guestIdx: 3 },
  { message: "Semoga langgeng sampai tua, amin!", confirm: "hadir", guestIdx: 4 },
  { message: "Wah, akhirnya nikah juga! Selamat ya!", confirm: "hadir", guestIdx: 5 },
  { message: "Doa terbaik untuk kalian berdua. Semoga jadi keluarga sakinah.", confirm: "hadir", guestIdx: 6 },
  { message: "Mohon maaf tidak bisa hadir, tapi doa selalu menyertai.", confirm: "tidak hadir", guestIdx: 7 },
  { message: "Selamat berbahagia! Semoga berkah selalu.", confirm: "hadir", guestIdx: 8 },
  { message: "Amin ya Rabbal alamin. Barakallah untuk Tegar & Vebiza!", confirm: "hadir", guestIdx: 0 },
  { message: "Semoga menjadi keluarga yang penuh cinta dan kasih sayang.", confirm: "ragu", guestIdx: 9 },
  { message: "Selamat dan sukses untuk acaranya! Kami turut berbahagia.", confirm: "hadir", guestIdx: 1 },
  { message: "Barakallahulakuma! Semoga menjadi keluarga yang diridhoi Allah.", confirm: "hadir", guestIdx: 2 },
  { message: "Doa terbaik dari kami untuk kedua mempelai.", confirm: "hadir", guestIdx: 3 },
  { message: "Semoga langgeng dan bahagia selalu!", confirm: "hadir", guestIdx: 5 },
  { message: "Alhamdulillah, turut berbahagia. Semoga jadi keluarga sakinah.", confirm: "hadir", guestIdx: 6 },
  { message: "Barakallah! Selamat menempuh hidup baru.", confirm: "hadir", guestIdx: 8 },
  { message: "Semoga menjadi keluarga yang samawa! Aamiin.", confirm: "hadir", guestIdx: 4 },
  { message: "Turut berbahagia untuk Tegar & Vebiza. Semoga langgeng!", confirm: "hadir", guestIdx: 7 },
  { message: "Semoga Allah memberkahi pernikahan kalian.", confirm: "ragu", guestIdx: 9 },
  { message: "Selamat ya! Doa terbaik dari kami di Bandung.", confirm: "tidak hadir", guestIdx: 0 },
  { message: "Barakallah! Semoga menjadi keluarga yang bahagia dan penuh berkah.", confirm: "hadir", guestIdx: 1 },
];

const templates = [
  {
    name: "undangan (formal)",
    subject: "Undangan Pernikahan Tegar & Vebiza",
    body: `Yth. {title} {name}

Assalamualaikum Warahmatullahi Wabarakatuh

Dengan memohon Rahmat dan Ridho Allah SWT, melalui pesan ini kami mengundang {title} {name} untuk menghadiri acara pernikahan kami:

Tegar Arrahman & Vebiza Juinda Putri Zahara

Berikut link undangan kami:
{BASE_URL}/undangan/{slug}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila {title} {name} berkenan untuk hadir dan memberikan doa restu.

Terima kasih banyak atas perhatiannya.
Wassalamualaikum Warahmatullahi Wabarakatuh

Hormat kami,
Tegar & Vebiza`,
  },
  {
    name: "undangan (singkat)",
    subject: "Undangan Nikah Tegar & Vebiza",
    body: `Assalamualaikum {title} {name}

Kami mengundang {title} {name} untuk hadir di acara pernikahan kami:

Tegar Arrahman ♥ Vebiza Juinda Putri Zahara

🗓 20 Juli 2026
📍 KUA Batu Aji, Batam

Link undangan: {BASE_URL}/undangan/{slug}

Mohon doa & restunya 🙏

Terima kasih
Wassalamualaikum

Tegar & Vebiza`,
  },
  {
    name: "undangan (santai)",
    subject: "Gaiss.. Tegar & Vebiza nikah!",
    body: `Halo {title} {name}!

Kabar bahagia 🎉
Kami akan melangsungkan pernikahan dan sangat senang jika {title} {name} bisa hadir!

Tegar Arrahman 💍 Vebiza Juinda Putri Zahara

📅 20 Juli 2026
📍 KUA Batu Aji, Batam

Yuk klik link ini buat liat detailnya:
{BASE_URL}/undangan/{slug}

Jangan lupa konfirmasi kehadiran ya! 😊

Makasih banyak!
Tegar & Vebiza`,
  },
  {
    name: "undangan (resmi singkat)",
    subject: "Undangan Resmi Tegar & Vebiza",
    body: `Kepada {title} {name}

Assalamualaikum

Dengan ini kami mengundang {title} {name} pada acara pernikahan:

Tunangan : Tegar Arrahman & Vebiza Juinda Putri Zahara
Waktu : 20 Juli 2026

Link undangan: {BASE_URL}/undangan/{slug}

Kehadiran {title} {name} sangat berarti bagi kami.

Wassalamualaikum

Hormat kami,
Tegar & Vebiza`,
  },
  {
    name: "undangan (dengan doa)",
    subject: "Doa & Undangan Tegar & Vebiza",
    body: `Yth. {title} {name}

Assalamualaikum

"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang." (QS Ar-Rum: 21)

Dengan izin Allah, kami akan menikah:

Tegar Arrahman & Vebiza Juinda Putri Zahara
20 Juli 2026

Link: {BASE_URL}/undangan/{slug}

Mohon doa restunya.

Wassalamualaikum

Tegar & Vebiza`,
  },
  {
    name: "undangan (simple)",
    subject: "Wedding Invitation",
    body: `Hi {title} {name} 🤝

Tegar & Vebiza getting married!

20 July 2026
KUA Batu Aji, Batam

Full invitation: {BASE_URL}/undangan/{slug}

Please come and give us your blessing ❤️

Best regards,
Tegar & Vebiza`,
  },
  {
    name: "undangan (WA singkat)",
    subject: "Nikah!",
    body: `Assalamualaikum {title} {name}

Besok kita nikah! 🎉

Tegar ♥ Vebiza
20 Juli 2026

Link undangan: {BASE_URL}/undangan/{slug}

Doain lancar ya 🙏

Tegar & Vebiza`,
  },
  {
    name: "undangan (lengkap)",
    subject: "Undangan Tegar & Vebiza — Lengkap",
    body: `Yth. {title} {name} di tempat

Assalamualaikum Warahmatullahi Wabarakatuh

Segala puji bagi Allah SWT yang telah mempertemukan kami dalam ikatan suci pernikahan. Dengan ini kami bermaksud mengundang {title} {name} untuk berkenan hadir memberi doa restu pada acara pernikahan kami:

━━━━━━━━━━━━━━━━
TEGAR ARRAHMAN
&
VEBIZA JUINDA PUTRI ZAHARA
━━━━━━━━━━━━━━━━

📅 Hari & Tanggal: Senin, 20 Juli 2026
⏰ Pukul: 10.00 WIB (Akad) / 11.00 WIB (Syukuran)
📍 Lokasi: KUA Batu Aji & Kediaman, Batam

Silakan buka link undangan lengkap:
{BASE_URL}/undangan/{slug}

Merupakan suatu kebahagiaan bagi kami apabila {title} {name} berkenan hadir. Atas perhatiannya, kami ucapkan terima kasih.

Wassalamualaikum Warahmatullahi Wabarakatuh

Hormat kami,
Tegar Arrahman & Vebiza Juinda Putri Zahara`,
  },
  {
    name: "undangan (undangan khusus)",
    subject: "Undangan Khusus Tegar & Vebiza",
    body: `Khusus untuk: {title} {name}

Assalamualaikum

Kami dengan bangga mengundang {title} {name} secara khusus untuk hadir memberikan doa restu pada hari pernikahan kami.

Tegar & Vebiza
20 Juli 2026 | Batam

Link pribadi: {BASE_URL}/undangan/{slug}

Kami tunggu kehadirannya 🙏

Wassalamualaikum

Tegar & Vebiza`,
  },
  {
    name: "terima kasih (default)",
    subject: "Terima Kasih",
    body: `Terima kasih {title} {name} sudah membuka undangan pernikahan kami 🙏

Tegar Arrahman & Vebiza Juinda Putri Zahara
📍 KUA Batu Aji, Batam
📅 20 Juli 2026

Jangan lupa konfirmasi kehadiran di halaman undangan ya 😊`,
  },
  {
    name: "terima kasih (singkat)",
    subject: "Thanks!",
    body: `Makasih {title} {name} udah buka undangan kami 🙏

Jangan lupa konfirmasi kehadiran ya 😊`,
  },
  {
    name: "terima kasih (resmi)",
    subject: "Terima Kasih",
    body: `Yth. {title} {name}

Terima kasih telah meluangkan waktu untuk membuka undangan pernikahan kami. Kehadiran dan doa restu {title} {name} sangat berarti bagi kami.

Wassalamualaikum Warahmatullahi Wabarakatuh
Tegar Arrahman & Vebiza Juinda Putri Zahara`,
  },
  {
    name: "terima kasih (santai)",
    subject: "Makasih ya!",
    body: `Halo {title} {name}!

Makasih banget udah buka undangan kami ❤️

Tegar ♥ Vebiza
20 Juli 2026 | Batam

Konfirmasi hadir ya, ditunggu! 🎉`,
  },
  {
    name: "undangan (English)",
    subject: "Wedding Invitation — Tegar & Vebiza",
    body: `Dear {title} {name}

With great joy, we invite you to the wedding of:

Tegar Arrahman & Vebiza Juinda Putri Zahara

📅 Monday, July 20, 2026
📍 KUA Batu Aji, Batam

Please view the full invitation:
{BASE_URL}/undangan/{slug}

Your presence and prayers mean the world to us.

Best regards,
Tegar & Vebiza`,
  },
];

async function main() {
  await prisma.admin.upsert({
    where: { email: "admin@nikah.com" },
    update: {},
    create: { email: "admin@nikah.com", password: await hash("admin123", { type: 2 }) },
  });

  await prisma.comment.deleteMany();

  for (const g of guests) {
    await prisma.guest.upsert({
      where: { slug: g.slug },
      update: g,
      create: g,
    });
  }

  for (const c of comments) {
    const g = guests[c.guestIdx];
    const guest = await prisma.guest.findUnique({ where: { slug: g.slug } });
    if (!guest) continue;
    await prisma.comment.create({
      data: { guestId: guest.id, message: c.message, confirm: c.confirm },
    });
  }

  for (const t of templates) {
    await prisma.template.upsert({
      where: { name: t.name },
      update: t,
      create: t,
    });
  }
  console.log(`Seed done: ${guests.length} tamu, ${comments.length} ucapan, ${templates.length} template`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
