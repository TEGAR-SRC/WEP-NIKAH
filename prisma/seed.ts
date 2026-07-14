import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createHash } from "crypto";

const url = process.env.DATABASE_URL ?? "postgresql://xxken:xxkenxyz@104.250.122.51:35432/nikah";
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const hash = (pw: string) => createHash("sha256").update(pw).digest("hex");

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

const template = {
  name: "undangan",
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
};

async function main() {
  await prisma.admin.upsert({
    where: { email: "admin@nikah.com" },
    update: {},
    create: { email: "admin@nikah.com", password: hash("admin123") },
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

  await prisma.template.upsert({
    where: { name: template.name },
    update: template,
    create: template,
  });
  console.log(`Seed done: ${guests.length} tamu, ${comments.length} ucapan`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
