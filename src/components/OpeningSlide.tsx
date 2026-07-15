import SlideFrame from "./SlideFrame";

export default function OpeningSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div className="font-latin color-accent text-center animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "60px" }}>T&amp;V</div>
          <div className="text-center animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "14.4px", color: "var(--inv-base)", letterSpacing: 4 }}>20 . 07 . 26</div>
          <div className="text-center animate__animated animate__fadeInUp animate__slower">
            <div className="my-4" style={{ width: "70%", height: "50vh", margin: "auto", overflow: "hidden" }}>
              <img src="/api/r2/public/images/satumomen/character.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
            </div>
            <div style={{ fontSize: "14.4px", letterSpacing: 2 }}>The Wedding of</div>
            <div className="font-latin color-accent" style={{ fontSize: "40px" }}>Tegar &amp; Vebriza</div>
          </div>
        </div>
      </div>
    </div>
  );
}
