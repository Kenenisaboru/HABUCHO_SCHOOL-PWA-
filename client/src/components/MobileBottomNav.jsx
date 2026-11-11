/**
 * MobileBottomNav — Telegram-style native mobile bottom navigation bar.
 * Fixed at the bottom of the screen on mobile devices (< 768px).
 * Features backdrop blur, active indicator, haptic tap feel, and instant thumb access.
 */
import { NavLink } from "react-router-dom";
import { Home, GraduationCap, Images, MessageSquare, LogIn, LayoutDashboard } from "lucide-react";
import useAuthStore from "../context/authStore";
import { getDashboardPath } from "../utils/helpers";

const MobileBottomNav = () => {
  const { user } = useAuthStore();

  const navItems = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/admissions", label: "Admissions", icon: GraduationCap },
    { to: "/gallery", label: "Gallery", icon: Images },
    { to: "/contact", label: "Contact", icon: MessageSquare },
    user
      ? {
          to: getDashboardPath(user?.role),
          label: "Dashboard",
          icon: LayoutDashboard,
          isAction: true,
        }
      : {
          to: "/login",
          label: "Portal",
          icon: LogIn,
          isAction: true,
        },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-200/80 bg-white/95 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl md:hidden dark:border-slate-800/80 dark:bg-slate-950/95 dark:shadow-[0_-4px_25px_rgba(0,0,0,0.4)]"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
                isActive
                  ? "font-bold text-blue-600 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator top bar */}
                {isActive && (
                  <span className="absolute -top-1.5 h-1 w-8 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-400" />
                )}

                {/* Icon with container */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    item.isAction
                      ? isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                      : isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        : "text-slate-500 group-hover:scale-105 dark:text-slate-400"
                  }`}
                >
                  <item.icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Label */}
                <span className="mt-0.5 max-w-[64px] truncate text-[10px] tracking-tight">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
