/**
 * Home Page — Landing page with hero, features, stats, testimonials, CTA
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import useFetch from "../hooks/useFetch";
import { getPublicStats } from "../services/publicService";

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
    { icon: "📚", title: "Quality Education", desc: "Comprehensive curriculum for Grades 11–12" },
    { icon: "👨‍🏫", title: "Expert Teachers", desc: "Dedicated and experienced faculty members" },
    { icon: "📊", title: "Grade Tracking", desc: "Real-time academic performance monitoring" },
    { icon: "📅", title: "Smart Scheduling", desc: "Organized timetables and class management" },
    { icon: "📢", title: "Announcements", desc: "Stay updated with school news and events" },
    { icon: "🔒", title: "Secure Portal", desc: "Role-based access for students and staff" },
  ];

  const defaultStats = [
    { value: "500+", label: "Students" },
    { value: "30+", label: "Teachers" },
    { value: "95%", label: "Pass Rate" },
    { value: "25+", label: "Years" },
  ];

  const stats = statsData
    ? [
        { value: statsData.students, label: "Students" },
        { value: statsData.teachers, label: "Teachers" },
        { value: statsData.passRate, label: "Pass Rate" },
        { value: statsData.years, label: "Years" },
      ]
    : defaultStats;

  const testimonials = [
    { name: "Abebe Kebede", role: "Parent", text: "Habucho School transformed my child's academic journey. The teachers are exceptional." },
    { name: "Sara Tadesse", role: "Alumni", text: "The foundation I received here prepared me for university and beyond." },
    { name: "Dr. Hailu", role: "Teacher", text: "A wonderful environment for both teaching and learning. Proud to be part of this community." },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 text-white">
        <div className="absolute inset-0 z-0 bg-slate-950">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={src}
                alt=""
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
                className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                  index === currentImageIndex ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/90 via-emerald-900/75 to-slate-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="section-label glass mb-6 animate-fade-in text-white/90 opacity-0 [animation-delay:100ms]">
            Excellence Since 1995
          </span>
          <h1 className="font-display mb-6 animate-slide-up text-4xl font-extrabold leading-tight tracking-tight opacity-0 [animation-delay:150ms] md:text-6xl lg:text-7xl">
            Welcome to{" "}
            <span className="text-emerald-300">Habucho</span>{" "}
            Preparatory School
          </h1>
          <p className="mx-auto mb-10 max-w-2xl animate-fade-in text-lg leading-relaxed text-emerald-100/90 opacity-0 [animation-delay:300ms] md:text-xl">
            Empowering the next generation through excellence in education,
            character building, and holistic development for Grades 11–12.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in opacity-0 [animation-delay:450ms]">
            <Link to="/login" className="btn-primary px-8 py-3.5 text-base shadow-lg shadow-emerald-900/30">
              Student Portal
            </Link>
            <Link to="/about" className="btn-outline border-white/30 bg-white/10 px-8 py-3.5 text-base text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:border-white/30 dark:bg-white/10 dark:text-white">
              Learn More
            </Link>
          </div>

          {/* Carousel dots */}
          <div className="mt-12 flex justify-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImageIndex ? "w-8 bg-emerald-400" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="section-label">About Us</span>
              <h2 className="section-title mt-2">Building Futures, One Student at a Time</h2>
              <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
                Founded in 1995, Habucho Preparatory School has been a beacon of educational
                excellence in the region. We prepare students for national exams and university
                admission with a focus on academic rigor and personal growth.
              </p>
              <Link to="/about" className="btn-primary mt-8 inline-flex">
                Discover Our Story →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "25+", label: "Years of Excellence" },
                { num: "500+", label: "Graduates" },
                { num: "95%", label: "Pass Rate" },
                { num: "30+", label: "Expert Teachers" },
              ].map((item) => (
                <div key={item.label} className="card card-hover text-center">
                  <p className="font-display text-3xl font-bold text-primary">{item.num}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-100/80 px-4 py-20 dark:bg-slate-900/50 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="section-label">Why Habucho</span>
            <h2 className="section-title mt-2">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              A modern school experience designed for students, teachers, and parents.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group card card-hover text-center">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-emerald-800 px-4 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-extrabold md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-emerald-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title mt-2">What People Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card card-hover relative">
                <span className="absolute -top-2 left-6 font-display text-5xl leading-none text-emerald-200 dark:text-emerald-900">&ldquo;</span>
                <p className="mb-6 pt-4 text-sm leading-relaxed text-slate-600 italic dark:text-slate-400">{t.text}</p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-900 px-4 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Join our community of learners and educators. Access your dashboard today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/login" className="btn-primary px-8 py-3.5 text-base">
              Login to Portal
            </Link>
            <Link to="/contact" className="btn-outline border-slate-700 bg-transparent px-8 py-3.5 text-base text-slate-300 hover:bg-slate-800 hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
