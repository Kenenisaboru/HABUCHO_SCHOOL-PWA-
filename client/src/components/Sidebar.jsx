/**
 * Sidebar — Dashboard navigation sidebar with role-based links
 */
import { NavLink } from "react-router-dom";
import useAuthStore from "../context/authStore";

const Sidebar = ({ links }) => {
  const user = useAuthStore((s) => s.user);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
      isActive
        ? "bg-primary/10 text-primary dark:bg-primary/20"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100"
    }`;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white dark:border-slate-800/60 dark:bg-slate-900 lg:block">
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg dark:bg-primary/20">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{user?.name}</p>
            <p className="text-xs font-medium capitalize text-slate-400 dark:text-slate-500">{user?.role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              <span className="text-lg transition-transform duration-150 group-hover:scale-110">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
