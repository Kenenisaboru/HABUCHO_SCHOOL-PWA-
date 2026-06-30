/**
 * NotFound Page — Premium 404 with animated glitch effect,
 * floating particles, and helpful navigation links
 */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const FloatingParticle = ({ size, top, left, delay, opacity }) => (
  <div
    className="pointer-events-none absolute rounded-full bg-emerald-400"
    style={{
      width: size,
      height: size,
      top,
      left,
      opacity,
      animation: `float ${5 + delay}s ease-in-out ${delay}s infinite`,
    }}
  />
);

const NotFound = () => {
  const [glitch, setGlitch] = useState(false);

  // Periodically trigger glitch effect
  useEffect(() => {
    const trigger = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    };
    const id = setInterval(trigger, 3500);
    return () => clearInterval(id);
  }, []);

  const suggestedLinks = [
    { to: "/", label: "Go Home", icon: "🏠" },
    { to: "/about", label: "About Us", icon: "🏫" },
    { to: "/announcements", label: "News", icon: "📢" },
    { to: "/login", label: "Login", icon: "🔐" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background particles */}
      <FloatingParticle size="8px" top="10%" left="15%" delay={0} opacity={0.3} />
      <FloatingParticle size="5px" top="20%" left="80%" delay={1} opacity={0.2} />
      <FloatingParticle size="12px" top="70%" left="10%" delay={2} opacity={0.15} />
      <FloatingParticle size="6px" top="80%" left="75%" delay={0.5} opacity={0.25} />
      <FloatingParticle size="4px" top="40%" left="90%" delay={3} opacity={0.2} />
      <FloatingParticle size="10px" top="55%" left="5%" delay={1.5} opacity={0.1} />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(rgba(16,185,129,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.08),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 text-center" style={{ animation: "fade-in 0.6s ease-out both" }}>
        {/* 404 with glitch */}
        <div className="relative select-none mb-2">
          <p
            className="font-display text-[120px] font-extrabold leading-none md:text-[180px]"
            style={{
              backgroundImage: "linear-gradient(135deg, #6ee7b7, #34d399, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: glitch ? "drop-shadow(4px 0 0 rgba(239,68,68,0.8)) drop-shadow(-4px 0 0 rgba(59,130,246,0.8))" : "none",
              transform: glitch ? "skewX(-2deg)" : "skewX(0deg)",
              transition: "filter 0.05s, transform 0.05s",
            }}
          >
            404
          </p>
          {/* Glitch copy layers */}
          {glitch && (
            <>
              <p className="font-display absolute inset-0 text-[120px] font-extrabold leading-none md:text-[180px] text-red-500/30 blur-[1px]"
                style={{ transform: "translate(3px, 0)", pointerEvents: "none" }}>
                404
              </p>
              <p className="font-display absolute inset-0 text-[120px] font-extrabold leading-none md:text-[180px] text-blue-500/30 blur-[1px]"
                style={{ transform: "translate(-3px, 0)", pointerEvents: "none" }}>
                404
              </p>
            </>
          )}
        </div>

        <h1
          className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          style={{ animation: "slide-up 0.6s ease-out 0.15s both" }}
        >
          Page Not Found
        </h1>
        <p
          className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-400"
          style={{ animation: "slide-up 0.6s ease-out 0.3s both" }}
        >
          The page you&apos;re looking for seems to have wandered off. Let us help you find your way back.
        </p>

        {/* Primary actions */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animation: "slide-up 0.6s ease-out 0.45s both" }}
        >
          <Link
            to="/"
            className="btn-primary px-8 py-3.5 text-base shadow-lg shadow-emerald-900/30"
            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
          >
            ← Go Back Home
          </Link>
          <Link to="/login" className="btn-outline border-slate-700 bg-transparent px-8 py-3.5 text-base text-slate-300 hover:bg-slate-800/60 hover:text-white">
            Sign In →
          </Link>
        </div>

        {/* Suggested links */}
        <div
          className="mt-12"
          style={{ animation: "fade-in 0.6s ease-out 0.6s both" }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-emerald-700/60 hover:bg-slate-800 hover:text-emerald-400"
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
