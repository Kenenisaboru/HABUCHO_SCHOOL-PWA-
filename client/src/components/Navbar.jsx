/**
 * Navbar — Top navigation bar with premium design, scroll-aware style,
 * animated active indicator, and responsive mobile menu
 */
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../context/authStore";
import { useTheme } from "../context/ThemeContext";
import { getDashboardPath } from "../utils/helpers";

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

const SchoolIcon = () => (
  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, user, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/about", label: "About", icon: "🏫" },
    { to: "/announcements", label: "News", icon: "📢" },
    { to: "/schedule", label: "Schedule", icon: "📅" },
    { to: "/contact", label: "Contact", icon: "✉️" },
  ];

  const linkClass = ({ isActive }) =>
    `relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? "text-primary dark:text-emerald-400"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/60 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/90 dark:shadow-slate-900/50"
          : "border-b border-transparent bg-white/60 backdrop-blur-xl dark:bg-slate-950/60"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3" aria-label="Habucho School home">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-md shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/40"
            style={{ background: "linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)" }}
          >
            <SchoolIcon />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display block text-sm font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
              Habucho
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Prep School
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {({ isActive }) => (
                <>
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary transition-all duration-300 dark:bg-emerald-400 ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          {token ? (
            <>
              <Link
                to={getDashboardPath(user?.role)}
                className="btn-primary hidden sm:inline-flex px-4 py-2 text-xs gap-1.5"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 17a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1zM13 7a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2h-4a2 2 0 01-2-2V7z" />
                </svg>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline hidden sm:inline-flex px-4 py-2 text-xs">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary px-4 py-2 text-xs gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Login
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800/60"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
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

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-100 bg-white/95 px-4 py-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/95">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-primary dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
          {token ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/60">
              <Link
                to={getDashboardPath(user?.role)}
                className="btn-primary py-2.5 text-center text-xs"
                onClick={() => setMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline py-2.5 text-xs">
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800/60">
              <Link
                to="/login"
                className="btn-primary block py-2.5 text-center text-xs"
                onClick={() => setMenuOpen(false)}
              >
                Login to Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
