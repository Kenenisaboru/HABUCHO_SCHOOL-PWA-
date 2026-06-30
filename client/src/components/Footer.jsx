/**
 * Footer — Site-wide footer with links and school info
 */
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { to: "/about", label: "About Us" },
    { to: "/announcements", label: "Announcements" },
    { to: "/schedule", label: "Schedule" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <footer className="relative border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 text-lg font-bold text-white shadow-lg shadow-emerald-900/30">
                H
              </div>
              <span className="font-display text-xl font-bold text-white">Habucho School</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering students for a brighter future through quality education
              and holistic development since 1995.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-500">📍</span>
                Habucho Town, Ethiopia
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-500">📞</span>
                +251 911 000 000
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-500">✉️</span>
                info@habucho.edu
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Habucho Preparatory School. All rights reserved.</p>
          <Link to="/login" className="font-medium text-emerald-500 transition-colors hover:text-emerald-400">
            Student Portal →
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
