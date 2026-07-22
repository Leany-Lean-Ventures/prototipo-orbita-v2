import { NavLink } from "react-router-dom";

import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { navItems } from "./nav-items";

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-[236px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/50 bg-card/80 shadow-soft backdrop-blur-md dark:border-white/5">
      <div className="flex h-16 items-center px-5">
        <span className="font-display text-lg font-bold text-sidebar-foreground">
          Órbita
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-micro ease-micro",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <div className="flex items-center gap-3 border-t border-sidebar-border p-4">
          <Avatar className="h-8 w-8 border-2 border-card shadow-md">
            <AvatarFallback>{user.avatar}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {user.role}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
