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
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-primary/10 text-primary dark:bg-primary/20"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/40 dark:hover:text-slate-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-md font-bold text-white shadow-sm transition-transform group-hover:scale-102">
            H
          </div>
          <span className="hidden text-md font-semibold tracking-tight text-slate-900 sm:block dark:text-white">
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
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {token ? (
            <>
              <Link
                to={getDashboardPath(user?.role)}
                className="btn-primary hidden sm:inline-flex text-xs px-3.5 py-2"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline hidden sm:inline-flex text-xs px-3.5 py-2">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-xs px-3.5 py-2">
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800/60"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200/80 bg-slate-50/95 px-4 py-3 md:hidden dark:border-slate-800/80 dark:bg-slate-950/95 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="block px-3 py-2 rounded-xl text-sm font-medium transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {token && (
            <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-2">
              <Link to={getDashboardPath(user?.role)} className="btn-primary text-center text-xs py-2" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-outline text-xs py-2">
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
