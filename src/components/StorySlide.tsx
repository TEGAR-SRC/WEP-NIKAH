import SlideFrame from "./SlideFrame";
import { CoupleIcon } from "./icons";

export default function StorySlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center text-center" style={{ height: "100%", padding: "20px" }}>
        <div className="animate__animated animate__fadeIn animate__slower" style={{
          width: "100%",
          background: "rgba(228,221,215,0.6)",
          backdropFilter: "blur(4px)",
          borderRadius: 24,
          padding: "28px 20px",
          border: "1px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{ width: 160, height: 90, margin: "auto", overflow: "hidden" }}>
            <img src="/api/r2/public/images/satumomen/ilustrasi.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
          </div>
          <div style={{ width: 40, height: 2, background: "var(--inv-accent)", margin: "12px auto 16px", opacity: 0.4 }} />
          <div className="font-latin color-accent" style={{ fontSize: 32, marginBottom: 8 }}>
            Awal Bertemu
          </div>
          <div style={{ fontSize: 14, padding: "0 16px", lineHeight: 2, color: "var(--inv-base)" }}>
            Berawal dari sebuah pertemuan yang tidak terduga,<br />
            hati kami dipertemukan dalam ikatan cinta.<br />
            Setiap hari adalah cerita indah<br />
            yang kami tulis bersama.
          </div>
          <div style={{ marginTop: 24 }}>
            <CoupleIcon />
          </div>
        </div>
      </div>
    </div>
  );
}


