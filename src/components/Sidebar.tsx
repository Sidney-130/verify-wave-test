import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  History,
  Settings,
  User,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/detection", label: "Detection", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-60 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
          md:static md:translate-x-0 md:h-full md:shrink-0
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-end px-4 py-2 md:hidden">
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors border-l-2 ${
                  isActive
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:bg-muted/40 hover:text-yellow-400/80"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/profile"
          onClick={onClose}
          className="px-4 py-4 border-t border-border flex items-center gap-3 hover:bg-muted/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User size={18} className="text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              Janey
            </p>
            <p className="text-xs text-muted-foreground truncate">
              PREMIUM OPS
            </p>
          </div>
        </NavLink>
      </aside>
    </>
  );
}
