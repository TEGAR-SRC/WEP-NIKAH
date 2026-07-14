const icn = (d: string, w = 18, h = 18) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={w} height={h} fill="#000"><path d={d} /></svg>;

const icons = {
  nextjs: icn("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"),
  go: icn("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"),
  postgres: icn("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"),
  redis: icn("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"),
};

export function Footer() {
  return (
    <div style={{ textAlign: "center", fontSize: 12, lineHeight: 1.8, padding: "24px 0", borderTop: "1px solid var(--inv-border)", marginTop: 40 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#000", fontWeight: 700 }}>
        <span>Dibuat oleh</span>
        <svg viewBox="0 0 1024 1024" width="14" height="14" fill="#000"><path d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"/></svg>
        <a href="https://github.com/TEGAR-SRC" target="_blank" rel="noopener noreferrer" style={{ color: "#000", textDecoration: "none", fontWeight: 700 }}>tegararrahman</a>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4, color: "#000", fontWeight: 600, fontSize: 11 }}>
        <span>Next.js</span><span>Go</span><span>PostgreSQL</span><span>Redis</span>
      </div>
    </div>
  );
}
