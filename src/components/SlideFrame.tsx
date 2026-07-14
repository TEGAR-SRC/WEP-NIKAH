export default function SlideFrame() {
  return (
    <div className="frame">
      <img
        className="frame-tl animate__animated animate__fadeInTopLeft animate__slower"
        src="/images/satumomen/frame-tl.webp"
        alt="frame"
        width={120}
        height={120}
      />
      <img
        className="frame-tr animate__animated animate__fadeInTopRight animate__slower"
        src="/images/satumomen/frame-tr.webp"
        alt="frame"
        width={120}
        height={120}
      />
      <img
        className="frame-bl animate__animated animate__fadeInUp animate__slower"
        src="/images/satumomen/frame-bm.webp"
        alt="frame"
        style={{ width: "100%" }}
      />
    </div>
  );
}
