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
            Dibuat oleh tegararrahman
            <div style={{ fontWeight: 600, marginTop: 2 }}>Next.js · Go · PostgreSQL · Redis</div>
          </div>
        </div>
      </div>
    </div>
  );
}
