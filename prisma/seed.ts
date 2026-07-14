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
    name: "konfirmasi (default)",
    subject: "Konfirmasi Kehadiran",
    body: `Halo {title} {name}!

Terima kasih sudah mengkonfirmasi kehadiran Anda melalui undangan kami 🙏

📌 Konfirmasi: {confirm}

Kami tunggu kehadirannya di:
📍 KUA Batu Aji, Batam
📅 20 Juli 2026

Salam,
Tegar & Vebiza 💕`,
  },
  {
    name: "konfirmasi (singkat)",
    subject: "Konfirmasi Diterima",
    body: `Hai {title} {name}, konfirmasi kamu udah kami terima ✅

Kehadiran: {confirm}
Tanggal: 20 Juli 2026
Lokasi: KUA Batu Aji, Batam

Makasih banyak! 😊`,
  },
  {
    name: "konfirmasi (resmi)",
    subject: "Konfirmasi Kehadiran",
    body: `Yth. {title} {name}

Terima kasih atas konfirmasi kehadiran Anda.

📋 Status: {confirm}
🗓 20 Juli 2026
📍 KUA Batu Aji, Batam

Kami tunggu kehadirannya.
Wassalamualaikum Wr. Wb.

Hormat kami,
Tegar Arrahman & Vebiza Juinda Putri Zahara`,
  },
  {
    name: "konfirmasi (santai)",
    subject: "Oke sip!",
    body: `Halo {title} {name}!

Noted! Konfirmasi kamu: {confirm} ✅

Catet ya:
📅 20 Juli 2026
📍 KUA Batu Aji, Batam

Makasih udah konfirmasi! 🎉`,
  },
  {
    name: "konfirmasi (WA singkat)",
    subject: "Konfirmasi ✅",
    body: `{title} {name} - {confirm} ✅

Makasih udah konfirmasi! 🙏
20 Juli 2026 | Batam`,
  },
  {
    name: "konfirmasi (lengkap)",
    subject: "Konfirmasi Kehadiran - Tegar & Vebiza",
    body: `Assalamualaikum {title} {name}

Terima kasih telah mengkonfirmasi kehadiran Anda pada acara pernikahan kami.

━━━━━━━━━━━━
KONFIRMASI ANDA
━━━━━━━━━━━━
Status: {confirm}
Atas Nama: {title} {name}

━━━━━━━━━━━━
DETAIL ACARA
━━━━━━━━━━━━
👰🏻🤵🏻 Tegar Arrahman & Vebiza Juinda Putri Zahara
📅 Senin, 20 Juli 2026
⏰ 10.00 WIB (Akad) / 11.00 WIB (Syukuran)
📍 KUA Batu Aji & Kediaman, Batam

Wassalamualaikum Wr. Wb.
Tegar & Vebiza`,
  },
  {
    name: "konfirmasi (ucapan doa)",
    subject: "Doa & Konfirmasi",
    body: `{title} {name}

"Barakallahulakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair"

Semoga Allah memberkahi kita semua. Terima kasih atas konfirmasi dan doa restu Anda.

Konfirmasi: {confirm}
20 Juli 2026 | Batam

Wassalamualaikum
Tegar & Vebiza`,
  },
  {
    name: "konfirmasi (terima kasih)",
    subject: "Terima Kasih!",
    body: `Terima kasih {title} {name} sudah konfirmasi 🙏

Kehadiran Anda sangat berarti bagi kami.
Sampai jumpa di hari bahagia! 🎉

📍 KUA Batu Aji, Batam
📅 20 Juli 2026

Salam,
Tegar & Vebiza`,
  },
  {
    name: "konfirmasi (English)",
    subject: "Confirmation Received",
    body: `Dear {title} {name}

Thank you for confirming your attendance 🙏

📌 Status: {confirm}
📅 July 20, 2026
📍 KUA Batu Aji, Batam

We look forward to seeing you!

Best regards,
Tegar & Vebiza`,
  },
  {
    name: "konfirmasi (undangan khusus)",
    subject: "Konfirmasi Diterima",
    body: `Kepada {title} {name}

Kami telah menerima konfirmasi kehadiran Anda.

Status: {confirm}

Mohon doa restunya untuk kelancaran acara kami.
Terima kasih banyak atas perhatiannya.

Wassalamualaikum
Tegar & Vebiza`,
  },
  // === FOLLOW-UP (reminder konfirmasi) ===
  { name: "follow-up (default)", subject: "Konfirmasi Kehadiran", body: `Yth. {title} {name}

Terima kasih sudah mengirimkan ucapan untuk pernikahan kami.

Kami ingin memastikan kehadiran {title} {name}. Mohon konfirmasi melalui link undangan:

{BASE_URL}/undangan/{slug}

Terima kasih 🙏
Tegar & Vebiza` },
  { name: "follow-up (singkat)", subject: "Konfirmasi?", body: `Halo {title} {name}, makasih udah ngucapin! 😊

Kami masih tunggu konfirmasi kehadiran kamu nih.
Bisa klik link ini ya:
{BASE_URL}/undangan/{slug}

Makasih! 🙏` },
  { name: "follow-up (resmi)", subject: "Reminder Konfirmasi", body: `Kepada {title} {name}

Dengan hormat, kami mengingatkan untuk mengkonfirmasi kehadiran pada acara pernikahan kami.

Silakan buka link undangan untuk konfirmasi:
{BASE_URL}/undangan/{slug}

Atas perhatiannya, terima kasih.
Wassalamualaikum

Tegar & Vebiza` },
  { name: "follow-up (santai)", subject: "Eh, konfirm dong!", body: `Hai {title} {name}!

Makasih ya udah ngirim ucapan buat kami 🎉

Eh, kamu belum konfirmasi nih, datang atau enggak?
Yuk klik link di bawah:
{BASE_URL}/undangan/{slug}

Thanks! 🥳` },
  { name: "follow-up (WA)", subject: "Konfirmasi Yuk!", body: `{title} {name} - Makasih udah ngucap! 🙏

Jangan lupa konfirmasi kehadiran ya:
{BASE_URL}/undangan/{slug}

Kami tunggu! 😊` },
  { name: "follow-up (lengkap)", subject: "Reminder Konfirmasi Kehadiran", body: `Yth. {title} {name}

Terima kasih telah memberikan ucapan & doa restu untuk pernikahan kami.

Saat ini kami belum menerima konfirmasi kehadiran Anda. Mohon meluangkan waktu untuk mengkonfirmasi melalui link berikut:

{BASE_URL}/undangan/{slug}

Terima kasih banyak.
Wassalamualaikum Wr. Wb.

Hormat kami,
Tegar Arrahman & Vebiza Juinda Putri Zahara` },
  { name: "follow-up (doa)", subject: "Doa & Konfirmasi", body: `Assalamualaikum {title} {name}

Terima kasih atas doa restu yang telah diberikan. Kami mohon konfirmasi kehadiran {title} {name} untuk kelancaran acara kami.

Silakan buka:
{BASE_URL}/undangan/{slug}

Wassalamualaikum
Tegar & Vebiza` },
  { name: "follow-up (English)", subject: "Confirmation Reminder", body: `Dear {title} {name}

Thank you for your wishes! We're still waiting for your attendance confirmation.

Please click the link below:
{BASE_URL}/undangan/{slug}

Thank you! 🙏` },
  { name: "follow-up (urgent)", subject: "Konfirmasi Segera!", body: `Kepada {title} {name}

Mohon segera konfirmasi kehadiran Anda karena kami perlu mempersiapkan acara dengan baik.

{BASE_URL}/undangan/{slug}

Terima kasih 🙏` },
  { name: "follow-up (sederhana)", subject: "Konfirmasi", body: `{title} {name}, yuk konfirmasi kehadiran 👉 {BASE_URL}/undangan/{slug}` },

  // === HADIR ===
  { name: "hadir (default)", subject: "Terima Kasih! ❤️", body: `Halo {title} {name}!

Terima kasih sudah konfirmasi HADIR 🎉🎉

Kami tunggu kehadirannya di:
📍 KUA Batu Aji, Batam
📅 20 Juli 2026

Sampai jumpa! 🥳
Tegar & Vebiza` },
  { name: "hadir (resmi)", subject: "Konfirmasi Hadir", body: `Yth. {title} {name}

Terima kasih atas konfirmasi kehadiran Anda. Kami sangat senang Anda dapat hadir.

📋 Status: ✅ HADIR
🗓 20 Juli 2026
📍 KUA Batu Aji, Batam

Sampai bertemu di hari bahagia kami.
Wassalamualaikum

Tegar & Vebiza` },
  { name: "hadir (santai)", subject: "Asik! Datang! 🎉", body: `Wah, {title} {name} datang! 🎉🎉🎉

Makasih banget udah konfirmasi. Kita siapin tempat spesial buat kamu!

📍 KUA Batu Aji, Batam
📅 20 Juli 2026

Sampai ketemu! 🥳` },
  { name: "hadir (singkat)", subject: "✅ Hadir", body: `{title} {name} - HADIR ✅

Makasih! Sampai ketemu di hari H! 🎉` },
  { name: "hadir (lengkap)", subject: "Konfirmasi Hadir - Tegar & Vebiza", body: `Assalamualaikum {title} {name}

Alhamdulillah, kami sangat berbahagia mendengar konfirmasi kehadiran Anda.

━━━━━━━━━━━━
STATUS: ✅ HADIR
━━━━━━━━━━━━

📅 Senin, 20 Juli 2026
⏰ 10.00 WIB
📍 KUA Batu Aji, Batam

Sampai bertemu di hari istimewa kami!
Wassalamualaikum Wr. Wb.

Tegar Arrahman & Vebiza Juinda Putri Zahara` },
  { name: "hadir (ucapan)", subject: "Terima Kasih!", body: `{title} {name} - HADIR ✅

"Barakallahulakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair"

Terima kasih sudah konfirmasi. Doa terbaik untuk kita semua 🤲` },
  { name: "hadir (English)", subject: "✅ Attending", body: `Dear {title} {name}

Thank you for confirming your attendance! 🎉

See you on:
📍 KUA Batu Aji, Batam
📅 July 20, 2026

Best regards,
Tegar & Vebiza` },
  { name: "hadir (WA)", subject: "✅ HADIR", body: `{title} {name} - HADIR ✅
20 Juli 2026 | Batam
Sampai ketemu! 🎉` },
  { name: "hadir (simple)", subject: "Hadir ✅", body: `Terima kasih {title} {name} sudah konfirmasi HADIR ✅

Sampai jumpa! 🎉` },
  { name: "hadir (doa)", subject: "✅ Hadir + Doa", body: `{title} {name} - HADIR ✅

Semoga Allah memberkahi pernikahan kami. Terima kasih doa & kehadirannya! 🤲🙏` },

  // === TIDAK HADIR ===
  { name: "tidak hadir (default)", subject: "Baik, Tidak Hadir", body: `Halo {title} {name}

Baik, kami catat Anda TIDAK HADIR ❤️

Terima kasih banyak atas doa restunya. Doa Anda tetap berarti bagi kami 🙏

{TEGAR_SRC}
Tegar & Vebiza` },
  { name: "tidak hadir (resmi)", subject: "Konfirmasi Tidak Hadir", body: `Yth. {title} {name}

Kami menerima konfirmasi bahwa Anda tidak dapat hadir.

Terima kasih atas doa restu yang telah diberikan. Tanpa mengurangi rasa hormat, kami ucapkan terima kasih.

Wassalamualaikum

Tegar & Vebiza` },
  { name: "tidak hadir (santai)", subject: "Yahh.. 😢", body: `Halo {title} {name}

Yahh.. gak datang 😢 Tapi gapapa, kami ngerti kok!

Makasih ya doanya, tetap berarti banget buat kami! ❤️🙏` },
  { name: "tidak hadir (singkat)", subject: "❌ Tidak Hadir", body: `{title} {name} - TIDAK HADIR ❤️

Makasih doanya 🙏` },
  { name: "tidak hadir (lengkap)", subject: "Konfirmasi Tidak Hadir", body: `Assalamualaikum {title} {name}

Kami menerima konfirmasi bahwa Anda tidak dapat hadir pada acara pernikahan kami.

━━━━━━━━━━━━
STATUS: ❌ TIDAK HADIR
━━━━━━━━━━━━

Terima kasih atas doa restu yang telah diberikan. Doa Anda sangat berarti bagi kami.

Wassalamualaikum Wr. Wb.

Tegar Arrahman & Vebiza Juinda Putri Zahara` },
  { name: "tidak hadir (ucapan)", subject: "Doanya aja ya", body: `{title} {name}

Kami catat Anda TIDAK HADIR. Terima kasih doa & ucapannya, semoga Allah membalas kebaikan Anda 🙏🤲` },
  { name: "tidak hadir (English)", subject: "❌ Not Attending", body: `Dear {title} {name}

We understand you can't attend. Thank you for your prayers and kind wishes! ❤️🙏

Best regards,
Tegar & Vebiza` },
  { name: "tidak hadir (WA)", subject: "❌ TIDAK HADIR", body: `{title} {name} - TIDAK HADIR ❤️
Makasih doanya! 🙏` },
  { name: "tidak hadir (simple)", subject: "Tidak Hadir", body: `Baik {title} {name}, terima kasih konfirmasinya. Doa Anda tetap berarti! 🙏` },
  { name: "tidak hadir (doa)", subject: "Doa & Tidak Hadir", body: `{title} {name} - TIDAK HADIR ❤️

"Barakallahulakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair"

Terima kasih doanya! 🙏🤲` },

  { name: "gift (default)", subject: "Terima Kasih Hadiah", body: `{title} {name}

Terima kasih banyak atas hadiah yang telah diberikan 🙏

Doa restu dan perhatian Anda sangat berarti bagi kami. Semoga Allah membalas kebaikan {title} {name}.

Wassalamualaikum
Tegar & Vebiza 💕` },
  { name: "gift (singkat)", subject: "🙏", body: `Makasih {title} {name} atas hadiahnya! 🙏❤️` },
  { name: "gift (resmi)", subject: "Terima Kasih", body: `Yth. {title} {name}

Kami mengucapkan terima kasih yang sebesar-besarnya atas hadiah yang telah diberikan. 

Semoga Allah SWT membalas kebaikan {title} {name} dengan berlipat ganda.

Wassalamualaikum Wr. Wb.
Tegar Arrahman & Vebiza Juinda Putri Zahara` },
  { name: "gift (santai)", subject: "Makasih! 🎉", body: `Halo {title} {name}!

Makasih banget atas hadiahnya! Kami sangat berterima kasih ❤️🎉

Semoga berkah selalu!
Tegar & Vebiza` },
  { name: "kado (default)", subject: "Terima Kasih Kado", body: `{title} {name}

Terima kasih banyak atas kado yang telah dikirimkan 🙏

Kami sangat bersyukur memiliki {title} {name} yang begitu perhatian. Semoga Allah membalas kebaikan Anda.

Wassalamualaikum
Tegar & Vebiza 💕` },
  { name: "kado (singkat)", subject: "🙏🎁", body: `Makasih {title} {name} atas kado nya! 🙏🎉` },
  { name: "kado (resmi)", subject: "Terima Kasih", body: `Yth. {title} {name}

Kami ucapkan terima kasih atas kado yang telah {title} {name} kirimkan. Perhatian dan doa restu Anda sangat berarti.

Wassalamualaikum
Tegar & Vebiza` },
  { name: "kado (santai)", subject: "Kado nyampe! 🎁", body: `Hai {title} {name}!

Kado nya udah sampe! Makasih banyak ya 😍🎉

Kami tunggu kehadirannya!
Tegar & Vebiza 💕` },

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
