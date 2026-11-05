/**
 * Sidebar — Premium dashboard navigation with gradient active states,
 * royal sapphire & amber school branding, user avatar, and version tag
 */
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../context/authStore";
import { getRoleGradient } from "../utils/roleColors";

const Sidebar = ({ links }) => {
  const user = useAuthStore((s) => s.user);
  const roleGradient = getRoleGradient(user?.role);

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-primary shadow-xs dark:bg-blue-950/50 dark:text-blue-400"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
    }`;

  // Group links by section for organized navigation display
  const groupedLinks = links.reduce((acc, link) => {
    const section = link.section || "Navigation";
    if (!acc[section]) acc[section] = [];
    acc[section].push(link);
    return acc;
  }, {});

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 lg:flex">
      {/* School branding header */}
      <div className="border-b border-slate-100 p-5 dark:border-slate-800/80">
        <Link to="/" className="group flex items-center gap-3">
          <div
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8, #0f172a)" }}
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">Habucho</p>
              <span className="rounded bg-amber-500/10 px-1 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                PRO
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Management Portal
            </p>
          </div>
        </Link>
      </div>

      {/* User info card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${roleGradient} text-sm font-bold text-white shadow-md`}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-white">{user?.name}</p>
            <span className={`inline-block rounded-full bg-linear-to-r ${roleGradient} px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white mt-0.5`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {Object.entries(groupedLinks).map(([sectionName, sectionLinks]) => (
          <div key={sectionName}>
            <p className="mb-2 mt-4 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {sectionName}
            </p>
            <div className="space-y-1">
              {sectionLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary dark:bg-blue-400" />
                      )}
                      <span className={`transition-transform duration-150 ${isActive ? "" : "group-hover:scale-110"}`}>
                        {typeof link.icon === "function" ? <link.icon size={16} /> : <span className="text-base">{link.icon}</span>}
                      </span>
                      <span>{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Habucho Prep © {new Date().getFullYear()}</p>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-primary dark:bg-blue-900/40 dark:text-blue-400">
            v2.0 Pro
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
