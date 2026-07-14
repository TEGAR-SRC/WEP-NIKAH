"use client";

import { useState, useEffect } from "react";
import SlideFrame from "./SlideFrame";

const monthMap: Record<string, number> = {
  Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
  Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11,
};

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
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const parts = time.split(".");
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    if (isNaN(h) || isNaN(m)) return;

    const target = new Date(parseInt(year), monthMap[month] ?? 0, parseInt(date), h, m, 0);

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [date, month, year, time]);

  const pad = (n: number) => String(n).padStart(2, "0");

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
          <div className="text-center">
            <div style={{
              fontFamily: "DM Serif Display, serif",
              color: "var(--inv-accent)",
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 4,
            }}>
              {title}
            </div>
            <div style={{
              width: 40,
              height: 2,
              background: "var(--inv-accent)",
              margin: "8px auto 16px",
              opacity: 0.4,
            }} />
          </div>
          <div className="flex justify-center gap-3 mb-3">
            <img src="/api/r2/public/images/satumomen/27897-gallery-1672939613.png" alt="" style={{ width: 80, height: "auto", objectFit: "contain" }} draggable={false} />
            <img src="/api/r2/public/images/satumomen/character.webp" alt="" style={{ width: 50, height: "auto", objectFit: "contain" }} draggable={false} />
          </div>
          <div className="flex flex-row justify-center items-center gap-3">
            <div style={{
              fontFamily: "Marcellus, serif",
              fontSize: 13,
              color: "var(--inv-base)",
              textAlign: "center",
              width: 70,
              lineHeight: 1.4,
            }}>
              {day}
            </div>
            <div style={{
              borderLeft: "1px solid var(--inv-accent)",
              borderRight: "1px solid var(--inv-accent)",
              padding: "0 16px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: 42,
                lineHeight: 1,
                color: "var(--inv-accent)",
              }}>
                {date}
              </div>
              <div style={{ fontFamily: "Marcellus, serif", fontSize: 12, color: "var(--inv-base)", letterSpacing: 2 }}>
                {year}
              </div>
            </div>
            <div style={{
              fontFamily: "Marcellus, serif",
              fontSize: 13,
              color: "var(--inv-base)",
              textAlign: "center",
              width: 70,
              lineHeight: 1.4,
            }}>
              {month}
            </div>
          </div>
          <div className="text-center" style={{ marginTop: 12 }}>
            <div style={{
              display: "inline-block",
              fontFamily: "Marcellus, serif",
              fontSize: 12,
              color: "var(--inv-accent)",
              letterSpacing: 3,
              borderTop: "1px solid rgba(174,116,0,0.2)",
              borderBottom: "1px solid rgba(174,116,0,0.2)",
              padding: "4px 16px",
            }}>
              {time === "11.00" ? "Pukul 11.00 WIB" : `Pukul ${time} WIB`}
            </div>
          </div>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <div style={{
              fontFamily: "DM Serif Display, serif",
              color: "var(--inv-accent)",
              fontSize: 14,
              letterSpacing: 2,
            }}>
              Lokasi Acara
            </div>
            <div style={{
              fontFamily: "Marcellus, serif",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--inv-base)",
              marginTop: 4,
            }}>
              {location}
            </div>
            <div style={{
              fontFamily: "Marcellus, serif",
              fontSize: 12,
              color: "var(--inv-base)",
              opacity: 0.8,
              lineHeight: 1.5,
              marginTop: 2,
            }}>
              {address}
            </div>
          </div>
          <div className="flex justify-center" style={{ marginTop: 16 }}>
            <div className="flex justify-center items-center" style={{ gap: 10 }}>
              {[
                { label: "Hari", value: timeLeft.days },
                { label: "Jam", value: timeLeft.hours },
                { label: "Menit", value: timeLeft.minutes },
                { label: "Detik", value: timeLeft.seconds },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 8,
                    background: "rgba(174,116,0,0.1)",
                    border: "1px solid rgba(174,116,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--inv-accent)",
                    fontFamily: "DM Serif Display, serif",
                  }}>
                    {pad(value)}
                  </div>
                  <div style={{ fontSize: 10, marginTop: 4, color: "var(--inv-base)", opacity: 0.6, letterSpacing: 1 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
