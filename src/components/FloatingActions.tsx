import { WhatsAppIcon, QRCodeIcon, MusicIcon, PauseIcon } from "./icons";

interface FloatingActionsProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
}

export default function FloatingActions({ isPlaying, onToggleMusic }: FloatingActionsProps) {
  return (
    <div className="floating-action">
      <a
        href="https://wa.me/?text=Saya+mau+order+undangan+digital+tema+Javanese"
        title="Pesan Tema Ini"
        target="_blank"
        rel="noopener noreferrer"
        className="fab-btn"
      >
        <WhatsAppIcon size={24} />
      </a>
      <button className="fab-btn">
        <QRCodeIcon size={24} />
      </button>
      <button
        id="btnMusic"
        className="fab-btn"
        onClick={onToggleMusic}
        style={{ color: isPlaying ? "var(--menu-active)" : "var(--inv-base)" }}
      >
        {isPlaying ? <PauseIcon size={24} /> : <MusicIcon size={24} />}
      </button>
    </div>
  );
}
