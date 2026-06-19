/**
 * DashboardLayout — Authenticated dashboard wrapper with Sidebar
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useAuthStore from "../context/authStore";
import { useTheme } from "../context/ThemeContext";

const DashboardLayout = ({ children, links, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={links} />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800">
            <Sidebar links={links} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              ☰
            </button>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <Link to="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              View Site
            </Link>
            <button onClick={handleLogout} className="btn-outline text-sm">
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
