/**
 * Sidebar — Premium dashboard navigation with gradient active states,
 * school branding, user avatar, and version tag
 */
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../context/authStore";

const Sidebar = ({ links }) => {
  const user = useAuthStore((s) => s.user);

  const roleColors = {
    admin: "from-violet-500 to-purple-600",
    teacher: "from-blue-500 to-cyan-600",
    student: "from-emerald-500 to-teal-600",
  };

  const roleGradient = roleColors[user?.role] || roleColors.student;

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-emerald-50 text-primary shadow-sm dark:bg-emerald-950/40 dark:text-emerald-400"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
    }`;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white dark:border-slate-800/60 dark:bg-slate-900 lg:flex">
      {/* School branding header */}
      <div className="border-b border-slate-100 p-5 dark:border-slate-800/60">
        <Link to="/" className="group flex items-center gap-3">
          <div
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #059669, #047857, #065f46)" }}
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">Habucho</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              School Portal
            </p>
          </div>
        </Link>
      </div>

      {/* User info card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${roleGradient} text-sm font-bold text-white shadow-md`}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p>
            <span className={`inline-block rounded-full bg-linear-to-r ${roleGradient} px-2 py-0.5 text-[10px] font-bold capitalize text-white`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
          Navigation
        </p>
        <div className="space-y-0.5">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary dark:bg-emerald-400" />
                  )}
                  <span className={`text-lg transition-transform duration-150 ${isActive ? "" : "group-hover:scale-110"}`}>
                    {link.icon}
                  </span>
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">Habucho School © {new Date().getFullYear()}</p>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            v1.0
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
