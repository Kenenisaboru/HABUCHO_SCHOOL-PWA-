/**
 * Home Page — Premium landing page with hero, features, stats, testimonials, CTA
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import useFetch from "../hooks/useFetch";
import { getPublicStats } from "../services/publicService";

/* ── Count-up hook ─────────────────────────────────────────── */
const useCountUp = (target, duration = 1800) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const numericTarget = parseInt(String(target).replace(/\D/g, ""), 10) || 0;
    if (numericTarget === 0) { setCount(target); return; }
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  const suffix = String(target).replace(/[0-9]/g, "");
  return { ref, display: started ? `${count}${suffix}` : "0${suffix}" };
};

/* ── Stat Counter ──────────────────────────────────────────── */
const StatCounter = ({ value, label }) => {
  const { ref, display } = useCountUp(value);
  return (
    <div ref={ref} className="group text-center">
      <p className="font-display text-4xl font-extrabold text-white tabular-nums md:text-5xl lg:text-6xl">
        {display}
      </p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-emerald-200">
        {label}
      </p>
    </div>
  );
};

/* ── Scroll Reveal wrapper ─────────────────────────────────── */
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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ── Main Component ────────────────────────────────────────── */
const Home = () => {
  const { data: statsData } = useFetch(getPublicStats, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80",
    "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1600&q=80",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const features = [
    { icon: "📚", title: "Quality Education", desc: "Comprehensive curriculum for Grades 11–12 aligned with national standards", color: "from-emerald-400/20 to-emerald-600/10" },
    { icon: "👨‍🏫", title: "Expert Teachers", desc: "Dedicated and experienced faculty members committed to student success", color: "from-blue-400/20 to-blue-600/10" },
    { icon: "📊", title: "Grade Tracking", desc: "Real-time academic performance monitoring for students and parents", color: "from-violet-400/20 to-violet-600/10" },
    { icon: "📅", title: "Smart Scheduling", desc: "Organized timetables and class management at your fingertips", color: "from-amber-400/20 to-amber-600/10" },
    { icon: "📢", title: "Announcements", desc: "Stay updated instantly with school news, events, and notices", color: "from-rose-400/20 to-rose-600/10" },
    { icon: "🔒", title: "Secure Portal", desc: "Role-based access control ensuring data privacy and security", color: "from-teal-400/20 to-teal-600/10" },
  ];

  const defaultStats = [
    { value: "500+", label: "Students Enrolled" },
    { value: "30+", label: "Expert Teachers" },
    { value: "95%", label: "Pass Rate" },
    { value: "25+", label: "Years of Excellence" },
  ];

  const stats = statsData
    ? [
        { value: statsData.students, label: "Students Enrolled" },
        { value: statsData.teachers, label: "Expert Teachers" },
        { value: statsData.passRate, label: "Pass Rate" },
        { value: statsData.years, label: "Years of Excellence" },
      ]
    : defaultStats;

  const testimonials = [
    {
      name: "Abebe Kebede",
      role: "Parent",
      text: "Habucho School transformed my child's academic journey. The teachers are truly exceptional and deeply committed.",
      stars: 5,
      initials: "AK",
    },
    {
      name: "Sara Tadesse",
      role: "Alumni '22",
      text: "The strong academic foundation I received here prepared me well for university life and beyond.",
      stars: 5,
      initials: "ST",
    },
    {
      name: "Dr. Hailu Getahun",
      role: "Teacher",
      text: "A wonderful environment for both teaching and learning. I am proud to be part of this community.",
      stars: 5,
      initials: "HG",
    },
  ];

  return (
    <MainLayout>
      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative flex min-h-[95vh] items-center justify-center overflow-hidden px-4 text-white"
        aria-label="Hero"
      >
        {/* Background slider */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={src}
                alt=""
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
                className={`h-full w-full object-cover transition-transform duration-9000 ease-out ${
                  index === currentImageIndex ? "scale-110" : "scale-100"
                }`}
              />
            </div>
          ))}
          {/* Overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-emerald-950/80 to-slate-950/70" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
          {/* Dot mesh */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Floating badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-sm opacity-0"
            style={{ animation: "slide-up 0.6s ease-out 0.1s forwards" }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Excellence Since 1995 · Grade 11 &amp; 12
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1
            className="font-display mb-6 text-5xl font-extrabold leading-tight tracking-tight opacity-0 md:text-7xl lg:text-8xl"
            style={{ animation: "slide-up 0.7s ease-out 0.2s forwards" }}
          >
            Welcome to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6ee7b7, #34d399, #10b981)" }}
            >
              Habucho
            </span>
            <br />
            <span className="text-white">Preparatory School</span>
          </h1>

          <p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 opacity-0 md:text-xl"
            style={{ animation: "fade-in 0.7s ease-out 0.4s forwards" }}
          >
            Empowering the next generation through excellence in education,
            character building, and holistic development.
          </p>

          <div
            className="flex flex-wrap justify-center gap-4 opacity-0"
            style={{ animation: "slide-up 0.6s ease-out 0.55s forwards" }}
          >
            <Link
              to="/login"
              className="btn-primary px-8 py-3.5 text-base shadow-lg shadow-emerald-900/40"
              style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Student Portal
            </Link>
            <Link
              to="/about"
              className="btn-outline border-white/25 bg-white/8 px-8 py-3.5 text-base text-white backdrop-blur-sm hover:bg-white/15 hover:text-white dark:border-white/25 dark:bg-white/8 dark:text-white"
            >
              Learn More
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Carousel dots */}
          <div
            className="mt-14 flex justify-center gap-2 opacity-0"
            style={{ animation: "fade-in 0.6s ease-out 0.8s forwards" }}
          >
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentImageIndex
                    ? "w-10 bg-emerald-400 shadow-sm shadow-emerald-400/50"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
          style={{ animation: "fade-in 1s ease-out 1.2s forwards" }}
        >
          <div
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
            aria-hidden="true"
          >
            <div
              className="h-2 w-0.5 rounded-full bg-white/60"
              style={{ animation: "bounce-soft 1.4s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section className="px-4 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <span className="section-label">About Us</span>
              <h2 className="section-title mt-3 mb-6">
                Building Futures,<br />One Student at a Time
              </h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Founded in 1995, Habucho Preparatory School has been a beacon of educational
                excellence in the Oromia region. We prepare Grade 11 &amp; 12 students for
                national exams and university admission with a focus on academic rigor,
                critical thinking, and personal growth.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-950/30">
                  <span className="text-lg">✅</span>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Government Accredited</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 dark:bg-blue-950/30">
                  <span className="text-lg">🏆</span>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Regional Top School</span>
                </div>
              </div>
              <Link to="/about" className="btn-primary mt-8 inline-flex gap-2">
                Discover Our Story
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Reveal>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "25+", label: "Years of Excellence", icon: "🎓", bg: "from-emerald-500/10 to-emerald-600/5" },
                { num: "500+", label: "Graduates", icon: "👩‍🎓", bg: "from-blue-500/10 to-blue-600/5" },
                { num: "95%", label: "Pass Rate", icon: "📈", bg: "from-violet-500/10 to-violet-600/5" },
                { num: "30+", label: "Expert Teachers", icon: "👨‍🏫", bg: "from-amber-500/10 to-amber-600/5" },
              ].map((item, i) => (
                <Reveal key={item.label} delay={i * 80}>
                  <div
                    className={`group card card-hover relative overflow-hidden bg-linear-to-br ${item.bg} text-center border-0!`}
                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                  >
                    <div className="card-gradient-border absolute inset-0 rounded-2xl" />
                    <span className="mb-2 block text-3xl">{item.icon}</span>
                    <p className="font-display text-3xl font-bold text-primary dark:text-emerald-400">{item.num}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 py-24 md:py-28">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-100/70 dark:bg-slate-900/40" />
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(rgba(5,150,105,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative mx-auto max-w-7xl">
          <Reveal className="mb-16 text-center">
            <span className="section-label">Why Habucho</span>
            <h2 className="section-title mt-3">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              A modern school management experience designed for students, teachers, and parents.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="group card card-hover relative overflow-hidden text-center">
                  <div className={`absolute inset-0 bg-linear-to-br ${f.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative">
                    <div
                      className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, rgba(5,150,105,0.12), rgba(16,185,129,0.06))` }}
                    >
                      {f.icon}
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATISTICS
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 py-24">
        {/* Layered gradient background */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #0f172a 100%)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute left-[10%] top-[20%] h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl"
          style={{ animation: "float 8s ease-in-out infinite" }} />
        <div className="pointer-events-none absolute right-[5%] bottom-[10%] h-32 w-32 rounded-full bg-teal-400/10 blur-2xl"
          style={{ animation: "float 6s ease-in-out infinite reverse" }} />

        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="px-4 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-16 text-center">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title mt-3">What Our Community Says</h2>
            <p className="section-subtitle">Hear from the people who make Habucho School great.</p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="group card card-hover relative flex h-full flex-col">
                  {/* Quote mark */}
                  <span
                    className="absolute -top-3 left-6 font-display text-6xl leading-none text-emerald-200 dark:text-emerald-900 select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="mb-4 flex gap-1 pt-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <svg key={si} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600 italic dark:text-slate-400">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                      style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 py-24">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_60%)]" />
        {/* Animated ring */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10"
          style={{ animation: "spin 15s linear infinite" }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/15"
          style={{ animation: "spin 10s linear infinite reverse" }}
        />

        <Reveal className="relative mx-auto max-w-3xl text-center">
          <span className="section-label mb-5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            Get Started Today
          </span>
          <h2 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            Ready to Join Our{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6ee7b7, #34d399)" }}
            >
              Community?
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Join our community of learners and educators. Access your personalized dashboard today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="btn-primary px-10 py-4 text-base shadow-lg shadow-emerald-900/30"
              style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
            >
              Login to Portal →
            </Link>
            <Link
              to="/contact"
              className="btn-outline border-slate-700 bg-transparent px-10 py-4 text-base text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </MainLayout>
  );
};

export default Home;
