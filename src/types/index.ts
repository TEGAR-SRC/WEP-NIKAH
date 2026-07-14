export interface SlideProps {
  className?: string;
}

export interface BrideGroomData {
  pria: string;
  priaOrangTua: string;
  wanita: string;
  wanitaOrangTua: string;
  fotoPria: string;
  fotoWanita: string;
}

export interface EventData {
  title: string;
  day: string;
  date: string;
  month: string;
  year: string;
  time: string;
  location: string;
  address: string;
}

export interface CountdownData {
  targetDate: string;
}

export interface LocationData {
  venue: string;
  address: string;
  lat: number;
  lng: number;
}
