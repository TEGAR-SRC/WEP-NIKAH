import SlideFrame from "./SlideFrame";

export default function LocationSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div>
            <div className="font-accent color-accent mb-3 text-center animate__animated animate__fadeInDown animate__slow" style={{ fontSize: "24px" }}>Lokasi Acara</div>
            <div style={{ width: "85%", margin: "auto", borderRadius: "2rem .5rem 2rem .5rem", overflow: "hidden", marginBottom: "20px", paddingBottom: "80%", position: "relative", border: "4px solid var(--inv-accent)" }} className="animate__animated animate__fadeInDown animate__slow">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute" }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCpV55KNPo55TuxnDFd_dR3MD0luBrN1Gc&zoom=17&q=-6.905151199999999,107.6293469"
              />
            </div>
            <div className="text-center animate__animated animate__fadeInUp animate__slow">
              <div className="font-weight-bold mb-3" style={{ fontSize: "14.4px" }}>Mercure Nexa Bandung</div>
              <div className="mb-3" style={{ fontSize: "14.4px" }}>
                Jl. Supratman No. 66 - 68 Cihaur Geulis<br />Kota Bandung, Jawa Barat
              </div>
              <a
                href="https://www.google.com/maps/place/?q=-6.905151199999999,107.6293469"
                className="inline-block mb-4 animate__animated animate__fadeInUp animate__slow"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "12px 32px",
                  borderRadius: "50px",
                  border: "none",
                  background: "var(--inv-accent)",
                  color: "var(--btn-color)",
                  fontSize: "16px",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Petunjuk Ke Lokasi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
