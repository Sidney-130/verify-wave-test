import { Bell, Menu, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUIStore } from "../store/uiStore";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const notificationCount = useUIStore((s) => s.notificationCount);

  return (
    <>
      <header className="w-full flex items-center px-4 md:px-6 py-3 bg-card border-b border-border shrink-0">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-md text-white hover:scale-110 transition-transform md:hidden"
        >
          <Menu size={24} />
        </button>

        <span className="hidden md:block text-2xl font-bold tracking-wider text-primary">
          TrustScan
        </span>

        <div className="flex items-center gap-3 ml-auto">
          <button className="relative p-2 rounded-md text-white hover:scale-110 transition-transform">
            <Bell size={22} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <NavLink
            to="/profile"
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
          >
            <User size={20} />
          </NavLink>
        </div>
      </header>
    </>
  );
}
