import SlideFrame from "./SlideFrame";

export default function VerseSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div className="animate__animated animate__fadeInDown animate__slower">
            <div style={{ width: "158px", height: "89px", margin: "auto", overflow: "hidden", paddingBottom: "20px" }}>
              <img src="/images/satumomen/27897-gallery-1672939613.png" alt="Ornament" style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
            </div>
          </div>
          <div className="text-center animate__animated animate__fadeInDown animate__slower mb-2" style={{ fontSize: "40px" }}>QS. Ar-Rum 21</div>
          <div className="text-center animate__animated animate__fadeInUp animate__slower">
            <div className="mb-3" style={{ fontSize: "14.4px", lineHeight: "2", padding: "0 24px" }}>
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
