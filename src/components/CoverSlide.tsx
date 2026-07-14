"use client";

import SlideFrame from "./SlideFrame";

export default function CoverSlide({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="container-mobile cover" style={{ backgroundImage: "url(/images/satumomen/bg.webp)" }}>
      <SlideFrame />
      <div className="flex justify-center items-center" style={{ height: "100%" }}>
        <div style={{ width: "100%" }}>
          <div>
            <div className="text-center animate__animated animate__fadeInDown animate__slower">
              <div className="mt-4 mb-4" style={{ fontSize: "14.4px" }}>19 . 08 . 22</div>
              <div className="animate__animated animate__fadeInDown animate__slower" style={{ width: "76%", margin: "auto", overflow: "hidden" }}>
                <img src="/images/satumomen/ilustrasi.webp" alt="Ilustrasi" style={{ width: "100%", height: "auto", objectFit: "cover" }} draggable={false} />
              </div>
              <div className="mt-4" style={{ fontSize: "14.4px" }}>The Wedding of</div>
              <div className="font-latin color-accent mb-4" style={{ fontSize: "40px" }}>Vivy & Fauzan</div>
            </div>
            <div className="text-center">
              <div className="mb-2 animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "14.4px" }}>
                Kepada Yth;<br />Bapak/Ibu/Saudara/i
              </div>
              <div className="font-weight-bold mb-4 animate__animated animate__fadeInUp animate__slower" style={{ fontSize: "18px" }}>Tamu Undangan</div>
              <button
                type="button"
                onClick={onOpen}
                className="btn-open-invitation mb-4 animate__animated animate__fadeInUp animate__slow"
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
                Buka Undangan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
