import SlideFrame from "./SlideFrame";

export default function ClosingSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%", padding: "20px" }}>
        <div className="animate__animated animate__fadeIn animate__slower" style={{
          width: "100%",
          background: "rgba(228,221,215,0.6)",
          backdropFilter: "blur(4px)",
          borderRadius: 24,
          padding: "28px 20px",
          border: "1px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{ width: 40, height: 2, background: "var(--inv-accent)", margin: "0 auto 16px", opacity: 0.4 }} />
          <div className="text-center" style={{ fontSize: 13, color: "var(--inv-base)", lineHeight: 2.2, padding: "0 8px" }}>
            Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do&rsquo;a restu kepada kedua mempelai.
          </div>
          <div className="text-center" style={{ fontSize: 13, color: "var(--inv-base)", opacity: 0.7, letterSpacing: 2, marginTop: 16 }}>
            Hormat Kami Yang Mengundang
          </div>
          <div className="font-latin color-accent text-center" style={{ fontSize: 32, marginTop: 8 }}>Tegar &amp; Vebiza</div>
          <div style={{ textAlign: "center", marginTop: 20, color: "#000" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 700, fontSize: 12 }}>
              <span>Dibuat oleh</span>
              <svg viewBox="0 0 1024 1024" width="14" height="14" fill="#000"><path d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"/></svg>
              <a href="https://github.com/TEGAR-SRC" target="_blank" rel="noopener noreferrer" style={{ color: "#000", textDecoration: "none", fontWeight: 700 }}>tegararrahman</a>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ color: "#000", fontSize: 11, fontWeight: 600 }}>Dibangun dengan</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
