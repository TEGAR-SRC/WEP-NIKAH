import SlideFrame from "./SlideFrame";

export default function DoaSlide() {
  const goGuestbook = () => {
    // Custom event untuk navigasi ke GuestbookSlide
    window.dispatchEvent(new CustomEvent("go-to-guestbook"));
  };

  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/api/r2/public/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%", padding: "20px" }}>
        <div className="animate__animated animate__fadeIn animate__slower" style={{
          width: "100%",
          background: "rgba(228,221,215,0.6)",
          backdropFilter: "blur(4px)",
          borderRadius: 24,
          padding: "28px 20px",
          border: "1px solid rgba(255,255,255,0.3)",
        }}>
          <div className="font-latin color-accent text-center" style={{ fontSize: 26 }}>Do&rsquo;a Untuk Pengantin</div>
          <div style={{ width: 40, height: 2, background: "var(--inv-accent)", margin: "12px auto 16px", opacity: 0.4 }} />
          <div className="text-center">
            <div style={{ fontSize: 14, padding: "0 12px", lineHeight: 2.2, color: "var(--inv-base)" }}>
              &ldquo;Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, dan mengumpulkan kalian berdua dalam kebaikan&rdquo;<br /><br />[HR. Abu Daud]
            </div>
            <div style={{ fontSize: 13, color: "var(--inv-base)", marginTop: 16, lineHeight: 1.6 }}>
              Tekan tombol dibawah ini untuk mengirim ucapan dan konfirmasi kehadiran
            </div>
            <button
              type="button"
              onClick={goGuestbook}
              style={{
                padding: "12px 32px",
                borderRadius: 50,
                border: "none",
                background: "var(--inv-accent)",
                color: "var(--btn-color)",
                fontSize: 14,
                cursor: "pointer",
                marginTop: 12,
                fontFamily: "Marcellus, serif",
                letterSpacing: 1,
              }}
            >
              Konfirmasi &amp; Kirim Ucapan
            </button>
            <div style={{ fontSize: 12, color: "var(--inv-base)", opacity: 0.7, marginTop: 14 }}>
              Batas akhir konfirmasi<br /><span style={{ fontFamily: "DM Serif Display, serif", color: "var(--inv-accent)", fontSize: 14 }}>20 Juli 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
