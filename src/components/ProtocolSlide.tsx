import SlideFrame from "./SlideFrame";
import { MaskIcon, ThermoIcon, WashIcon, DistanceIcon } from "./icons";

const protocols = [
  { icon: MaskIcon, label: "Memakai\nMasker" },
  { icon: ThermoIcon, label: "Cek Suhu\nTubuh" },
  { icon: WashIcon, label: "Mencuci\nTangan" },
  { icon: DistanceIcon, label: "Menjaga\nJarak" },
];

export default function ProtocolSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%", width: "100%" }}>
        <div>
          <div className="text-center">
            <div className="font-latin color-accent mb-2 animate__animated animate__fadeInDown animate__slow" style={{ fontSize: "28.8px" }}>Protokol Kesehatan</div>
            <div className="px-5 mb-4 animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px" }}>
              Mengingat kondisi pandemi saat ini, kami menghimbau Bapak/Ibu/Saudara/i tamu undangan agar tetap memperhatikan protokol kesehatan dalam rangka upaya pencegahan penyebaran virus Covid-19.
            </div>
          </div>
          <div className="text-center" style={{ margin: "auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px 8px", maxWidth: "300px" }}>
            {protocols.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="animate__animated animate__zoomIn animate__slow">
                  <div style={{ height: "80px", width: "80px", margin: "auto", backgroundColor: "var(--inv-accent)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon />
                  </div>
                  <div style={{ fontSize: "14.4px", marginTop: "8px" }}>{item.label.split("\n").map((l, j) => <div key={j}>{l}</div>)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
