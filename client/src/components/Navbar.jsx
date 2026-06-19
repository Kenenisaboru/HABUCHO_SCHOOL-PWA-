/**
 * Navbar — Top navigation bar with responsive mobile menu
 */
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../context/authStore";
import { useTheme } from "../context/ThemeContext";
import { getDashboardPath } from "../utils/helpers";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, user, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/announcements", label: "Announcements" },
    { to: "/schedule", label: "Schedule" },
    { to: "/contact", label: "Contact" },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            H
          </div>
          <span className="hidden text-lg font-bold text-blue-600 sm:block dark:text-blue-400">
            Habucho School
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {token ? (
            <>
              <Link
                to={getDashboardPath(user?.role)}
                className="btn-primary hidden text-sm sm:inline-flex"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline hidden text-sm sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm">
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 px-4 py-3 md:hidden dark:border-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {token && (
            <div className="mt-2 flex flex-col gap-2">
              <Link to={getDashboardPath(user?.role)} className="btn-primary text-center text-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
