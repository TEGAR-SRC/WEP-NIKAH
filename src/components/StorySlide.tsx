import SlideFrame from "./SlideFrame";
import { CoupleIcon } from "./icons";

export default function StorySlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center text-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div className="animate__animated animate__fadeInDown animate__slower" style={{ width: "240px", height: "135px", margin: "auto", overflow: "hidden", paddingBottom: "24px" }}>
            <img src="/images/satumomen/ilustrasi.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
          </div>
          <div className="font-latin color-accent mb-3 animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "36px" }}>
            Awal Bertemu
          </div>
          <div className="animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "18px", padding: "0 24px", lineHeight: "1.8" }}>
            Berawal dari sebuah pertemuan yang tidak terduga,<br />
            hati kami dipertemukan dalam ikatan cinta.<br />
            Setiap hari adalah cerita indah<br />
            yang kami tulis bersama.
          </div>
          <div className="animate__animated animate__fadeInUp animate__slower" style={{ paddingTop: "40px" }}>
            <CoupleIcon />
          </div>
        </div>
      </div>
    </div>
  );
}


