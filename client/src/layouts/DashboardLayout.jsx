import { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useAuthStore from "../context/authStore";
import { useTheme } from "../context/ThemeContext";

const DashboardLayout = ({ links, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determine current active link label as page title
  const activeLink = links?.find((link) => {
    if (link.end) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  });
  const displayTitle = activeLink ? activeLink.label : title || "Dashboard";

  const roleColors = {
    admin: "from-violet-500 to-purple-600",
    teacher: "from-blue-500 to-cyan-600",
    student: "from-emerald-500 to-teal-600",
  };
  const avatarGradient = roleColors[user?.role] || roleColors.student;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans dark:bg-slate-950">
      <Sidebar links={links} />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            style={{ animation: "fade-in 0.2s ease-out" }}
          />
          <div
            className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-slate-200/80 bg-white shadow-2xl dark:border-slate-800/60 dark:bg-slate-900"
            style={{ animation: "slide-in-left 0.25s ease-out" }}
          >
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className="font-display text-sm font-bold text-slate-900 dark:text-white">Habucho Portal</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setMobileOpen(false)}>
              <Sidebar links={links} />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ── Top Bar ─────────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/90 md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title + breadcrumb */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Portal</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-slate-600 dark:text-slate-300">{displayTitle}</span>
              </div>
              <h1 className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
                {displayTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* View site link */}
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/30 sm:flex"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Site
            </Link>

            {/* User avatar + logout */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br ${avatarGradient} text-xs font-bold text-white shadow-sm`}
                title={user?.name}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <button
                onClick={handleLogout}
                className="btn-outline hidden px-3 py-1.5 text-xs sm:inline-flex"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ── Main Content ─────────────────────────────── */}
        <main className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
