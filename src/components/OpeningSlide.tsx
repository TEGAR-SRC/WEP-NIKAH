import SlideFrame from "./SlideFrame";

export default function OpeningSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, pointerEvents: "none", textAlign: "center" }}>
        <img src="/images/digitainvite/images/decorative-top.png" alt="" style={{ width: "100%", height: "auto", maxHeight: 120, objectFit: "cover" }} />
      </div>
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div className="editable font-latin color-accent text-center animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "60px" }}>vf</div>
          <div className="editable text-center animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "14.4px" }}>0 3 . 0 5 . 2 2</div>
          <div className="text-center animate__animated animate__fadeInUp animate__slower">
            <div className="my-4 animate__animated animate__zoomIn animate__slower" style={{ width: "70%", height: "50vh", margin: "auto", overflow: "hidden" }}>
              <img src="/images/satumomen/character.webp" alt="Character" style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
            </div>
            <div className="editable animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px" }}>The Wedding of</div>
            <div className="editable font-latin color-accent mb-5" style={{ fontSize: "40px" }}>Vivy & Fauzan</div>
          </div>
        </div>
      </div>
    </div>
  );
}
