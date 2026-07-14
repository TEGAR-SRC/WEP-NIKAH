"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    const posted = sessionStorage.getItem("vt");
    if (posted) return;
    sessionStorage.setItem("vt", "1");
    fetch("/api/log-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId: null, path: window.location.pathname }),
    }).catch(() => {});
  }, []);

  return null;
}
