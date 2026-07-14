import SlideFrame from "./SlideFrame";

export default function DoaSlide() {
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
          <div className="text-center">
            <div className="font-latin color-accent mb-4 animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "28.8px" }}>Do&rsquo;a Untuk Pengantin</div>
            <div className="mb-4 animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px", padding: "0 24px", lineHeight: "2" }}>
              &ldquo;Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, dan mengumpulkan kalian berdua dalam kebaikan&rdquo;<br /><br />[HR. Abu Daud]
            </div>
            <div className="mb-4 animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px" }}>
              Tekan tombol dibawah ini untuk mengirim ucapan dan konfirmasi kehadiran
            </div>
            <button
              type="button"
              className="mb-4 animate__animated animate__fadeInUp animate__slow"
              style={{
                padding: "12px 32px",
                borderRadius: "50px",
                border: "none",
                background: "var(--inv-accent)",
                color: "var(--btn-color)",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Konfirmasi &amp; Kirim Ucapan
            </button>
            <div className="mb-4 animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px" }}>
              Batas akhir konfirmasi<br />30 April 2022
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
