/**
 * PageHeader — Premium hero banner for inner public pages
 * with dot-mesh overlay, staggered animations, and academic sapphire/gold ambient light
 */
const PageHeader = ({ title, subtitle, badge }) => {
  return (
    <section className="page-hero" aria-label="Page header">
      {/* Dot mesh */}
      <div className="page-hero-dots" />

      {/* Animated floating orbs */}
      <div
        className="pointer-events-none absolute top-[15%] right-[10%] h-36 w-36 rounded-full bg-blue-500/20 blur-3xl"
        style={{ animation: "float 7s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute bottom-[10%] left-[5%] h-32 w-32 rounded-full bg-amber-400/15 blur-3xl"
        style={{ animation: "float 9s ease-in-out infinite reverse" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        {badge && (
          <span
            className="section-label glass mb-5 inline-block border border-amber-400/20 font-bold tracking-widest text-amber-300 opacity-0"
            style={{ animation: "slide-up 0.5s ease-out 0.1s forwards" }}
          >
            {badge}
          </span>
        )}
        <h1
          className="font-display text-4xl font-extrabold tracking-tight text-white opacity-0 md:text-5xl lg:text-6xl"
          style={{ animation: "slide-up 0.6s ease-out 0.2s forwards" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-blue-100/90 opacity-0"
            style={{ animation: "slide-up 0.6s ease-out 0.35s forwards" }}
          >
            {subtitle}
          </p>
        )}

        {/* Scroll arrow */}
        <div
          className="mt-10 flex justify-center opacity-0"
          style={{ animation: "fade-in 0.6s ease-out 0.6s forwards" }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
            style={{ animation: "bounce-soft 1.4s ease-in-out infinite" }}
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
