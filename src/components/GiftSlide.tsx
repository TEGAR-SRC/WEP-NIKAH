import SlideFrame from "./SlideFrame";

export default function GiftSlide() {
  return (
    <div className="container-mobile" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }} className="text-center">
          <div className="font-latin color-accent mb-2 animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "28.8px" }}>Kirim Hadiah</div>
          <div className="mb-4 px-5 animate__animated animate__fadeInDown animate__slower" style={{ fontSize: "14.4px" }}>
            Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberi hadiah kami sediakan fitur berikut
          </div>
          <div style={{ display: "flex" }}>
            <button type="button" style={{ maxWidth: "150px", margin: "auto", padding: "12px 24px", borderRadius: "50px", border: "none", background: "var(--inv-accent)", color: "var(--btn-color)", fontSize: "14px", cursor: "pointer" }} className="animate__animated animate__fadeInUp animate__slow">
              Hadiah
            </button>
            <button type="button" style={{ maxWidth: "150px", margin: "auto", padding: "12px 24px", borderRadius: "50px", border: "none", background: "var(--inv-accent)", color: "var(--btn-color)", fontSize: "14px", cursor: "pointer" }} className="animate__animated animate__fadeInUp animate__slow">
              Kirim Kado
            </button>
          </div>
          <div className="mt-3 p-4 rounded animate__animated animate__zoomIn animate__slow" style={{ background: "rgba(0,0,0,0.03)" }}>
            <div style={{ height: "100px", width: "100px", margin: "auto", overflow: "hidden", marginBottom: "20px", borderRadius: "10px" }}>
              <img src="/images/digitainvite/images/bank-bca.png" alt="BCA" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div className="text-center mb-2">
              <div className="font-weight-bold" style={{ fontSize: "20px", marginBottom: "4px" }}>12345678</div>
              <div style={{ fontSize: "14.4px" }}>BCA : Atas Nama Rekening</div>
            </div>
          </div>
          <div className="mt-3 p-4 rounded animate__animated animate__zoomIn animate__slow" style={{ background: "rgba(0,0,0,0.03)" }}>
            <div className="text-center mb-2">
              <div className="font-weight-bold color-accent mb-2" style={{ fontSize: "18px" }}>Kirim Kado</div>
              <div style={{ fontSize: "14.4px" }}>
                Anda dapat mengirim kado ke:<br />Jl. Wildan Sari 1 No 11 Banjarmasin Barat 70119
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
