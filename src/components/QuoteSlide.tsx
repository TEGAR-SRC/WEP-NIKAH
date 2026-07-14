import SlideFrame from "./SlideFrame";

export default function QuoteSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div className="text-center animate__animated animate__fadeInDown animate__slower font-latin color-accent" style={{ fontSize: "40px" }}>Yang Fana Adalah</div>
          <div className="text-center animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "40px" }}>WAKTU</div>
          <div className="text-center animate__animated animate__fadeInUp animate__slower">
            <div className="mb-3" style={{ fontSize: "14.4px", lineHeight: "2", padding: "0 24px" }}>
              Yang fana adalah waktu, Kita abadi:<br />
              memungut detik demi detik, merangkai nya seperti<br />
              bunga sampai pada suatu hari<br />
              kita lupa untuk apa.<br /><br />
              &ldquo;Tapi, yang fana adalah waktu, bukan?&rdquo;<br />
              tanyamu, Kita abadi.
            </div>
            <div className="font-italic" style={{ fontSize: "14.4px" }}>SAPARDI DJOKO DAMONO (1978)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
