import SlideFrame from "./SlideFrame";
import { CoupleIcon } from "./icons";

export default function CoupleSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div>
          <div>
            <div className="mx-auto animate__animated animate__fadeInDown animate__slower" style={{ backgroundImage: "url(/images/satumomen/frame-jawa.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "300px" }}>
              <div style={{ height: "130px", width: "100px", margin: "auto", border: "2px solid var(--inv-base)", borderRadius: "50px 50px 0 0", overflow: "hidden", transform: "translate(0px, -14px)" }}>
                <img src="/images/satumomen/wanita.webp" alt="Wanita" style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
              </div>
              <div id="frame-jawa-bottom" style={{ height: "50px" }} />
            </div>
            <div className="text-center mb-2 animate__animated animate__fadeInLeft animate__slower">
              <div className="font-latin color-accent mb-2" style={{ fontSize: "28.8px" }}>Nama Pria</div>
              <div style={{ fontSize: "14.4px" }}>Putra dari<br />Bapak Nama Bapak<br />&amp; Ibu Nama Ibu</div>
            </div>
            <div className="text-center animate__animated animate__fadeIn animate__slower" style={{ marginTop: "-10px" }}>
              <CoupleIcon />
            </div>
            <div className="text-center animate__animated animate__fadeInRight animate__slower">
              <div className="font-latin color-accent mb-2" style={{ fontSize: "28.8px" }}>Nama Wanita</div>
              <div className="mb-1" style={{ fontSize: "14.4px" }}>Putra dari<br />Bapak Nama Bapak<br />&amp; Ibu Nama Ibu</div>
            </div>
            <div className="mx-auto animate__animated animate__fadeInUp animate__slower" style={{ backgroundImage: "url(/images/satumomen/frame-jawa.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "300px", marginTop: "30px" }}>
              <div style={{ height: "130px", width: "100px", margin: "auto", border: "2px solid var(--inv-base)", borderRadius: "50px 50px 0 0", overflow: "hidden", transform: "translate(0px, -14px)" }}>
                <img src="/images/satumomen/pria.webp" alt="Pria" style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
