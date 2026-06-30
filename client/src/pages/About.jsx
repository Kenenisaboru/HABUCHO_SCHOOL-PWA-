/**
 * About Page — School history (timeline), mission, vision, core values
 * with premium card design and scroll reveal animations
 */
import { useRef, useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";

/* Scroll Reveal */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const About = () => {
  const values = [
    { title: "Excellence", desc: "Striving for the highest standards in everything we do", icon: "⭐", color: "from-amber-400/15 to-amber-500/5" },
    { title: "Integrity", desc: "Honesty and ethical behavior in every action we take", icon: "🤝", color: "from-blue-400/15 to-blue-500/5" },
    { title: "Innovation", desc: "Embracing new ideas and modern teaching methodologies", icon: "💡", color: "from-yellow-400/15 to-yellow-500/5" },
    { title: "Community", desc: "Building strong, lasting relationships among all stakeholders", icon: "🏫", color: "from-emerald-400/15 to-emerald-500/5" },
    { title: "Respect", desc: "Valuing diversity and treating everyone with dignity", icon: "🙏", color: "from-violet-400/15 to-violet-500/5" },
    { title: "Perseverance", desc: "Encouraging resilience and continuous improvement", icon: "💪", color: "from-rose-400/15 to-rose-500/5" },
  ];

  const timeline = [
    { year: "1995", title: "Foundation", desc: "Habucho Preparatory School was established with a vision to provide quality secondary education in the Oromia region.", icon: "🏗️" },
    { year: "2000", title: "First Graduates", desc: "Our first graduating class achieved outstanding results in national examinations, setting a high bar for excellence.", icon: "🎓" },
    { year: "2010", title: "Expansion", desc: "Major campus expansion with new classrooms, science labs, and a modern library to serve the growing student population.", icon: "🏛️" },
    { year: "2020", title: "Digital Era", desc: "Launched our digital school management system, bringing modern technology to school administration and learning.", icon: "💻" },
    { year: "2025", title: "Today", desc: "Over 500 students, 30+ expert teachers, and a 95% pass rate — continuing our legacy of academic excellence.", icon: "🚀" },
  ];

  return (
    <MainLayout>
      <PageHeader
        badge="Our Story"
        title="About Habucho Preparatory School"
        subtitle="Three decades of shaping leaders through excellence in education"
      />

      {/* ── History / Timeline ──────────────────────────── */}
      <section className="px-4 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <span className="section-label">History</span>
            <h2 className="section-title mt-3">Our Journey Through the Years</h2>
            <p className="section-subtitle">From humble beginnings to a beacon of regional excellence.</p>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-linear-to-b from-emerald-500 via-emerald-400 to-transparent md:left-1/2 md:-translate-x-0.5" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={i * 80}>
                  <div className={`relative flex gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-5 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-emerald-500 bg-white shadow-md shadow-emerald-500/20 dark:bg-slate-900 md:left-1/2 md:static md:translate-x-0 md:shrink-0">
                      <span className="text-lg">{item.icon}</span>
                    </div>

                    {/* Content */}
                    <div className={`card ml-14 flex-1 md:ml-0 ${i % 2 === 0 ? "md:mr-[calc(50%-2.5rem)]" : "md:ml-[calc(50%-2.5rem)]"}`}>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                          {item.year}
                        </span>
                        <h3 className="font-display font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-24 md:py-28">
        <div className="absolute inset-0 bg-slate-100/70 dark:bg-slate-900/40" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(5,150,105,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative mx-auto max-w-7xl">
          <Reveal className="mb-14 text-center">
            <span className="section-label">Purpose</span>
            <h2 className="section-title mt-3">Mission &amp; Vision</h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            <Reveal delay={0}>
              <div className="group relative overflow-hidden rounded-2xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)" }}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
                    🎯
                  </div>
                  <h2 className="mb-4 font-display text-2xl font-extrabold text-white">Our Mission</h2>
                  <p className="leading-relaxed text-emerald-100/80">
                    To provide accessible, high-quality preparatory education that empowers students with
                    knowledge, critical thinking skills, and moral values — enabling them to become
                    responsible citizens and future leaders.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="group relative overflow-hidden rounded-2xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #1d4ed8 100%)" }}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
                    🔭
                  </div>
                  <h2 className="mb-4 font-display text-2xl font-extrabold text-white">Our Vision</h2>
                  <p className="leading-relaxed text-blue-100/80">
                    To be the leading preparatory school in the region, recognized for academic excellence,
                    innovative teaching, and producing graduates who excel in higher education and
                    contribute positively to society.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Core Values ────────────────────────────────── */}
      <section className="px-4 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-14 text-center">
            <span className="section-label">Values</span>
            <h2 className="section-title mt-3">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do at Habucho School.</p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="group card card-hover relative overflow-hidden text-center">
                  <div className={`absolute inset-0 bg-linear-to-br ${v.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.1), rgba(16,185,129,0.05))" }}>
                      {v.icon}
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold text-slate-900 dark:text-white">{v.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
