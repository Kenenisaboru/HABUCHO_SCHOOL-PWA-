import { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useAuthStore from "../context/authStore";
import { useTheme } from "../context/ThemeContext";

const DashboardLayout = ({ links, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuthStore();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determine current active link label as title
  const activeLink = links?.find((link) => {
    if (link.end) {
      return location.pathname === link.to;
    }
    return location.pathname.startsWith(link.to);
  });
  const displayTitle = activeLink ? activeLink.label : title || "Portal";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Sidebar links={links} />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-white">Navigation</span>
              <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">✕</button>
            </div>
            <Sidebar links={links} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-6 dark:border-slate-800/60 dark:bg-slate-900 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800" 
              onClick={() => setMobileOpen(true)} 
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h1 className="text-md font-bold tracking-tight text-slate-900 dark:text-white">{displayTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-colors"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <Link to="/" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
              View Site
            </Link>
            <button onClick={handleLogout} className="btn-outline text-xs px-3 py-1.5">
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
