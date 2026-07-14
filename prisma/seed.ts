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
];

const template = {
  name: "undangan",
  subject: "Undangan Pernikahan Tegar & Vebiza",
  body: `Yth. {title} {name}

Assalamualaikum Warahmatullahi Wabarakatuh

Dengan memohon Rahmat dan Ridho Allah SWT, melalui pesan ini kami mengundang {title} {name} untuk menghadiri acara pernikahan kami:

Tegar Arrahman & Vebiza Juinda Putri Zahara

Berikut link undangan kami:
https://nikah.tegar-src.xyz/undangan/{slug}

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

  for (const g of guests) {
    await prisma.guest.upsert({
      where: { slug: g.slug },
      update: g,
      create: g,
    });
  }
  await prisma.template.upsert({
    where: { name: template.name },
    update: template,
    create: template,
  });
  console.log("Seed done");
}

main().catch(console.error).finally(() => prisma.$disconnect());
