/**
 * Navbar — Top navigation bar with premium royal sapphire & amber design,
 * scroll-aware blur effect, responsive desktop nav, and slide-over mobile sidebar drawer.
 */
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  School,
  MessageSquare,
  GraduationCap,
  Images,
  LogIn,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import useAuthStore from "../context/authStore";
import { useTheme } from "../context/ThemeContext";
import { getDashboardPath } from "../utils/helpers";
import SchoolLogo from "./SchoolLogo";

const SunIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about", label: "About", icon: School },
    { to: "/admissions", label: "Admissions", icon: GraduationCap },
    { to: "/gallery", label: "Gallery", icon: Images },
    { to: "/contact", label: "Contact", icon: MessageSquare },
  ];

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? "text-primary dark:text-blue-400 font-semibold"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    }`;

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/90 shadow-md shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-black/40"
          : "border-b border-transparent bg-white/70 backdrop-blur-md dark:bg-slate-950/70"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="Habucho Preparatory School home"
        >
          <SchoolLogo className="h-11 w-11 shadow-md transition-transform duration-300 group-hover:scale-105" />
          <div>
            <div>
              <span className="font-display text-base font-black tracking-tight text-slate-900 dark:text-white">
                HABUCHO
              </span>
            </div>
            <span className="block text-[10px] font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Preparatory School
            </span>
          </div>
        </Link>

        {/* Desktop Nav (visible on md screens and up) */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`bg-primary absolute right-2.5 bottom-0 left-2.5 h-0.5 rounded-full transition-all duration-300 dark:bg-blue-400 ${
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-75 group-hover:opacity-40"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to={getDashboardPath(user?.role)}
                className="btn-primary gap-1.5 px-3.5 py-1.5 text-xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary portal-login-button gap-1.5 px-3.5 py-1.5 text-xs shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Portal Login</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute top-0 left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute top-1.5 left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "translate-x-2 opacity-0" : ""}`}
              />
              <span
                className={`absolute top-3 left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-1.5 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer content sliding from the right */}
          <div
            className="fixed inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col border-l border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            style={{ animation: "slide-in-right 0.25s ease-out" }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <SchoolLogo className="h-8 w-8" />
                <div>
                  <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">
                    HABUCHO
                  </p>
                  <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                    Preparatory School
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* User profile card if logged in */}
            {user && (
              <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
                      {user?.name}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Vertical Navigation Links */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                      isActive
                        ? "text-primary bg-blue-50 font-bold dark:bg-blue-950/50 dark:text-blue-400"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                    }`
                  }
                >
                  <link.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Drawer Bottom Actions */}
            <div className="space-y-3 border-t border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Theme</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {darkMode ? <SunIcon /> : <MoonIcon />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>

              {user ? (
                <div className="flex gap-2">
                  <Link
                    to={getDashboardPath(user?.role)}
                    className="btn-primary flex flex-1 items-center justify-center gap-1.5 py-2.5 text-center text-xs font-bold"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-outline px-3 py-2.5 text-xs text-rose-600 dark:text-rose-400"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary portal-login-button flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login to Portal</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
