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
          <div style={{ textAlign: "center", fontSize: 10, marginTop: 20, color: "#000", fontWeight: 700 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <span>Dibuat oleh</span>
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/github/dark.svg" alt="GitHub" style={{ height: 12, margin: "0 2px" }} />
              <span>tegararrahman</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 3, alignItems: "center" }}>
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nextdotjs/wordmark.svg" alt="Next.js" style={{ height: 10, opacity: 0.6 }} />
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/go/default.svg" alt="Go" style={{ height: 12, opacity: 0.6 }} />
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/postgresql/default.svg" alt="PostgreSQL" style={{ height: 12, opacity: 0.6 }} />
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/redis/default.svg" alt="Redis" style={{ height: 12, opacity: 0.6 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
