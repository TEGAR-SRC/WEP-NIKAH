import SlideFrame from "./SlideFrame";

export default function VerseSlide() {
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
          <div className="text-center" style={{ fontSize: 22, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>QS. Ar-Rum 21</div>
          <div style={{ width: 40, height: 2, background: "var(--inv-accent)", margin: "12px auto 16px", opacity: 0.4 }} />
          <div className="text-center">
            <div style={{ fontSize: 14, lineHeight: 2.2, padding: "0 12px", color: "var(--inv-base)" }}>
              &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya<br />
              ialah Dia menciptakan pasangan-pasangan<br />
              untukmu dari jenismu sendiri, agar kamu<br />
              cenderung dan merasa tenteram kepadanya,<br />
              dan Dia menjadikan di antaramu rasa kasih dan sayang.<br />
              Sungguh, pada yang demikian itu benar-benar<br />
              terdapat tanda-tanda (kebesaran Allah)<br />
              bagi kaum yang berpikir.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
