/**
 * Footer — Premium site-wide footer with 4-column layout,
 * social links, animated gradient separator, and royal sapphire/amber branding
 */
import { Link } from "react-router-dom";
import SchoolLogo from "./SchoolLogo";

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="group flex items-center gap-1.5 text-xs text-slate-400 transition-all duration-200 hover:text-blue-400 hover:gap-2.5"
    >
      <span className="inline-block h-px w-3 rounded-full bg-slate-600 transition-all duration-200 group-hover:w-4 group-hover:bg-blue-400" />
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/about", label: "About Habucho" },
    { to: "/academics", label: "Academics & Tracks" },
    { to: "/admissions", label: "Online Admissions" },
    { to: "/gallery", label: "Campus Gallery" },
    { to: "/announcements", label: "News & Events" },
    { to: "/schedule", label: "Class Schedules" },
    { to: "/contact", label: "Contact School" },
  ];

  const portalLinks = [
    { to: "/login", label: "Student Grade Portal" },
    { to: "/login", label: "Teacher Score Management" },
    { to: "/login", label: "Admin & Registrar Portal" },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300 border-t border-slate-800/80">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="group mb-5 inline-flex items-center gap-3">
              <SchoolLogo className="h-11 w-11 shadow-lg shadow-blue-900/40 transition-transform duration-300 group-hover:scale-105" />
              <div>
                <span className="font-display block text-base font-extrabold text-white">Habucho</span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                  Preparatory School
                </span>
              </div>
            </Link>
            <p className="mb-6 text-xs leading-relaxed text-slate-400">
              Empowering Grades 11 and 12 through academic rigor, scientific innovation, and character building since 2007 E.C.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <FooterLink key={link.to + link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Portal Links */}
          <div>
            <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-white">
              Portals & Services
            </h3>
            <ul className="space-y-2.5">
              {portalLinks.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-white">
              School Campus
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-primary dark:text-blue-400">
                  📍
                </span>
                <span>Arsi Aseko, Oromia, Ethiopia</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-primary dark:text-blue-400">
                  📞
                </span>
                <span>+251 911 000 000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-primary dark:text-blue-400">
                  ✉️
                </span>
                <span>admissions@habucho.edu.et</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-primary dark:text-blue-400">
                  🕒
                </span>
                <span>Mon – Fri: 8:00 AM – 4:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800/80 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>© {currentYear} Habucho Preparatory School Management System (PWA). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PWA Cloud Service Ready
              </span>
              <Link to="/login" className="font-semibold text-primary hover:text-blue-300">
                Sign In →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
