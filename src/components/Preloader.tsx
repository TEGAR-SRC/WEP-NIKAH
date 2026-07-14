"use client";

import { useEffect } from "react";

const assets = [
  "/api/r2/public/images/satumomen/bg.webp",
  "/api/r2/public/images/satumomen/ilustrasi.webp",
  "/api/r2/public/images/satumomen/character.webp",
  "/api/r2/public/images/satumomen/frame-tl.webp",
  "/api/r2/public/images/satumomen/frame-tr.webp",
  "/api/r2/public/images/satumomen/frame-bm.webp",
  "/api/r2/public/images/satumomen/frame-jawa.png",
  "/api/r2/public/images/satumomen/27897-gallery-1672939613.png",
  "/api/r2/public/foto/cewek.jpg",
  "/api/r2/public/foto/cowok.jpg",
  "/api/r2/public/images/digitainvite/images/bank-bca.png",
  "/api/r2/public/images/digitainvite/images/SeaBank.svg.webp",
  "/api/r2/public/audio/song-of-sabdatama-wqaeg-2.mp3",
];

export default function Preloader() {
  useEffect(() => {
    assets.forEach((src) => {
      if (src.endsWith(".mp3")) {
        const a = new Audio();
        a.preload = "auto";
        a.src = src;
      } else if (src.endsWith(".mp4")) {
        const v = document.createElement("video");
        v.preload = "auto";
        v.src = src;
        v.load();
      } else {
        const img = new Image();
        img.src = src;
      }
    });
  }, []);

  return null;
}
