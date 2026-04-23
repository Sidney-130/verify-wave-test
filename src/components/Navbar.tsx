import { Bell, Menu, User, LayoutDashboard, ScanSearch, History, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUIStore } from "../store/uiStore";

interface NavbarProps {
  onMenuClick: () => void;
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/detection", label: "Detection", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

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

        <span className="hidden md:block text-lg font-bold tracking-wider text-foreground">
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
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <User size={20} />
          </NavLink>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex bg-card border-t border-border md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
