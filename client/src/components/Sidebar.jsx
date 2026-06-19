/**
 * Sidebar — Dashboard navigation sidebar with role-based links
 */
import { NavLink } from "react-router-dom";
import useAuthStore from "../context/authStore";

const Sidebar = ({ links }) => {
  const user = useAuthStore((s) => s.user);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 lg:block">
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">{user?.name}</p>
            <p className="text-xs capitalize text-gray-500">{user?.role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
