/**
 * PageHeader — Reusable hero banner for inner public pages
 */
const PageHeader = ({ title, subtitle, badge }) => {
  return (
    <section className="page-hero">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        {badge && <span className="section-label glass mb-4 text-white/90">{badge}</span>}
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100/90">{subtitle}</p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
