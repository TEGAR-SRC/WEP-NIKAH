import SlideFrame from "./SlideFrame";

export default function QuoteSlide() {
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
          <div className="text-center font-latin color-accent" style={{ fontSize: 32 }}>Yang Fana Adalah</div>
          <div className="text-center" style={{ fontSize: 36, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif", letterSpacing: 8, marginTop: 4 }}>WAKTU</div>
          <div style={{ width: 40, height: 2, background: "var(--inv-accent)", margin: "12px auto 16px", opacity: 0.4 }} />
          <div className="text-center">
            <div style={{ fontSize: 14, lineHeight: 2.2, padding: "0 12px", color: "var(--inv-base)" }}>
              Yang fana adalah waktu, Kita abadi:<br />
              memungut detik demi detik, merangkai nya seperti<br />
              bunga sampai pada suatu hari<br />
              kita lupa untuk apa.<br /><br />
              &ldquo;Tapi, yang fana adalah waktu, bukan?&rdquo;<br />
              tanyamu, Kita abadi.
            </div>
            <div style={{ fontSize: 12, color: "var(--inv-base)", opacity: 0.6, marginTop: 12, letterSpacing: 2 }}>SAPARDI DJOKO DAMONO (1978)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
