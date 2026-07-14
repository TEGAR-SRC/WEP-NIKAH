import SlideFrame from "./SlideFrame";

export default function LocationSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div className="text-center mb-3 animate__animated animate__fadeInDown animate__slower">
            <div className="font-latin color-accent" style={{ fontSize: 30 }}>Lokasi Acara</div>
          </div>
          <div className="animate__animated animate__zoomIn animate__slower" style={{
            width: "88%", margin: "auto", borderRadius: 20, overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)", position: "relative", paddingBottom: "75%",
          }}>
            <iframe
              width="100%" height="100%"
              style={{ border: 0, position: "absolute" }}
              loading="lazy" allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.186954591143!2d103.9608064!3d1.0193124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d99348ff553bbd%3A0x725d807cdf40b4cd!2sKavling%20Bukit%20melati!5e0!3m2!1sid!2sid!4v1784029552533!5m2!1sid!2sid"
            />
          </div>
          <div className="text-center animate__animated animate__fadeInUp animate__slower" style={{ marginTop: 16 }}>
            <div style={{ fontSize: 16, color: "var(--inv-accent)", fontFamily: "DM Serif Display, serif" }}>Kavling Bukit Melati</div>
            <div style={{ fontSize: 13, color: "var(--inv-base)", lineHeight: 1.6, marginTop: 6, padding: "0 24px" }}>
              Blok F2 No 105 RT 02 RW 05<br />Kurahan Sei Pelunggut, Kec. Sagulung, Kota Batam
            </div>
            <a
              href="https://www.google.com/maps/place/?q=1.0193124,103.9608064"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 14, padding: "10px 28px", borderRadius: 50,
                background: "var(--inv-accent)", color: "var(--btn-color)",
                fontSize: 14, textDecoration: "none", cursor: "pointer",
                fontFamily: "Marcellus, serif", letterSpacing: 1,
              }}
            >
              Buka Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
