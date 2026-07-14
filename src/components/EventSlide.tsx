import SlideFrame from "./SlideFrame";

interface EventSlideProps {
  title: string;
  day: string;
  date: string;
  month: string;
  year: string;
  time: string;
  location: string;
  address: string;
}

export default function EventSlide({ title, day, date, month, year, time, location, address }: EventSlideProps) {
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
          <div className="text-center mb-3">
            <div className="font-accent color-accent mb-2 animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "30px" }}>{title}</div>
            <div className="my-3 flex flex-row justify-center items-center animate__animated animate__zoomIn animate__slower">
              <div style={{ fontSize: "14.4px", width: "100px" }}>{day}</div>
              <div style={{ borderLeft: "2px solid var(--inv-accent)", borderRight: "2px solid var(--inv-accent)" }} className="px-3">
                <div style={{ fontSize: "38px", lineHeight: 1 }}>{date}</div>
                <div style={{ fontSize: "14.4px" }}>{year}</div>
              </div>
              <div style={{ fontSize: "14.4px", width: "100px" }}>{month}</div>
            </div>
            <div className="animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "14.4px" }}>Pukul {time}</div>
          </div>
          <div className="text-center">
            <div className="font-accent color-accent animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "18px" }}>Lokasi Acara</div>
            <div className="font-weight-bold animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px" }}>{location}</div>
            <div className="mb-4 animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px" }}>{address}</div>
          </div>
          <div className="mx-auto flex flex-col animate__animated animate__fadeInUp animate__slower" style={{ maxWidth: "320px" }}>
            <div className="countdown text-center flex justify-center gap-4">
              {["Hari", "Jam", "Menit", "Detik"].map((label) => (
                <div key={label} className="countdown-item">
                  <div className="number" style={{ fontSize: "28px", fontWeight: "bold" }}>00</div>
                  <div style={{ fontSize: "12px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
