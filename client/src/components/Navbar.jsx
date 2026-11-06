/**
 * Navbar — Top navigation bar with premium royal sapphire & amber design,
 * scroll-aware blur effect, animated indicators, and responsive mobile menu
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
} from "lucide-react";
import useAuthStore from "../context/authStore";
import { useTheme } from "../context/ThemeContext";
import { getDashboardPath } from "../utils/helpers";
import SchoolLogo from "./SchoolLogo";

const SunIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/90 shadow-md shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-black/40"
          : "border-b border-transparent bg-white/70 backdrop-blur-md dark:bg-slate-950/70"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3" aria-label="Habucho Preparatory School home">
          <SchoolLogo className="h-11 w-11 shadow-md transition-transform duration-300 group-hover:scale-105" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-black tracking-tight text-slate-900 dark:text-white">
                HABUCHO
              </span>
              <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
                PRO
              </span>
            </div>
            <span className="block text-[10px] font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Preparatory School
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full bg-primary transition-all duration-300 dark:bg-blue-400 ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-75"
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
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to={getDashboardPath(user?.role)}
                className="btn-primary px-3.5 py-1.5 text-xs gap-1.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline px-3 py-1.5 text-xs gap-1 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary px-3.5 py-1.5 text-xs gap-1.5 shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Portal Login</span>
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <div className="relative h-4 w-5">
              <span className={`absolute top-0 left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-1.5 rotate-45" : ""}`} />
              <span className={`absolute top-1.5 left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 translate-x-2" : ""}`} />
              <span className={`absolute top-3 left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-primary dark:bg-blue-950/50 dark:text-blue-400 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <link.icon size={15} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200/80 pt-3 dark:border-slate-800/80">
            {user ? (
              <div className="flex gap-2">
                <Link
                  to={getDashboardPath(user?.role)}
                  className="btn-primary flex-1 py-2 text-center text-xs"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-outline px-4 py-2 text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary block py-2 text-center text-xs"
                onClick={() => setMenuOpen(false)}
              >
                Login to Portal
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
