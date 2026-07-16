import SlideFrame from "./SlideFrame";
import { CoupleIcon } from "./icons";

export default function CoupleSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div>
          <div>
            <div className="mx-auto animate__animated animate__fadeInDown animate__slower" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/frame-jawa.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "280px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ height: "170px", width: "130px", border: "2px solid var(--inv-base)", borderRadius: "60px 60px 0 0", overflow: "hidden", marginTop: "-25px" }}>
                <img src="/api/r2/public/foto/cewek.jpg" alt="Wanita" style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
              </div>
            </div>
            <div className="text-center mb-2 animate__animated animate__fadeInLeft animate__slower">
              <div className="font-latin color-accent mb-2" style={{ fontSize: "28.8px" }}>Vebriza Juinda Putri Zahara, A.Md.Kom</div>
              <div style={{ fontSize: "14.4px" }}>Putri dari<br />Bapak Sarmadan<br />&amp; Ibu Nurhayati</div>
            </div>
            <div className="text-center animate__animated animate__fadeIn animate__slower" style={{ marginTop: "-10px" }}>
              <CoupleIcon />
            </div>
            <div className="text-center animate__animated animate__fadeInRight animate__slower">
              <div className="font-latin color-accent mb-2" style={{ fontSize: "28.8px" }}>Tegar Arrahman</div>
              <div className="mb-1" style={{ fontSize: "14.4px" }}>Putra dari<br />Bapak Joko Prayitno<br />&amp; Ibu Sri Harwanti</div>
            </div>
            <div className="mx-auto animate__animated animate__fadeInUp animate__slower" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/frame-jawa.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "280px", height: "300px", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ height: "170px", width: "130px", border: "2px solid var(--inv-base)", borderRadius: "60px 60px 0 0", overflow: "hidden", marginTop: "-25px" }}>
                <img src="/api/r2/public/foto/cowok.jpg" alt="Pria" style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
