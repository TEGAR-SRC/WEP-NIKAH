import SlideFrame from "./SlideFrame";

export default function ClosingSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/digitainvite/images/decorative-refresh-bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div>
          <div className="animate__animated animate__fadeInDown animate__slower">
            <div style={{ width: "158px", height: "89px", margin: "auto", overflow: "hidden", paddingBottom: "20px" }}>
              <img src="/images/satumomen/27897-gallery-1672939613.png" alt="Ornament" style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
            </div>
          </div>
          <div className="text-center">
            <div className="mb-3 px-5 animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "14.4px", lineHeight: "2" }}>
              Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do&rsquo;a restu kepada kedua mempelai.
            </div>
            <div className="font-italic animate__animated animate__fadeInDown animate__slow" style={{ fontSize: "14.4px" }}>Hormat Kami Yang Mengundang</div>
            <div className="font-accent color-accent animate__animated animate__fadeInDown animate__slow" style={{ fontSize: "30px", marginTop: "8px" }}>Vivy &amp; Fauzan</div>
          </div>
        </div>
      </div>
    </div>
  );
}
