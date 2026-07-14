import SlideFrame from "./SlideFrame";

export default function GiftSlide() {
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
          <div className="font-latin color-accent text-center" style={{ fontSize: 28 }}>Kirim Hadiah</div>
          <div style={{ width: 40, height: 2, background: "var(--inv-accent)", margin: "12px auto 16px", opacity: 0.4 }} />
          <div className="text-center" style={{ fontSize: 13, color: "var(--inv-base)", lineHeight: 1.8, padding: "0 8px" }}>
            Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberi hadiah kami sediakan fitur berikut
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button type="button" style={{
              flex: 1, padding: "10px 16px", borderRadius: 50, border: "1px solid var(--inv-accent)",
              background: "transparent", color: "var(--inv-accent)", fontSize: 13, cursor: "pointer", fontFamily: "Marcellus, serif", letterSpacing: 1,
            }}>
              Hadiah
            </button>
            <button type="button" style={{
              flex: 1, padding: "10px 16px", borderRadius: 50, border: "1px solid var(--inv-accent)",
              background: "transparent", color: "var(--inv-accent)", fontSize: 13, cursor: "pointer", fontFamily: "Marcellus, serif", letterSpacing: 1,
            }}>
              Kirim Kado
            </button>
          </div>
          <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: "rgba(174,116,0,0.06)", border: "1px solid rgba(174,116,0,0.1)" }}>
            <div style={{ width: 80, height: 80, margin: "auto", overflow: "hidden", borderRadius: 10 }}>
              <img src="/api/r2/public/images/digitainvite/images/bank-bca.png" alt="BCA" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div className="text-center" style={{ marginTop: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>6275242318</div>
              <div style={{ fontSize: 12, color: "var(--inv-base)", marginTop: 4, letterSpacing: 1 }}>BCA : TEGAR ARRAHMAN</div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: 16, borderRadius: 16, background: "rgba(174,116,0,0.06)", border: "1px solid rgba(174,116,0,0.1)" }}>
            <div style={{ width: 80, height: 80, margin: "auto", overflow: "hidden", borderRadius: 10 }}>
              <img src="/api/r2/public/images/digitainvite/images/SeaBank.svg.webp" alt="SeaBank" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div className="text-center" style={{ marginTop: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>901749695960</div>
              <div style={{ fontSize: 12, color: "var(--inv-base)", marginTop: 4, letterSpacing: 1 }}>SeaBank : VEBRIZA JUINDA PUTRI ZAHARA</div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: 16, borderRadius: 16, background: "rgba(174,116,0,0.06)", border: "1px solid rgba(174,116,0,0.1)" }}>
            <div className="text-center">
              <div style={{ fontSize: 16, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif", marginBottom: 8 }}>Kirim Kado</div>
              <div style={{ fontSize: 12, color: "var(--inv-base)", lineHeight: 1.6 }}>
                Anda dapat mengirim kado ke:<br />Kavling Bukit Melati Blok F2 No 105<br />Sei Pelunggut, Sagulung, Batam
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
