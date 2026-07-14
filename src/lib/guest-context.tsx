"use client";
import { createContext, useContext, ReactNode } from "react";

export interface GuestInfo {
  id: string;
  name: string;
  title: string;
  slug: string;
}

const GuestContext = createContext<GuestInfo | null>(null);

export function GuestProvider({ guest, children }: { guest: GuestInfo; children: ReactNode }) {
  return <GuestContext.Provider value={guest}>{children}</GuestContext.Provider>;
}

export function useGuest(): GuestInfo {
  const ctx = useContext(GuestContext);
  if (!ctx) return { id: "", name: "Tamu Undangan", title: "Bapak/Ibu", slug: "" };
  return ctx;
}
