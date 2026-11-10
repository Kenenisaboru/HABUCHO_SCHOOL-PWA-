/**
 * DashboardMobileBottomNav — Telegram-style mobile bottom navigation bar
 * for the authenticated student, teacher, and admin portals.
 * Fixed at the bottom on mobile devices (< 768px).
 */
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  BookOpen,
  Users,
  Trophy,
  Menu,
} from "lucide-react";
import useAuthStore from "../context/authStore";

const DashboardMobileBottomNav = ({ onOpenMenu }) => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  // Primary mobile shortcut tabs per role
  const getRoleNavItems = () => {
    if (role === "admin") {
      return [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/admin/users", label: "Users", icon: Users },
        { to: "/admin/curriculum", label: "Curriculum", icon: BookOpen },
        { to: "/admin/top-scorers", label: "Rankings", icon: Trophy },
      ];
    }
    if (role === "teacher") {
      return [
        { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/teacher/grades", label: "Scores", icon: BookOpen },
        { to: "/teacher/schedule", label: "Schedule", icon: CalendarDays },
      ];
    }
    // Student default
    return [
      { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/student/grades", label: "My Results", icon: GraduationCap },
      { to: "/student/schedule", label: "Schedule", icon: CalendarDays },
    ];
  };

  const items = getRoleNavItems();

  return (
    <nav
      aria-label="Dashboard mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 px-2 py-1.5 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-[0_-4px_25px_rgba(0,0,0,0.4)] md:hidden"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-1.5 h-1 w-8 rounded-full bg-blue-600 dark:bg-blue-400 transition-all duration-300" />
                )}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400 group-hover:scale-105"
                  }`}
                >
                  <item.icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="mt-0.5 text-[10px] tracking-tight truncate max-w-[64px]">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Menu toggle button to open full slide-over sidebar */}
        <button
          onClick={onOpenMenu}
          className="group relative flex flex-1 flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all duration-200 active:scale-95"
          aria-label="Open full menu"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:scale-105">
            <Menu className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="mt-0.5 text-[10px] tracking-tight truncate">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardMobileBottomNav;

