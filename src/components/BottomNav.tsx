import { HomeIcon, MailIcon, HeartIcon, CalendarIcon, ClockIcon, MapIcon, ChatIcon, GiftIcon, CheckIcon } from "./icons";

const menuItems = [
  { label: "Cover", icon: HomeIcon },
  { label: "Opening", icon: MailIcon },
  { label: "Mempelai", icon: HeartIcon },
  { label: "Waktu", icon: CalendarIcon },
  { label: "Quotes", icon: CalendarIcon },
  { label: "Akad", icon: ClockIcon },
  { label: "Resepsi", icon: ClockIcon },
  { label: "Maps", icon: MapIcon },
  { label: "RSVP", icon: ChatIcon },
  { label: "Gift", icon: GiftIcon },
  { label: "Thanks", icon: CheckIcon },
];

interface BottomNavProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function BottomNav({ activeIndex, onSelect }: BottomNavProps) {
  return (
    <div id="smMenu" className="satumomen_menu">
      <ul className="satumomen_menu_list">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === activeIndex;
          return (
            <li
              key={i}
              className={`satumomen_menu_item${isActive ? " active" : ""}`}
              onClick={() => onSelect(i)}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
