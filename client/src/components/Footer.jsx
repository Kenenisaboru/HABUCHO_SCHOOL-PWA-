/**
 * Footer — Site-wide footer with links and school info
 */
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
                H
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                Habucho School
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empowering students for a brighter future through quality education
              and holistic development since 1995.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/about", label: "About Us" },
                { to: "/announcements", label: "Announcements" },
                { to: "/schedule", label: "Schedule" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>📍 Habucho Town, Ethiopia</li>
              <li>📞 +251 911 000 000</li>
              <li>✉️ info@habucho.edu</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-700">
          © {new Date().getFullYear()} Habucho Preparatory School. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
