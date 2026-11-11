/**
 * Sidebar — Premium dashboard navigation with gradient active states,
 * royal sapphire & amber school branding, user avatar, and version tag.
 * Supports both permanent desktop view and mobile slide-over drawer.
 */
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../context/authStore";
import { getRoleGradient } from "../utils/roleColors";
import SchoolLogo from "./SchoolLogo";

const Sidebar = ({ links = [], isMobile = false, onLinkClick }) => {
  const user = useAuthStore((s) => s.user);
  const roleGradient = getRoleGradient(user?.role);

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-primary shadow-xs dark:bg-blue-950/50 dark:text-blue-400 font-bold"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
    }`;

  // Group links by section for organized navigation display
  const groupedLinks = (links || []).reduce((acc, link) => {
    const section = link.section || "Navigation";
    if (!acc[section]) acc[section] = [];
    acc[section].push(link);
    return acc;
  }, {});

  return (
    <aside
      className={
        isMobile
          ? "flex h-full w-full flex-col bg-white dark:bg-slate-900"
          : "hidden h-screen min-h-0 w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex dark:border-slate-800/80 dark:bg-slate-900"
      }
    >
      {/* School branding header (only on desktop since mobile drawer already renders header) */}
      {!isMobile && (
        <div className="border-b border-slate-100 p-5 dark:border-slate-800/80">
          <Link to="/" className="group flex items-center gap-3">
            <SchoolLogo className="h-10 w-10 shadow-md transition-transform duration-200 group-hover:scale-105" />
            <div>
              <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">
                Habucho
              </p>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Management Portal
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* User info card */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${roleGradient} text-sm font-bold text-white shadow-md`}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
              {user?.name}
            </p>
            <span
              className={`inline-block rounded-full bg-linear-to-r ${roleGradient} mt-0.5 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase`}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {Object.entries(groupedLinks).map(([sectionName, sectionLinks]) => (
          <div key={sectionName}>
            <p className="mt-4 mb-2 px-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              {sectionName}
            </p>
            <div className="space-y-1">
              {sectionLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={onLinkClick}
                  className={linkClass}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="bg-primary absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full dark:bg-blue-400" />
                      )}
                      <span
                        className={`transition-transform duration-150 ${isActive ? "" : "group-hover:scale-110"}`}
                      >
                        {typeof link.icon === "string" ? (
                          <span className="text-base">{link.icon}</span>
                        ) : link.icon ? (
                          <link.icon size={16} />
                        ) : null}
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
          <span className="text-primary rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold dark:bg-blue-900/40 dark:text-blue-400">
            v2.0 Pro
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
