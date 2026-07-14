"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import CoverSlide from "@/components/CoverSlide";
import OpeningSlide from "@/components/OpeningSlide";
import CoupleSlide from "@/components/CoupleSlide";
import StorySlide from "@/components/StorySlide";
import QuoteSlide from "@/components/QuoteSlide";
import VerseSlide from "@/components/VerseSlide";
import EventSlide from "@/components/EventSlide";
import LocationSlide from "@/components/LocationSlide";
import DoaSlide from "@/components/DoaSlide";
import GiftSlide from "@/components/GiftSlide";
import ClosingSlide from "@/components/ClosingSlide";


const trackSlides = [
  { id: "opening", component: OpeningSlide },
  { id: "couple", component: CoupleSlide },
  { id: "story", component: StorySlide },
  { id: "quote", component: QuoteSlide },
  { id: "verse", component: VerseSlide },
  { id: "akad", component: () => (
    <EventSlide
      title="Akad Nikah"
      day="Minggu"
      date="13"
      month="November"
      year="2022"
      time="08.00 WITA"
      location="Kediaman Mempelai Wanita"
      address="Jl. Wildan Sari 1 No. 11 Banjarmasin Barat"
    />
  )},
  { id: "resepsi", component: () => (
    <EventSlide
      title="Resepsi"
      day="Minggu"
      date="13"
      month="November"
      year="2022"
      time="08.00 WITA"
      location="Kediaman Mempelai Pria"
      address="Jl. Wildan Sari 1 No. 11 Banjarmasin Barat"
    />
  )},
  { id: "location", component: LocationSlide },
  { id: "doa", component: DoaSlide },
  { id: "gift", component: GiftSlide },
  { id: "closing", component: ClosingSlide },
] as const;

const SLIDE_COUNT = 12;
const totalSlides = trackSlides.length;

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isAnimating = useRef(false);

  const scrollTo = useCallback((trackIndex: number) => {
    const el = containerRef.current;
    if (!el || isAnimating.current) return;
    const targetTop = trackIndex * el.clientHeight;
    const start = el.scrollTop;
    const delta = targetTop - start;
    if (Math.abs(delta) < 1) return;
    isAnimating.current = true;
    const duration = 900;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      el.scrollTop = start + delta * ease;
      if (t < 1) requestAnimationFrame(tick);
      else isAnimating.current = false;
    };
    requestAnimationFrame(tick);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowVideo(true);
    setActiveIndex(0);
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
    }
  }, []);

  const handleEnterSlides = useCallback(() => {
    setShowVideo(false);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !showVideo) return;
    setCanSkip(false);
    const check = () => {
      if (v.currentTime >= 10) {
        setCanSkip(true);
      }
    };
    v.addEventListener("timeupdate", check);
    return () => v.removeEventListener("timeupdate", check);
  }, [showVideo]);

  const cancelAutoAdvance = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((menuIndex: number) => {
    cancelAutoAdvance();
    if (menuIndex === 0) {
      setIsOpen(false);
      setActiveIndex(0);
      return;
    }
    const trackIndex = menuIndex - 1;
    if (trackIndex < 0 || trackIndex >= totalSlides) return;
    setActiveIndex(menuIndex);
    scrollTo(trackIndex);
  }, [cancelAutoAdvance, scrollTo]);

  const goNext = useCallback(() => {
    cancelAutoAdvance();
    if (activeIndex < SLIDE_COUNT - 1) goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide, cancelAutoAdvance]);

  const goPrev = useCallback(() => {
    cancelAutoAdvance();
    if (activeIndex > 1) goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide, cancelAutoAdvance]);

  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  useEffect(() => {
    if (showVideo || !isOpen) return;
    autoTimerRef.current = setInterval(() => {
      const cur = activeRef.current;
      if (cur < SLIDE_COUNT - 1) goToSlide(cur + 1);
    }, 3500);
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [showVideo, isOpen, goToSlide]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen || showVideo) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAutoAdvance();
      if (isAnimating.current) return;
      const cur = activeRef.current;
      if (e.deltaY > 0 && cur < SLIDE_COUNT - 1) goToSlide(cur + 1);
      else if (e.deltaY < 0 && cur > 1) goToSlide(cur - 1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isOpen, showVideo, goToSlide, cancelAutoAdvance]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (showVideo) return;
    const handleKey = (e: KeyboardEvent) => {
      cancelAutoAdvance();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goNext();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showVideo, goNext, goPrev, cancelAutoAdvance]);

  return (
    <div
      id="workspace-container"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "var(--inv-bg)",
      }}
    >
      <audio ref={audioRef} src="/audio/song-of-sabdatama-wqaeg-2.mp3" loop />
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={`canvas ${isOpen ? "" : "not-open"}`} style={{ width: "100%", maxWidth: "480px", height: "100vh", position: "relative", overflow: "hidden" }}>
          {!isOpen ? (
            <CoverSlide onOpen={handleOpen} />
          ) : showVideo ? (
            <div
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
                position: "relative",
                cursor: canSkip ? "pointer" : "default",
              }}
              onClick={() => { if (canSkip) handleEnterSlides(); }}
            >
              <video
                ref={videoRef}
                src="/VIDIO/The Wedding of Masrul & Maya.mp4"
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(1.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "25%",
                  left: 0,
                  right: 0,
                  transform: "translateY(-50%)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "Great Vibes, cursive", fontSize: 56, color: "#FFD700", lineHeight: 1.2, textShadow: "0 0 20px #000, 0 0 40px rgba(0,0,0,0.8)" }}>
                  Masrul & Maya
                </div>
                <div style={{ fontFamily: "Marcellus, serif", fontSize: 18, color: "#fff", marginTop: 12, letterSpacing: 5, textTransform: "uppercase", textShadow: "0 0 15px #000, 0 2px 10px rgba(0,0,0,0.8)" }}>
                  The Wedding
                </div>
              </div>
              {canSkip && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 48,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <button
                    type="button"
                    style={{
                      padding: "12px 32px",
                      borderRadius: "50px",
                      border: "none",
                      background: "var(--inv-accent)",
                      color: "var(--btn-color)",
                      fontSize: "16px",
                      cursor: "pointer",
                      animation: "fadeInUp 1s both",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tap untuk buka undangan
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                ref={containerRef}
                style={{
                  height: "100vh",
                  width: "100%",
                  overflow: "hidden",
                  touchAction: "none",
                  userSelect: "none",
                }}
                onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
                onTouchEnd={(e) => {
                  cancelAutoAdvance();
                  if (isAnimating.current) return;
                  const diff = touchStartY.current - e.changedTouches[0].clientY;
                  if (Math.abs(diff) > 40) {
                    if (diff > 0 && activeIndex < SLIDE_COUNT - 1) goToSlide(activeIndex + 1);
                    else if (diff < 0 && activeIndex > 1) goToSlide(activeIndex - 1);
                  }
                }}
              >
                {trackSlides.map((slide) => {
                  const Component = slide.component;
                  return (
                    <div
                      key={slide.id}
                      style={{
                        height: "100vh",
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <Component />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
