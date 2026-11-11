import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import aboutClassroomImg from "../Images/about-classroom.webp";
import aboutCampusImg from "../Images/about-campus.webp";

import kenenisaImg from "../Images/photo_2026-08-17_07-41-04.jpg";
import nurelayImg from "../Images/photo_2026-08-17_07-40-50.jpg";
import bezabihImg from "../Images/photo_2026-08-17_07-40-20.jpg";
import ibrahimImg from "../Images/photo_2026-08-17_07-40-43.jpg";
import fatiImg from "../Images/photo_2026-08-17_08-21-22.jpg";
import kelilImg from "../Images/photo_2026-08-17_08-21-12.jpg";
import abdelaImg from "../Images/photo_2026-08-17_08-21-12 (2).jpg";
import aliyiImg from "../Images/photo_2026-08-17_08-21-55.jpg";

const About = () => {
  useEffect(() => {
    document.title = "About Us — Habucho Preparatory School";
  }, []);

  const values = [
    { title: "Excellence", desc: "Striving for the highest standards in all we do.", icon: "⭐" },
    { title: "Integrity", desc: "Honesty and ethical behavior in every action.", icon: "🤝" },
    { title: "Innovation", desc: "Embracing new ideas and modern teaching methods.", icon: "💡" },
    {
      title: "Community",
      desc: "Building strong relationships among all stakeholders.",
      icon: "🏫",
    },
    { title: "Respect", desc: "Valuing diversity and treating everyone with dignity.", icon: "🙏" },
    {
      title: "Perseverance",
      desc: "Encouraging resilience and continuous improvement.",
      icon: "💪",
    },
  ];

  return (
    <MainLayout>
      <div className="about-page">
        {/* ────────────────────────────────────────────────────────
          HERO/HEADER SECTION
      ───────────────────────────────────────────────────────── */}
        <section className="about-hero relative isolate overflow-hidden bg-[#030617] px-4 py-16 text-white sm:px-6 sm:py-20 lg:py-24">
          <div className="about-hero-glow" aria-hidden="true" />
          <div className="about-hero-grid relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="right" className="about-hero-copy">
              <div className="about-hero-badge">Our Story</div>
              <h1 className="about-hero-title">
                A Legacy of <span>Excellence</span>
              </h1>
              <p className="about-hero-description">
                Since 2007 E.C., Habucho Preparatory School has been shaping the minds of
                tomorrow&apos;s leaders, blending rich traditions with modern, inspiring learning.
              </p>
              <a className="about-hero-link" href="#our-journey">
                Discover our journey
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
            </Reveal>

            <Reveal direction="left" delay={150} className="about-hero-visual">
              <div className="about-hero-photo about-hero-photo-main">
                <img
                  src={aboutClassroomImg}
                  alt="Students and teachers working together in a bright classroom"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-hero-photo about-hero-photo-detail">
                <img
                  src={aboutCampusImg}
                  alt="A brick school building shown as representative campus imagery"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-hero-caption">
                <span className="about-hero-caption-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m5 12 4 4L19 6" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                <span>
                  <strong>Learning with purpose</strong>
                  <small>Growing brighter futures together</small>
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────
          MISSION & VISION SECTION 
      ───────────────────────────────────────────────────────── */}
        <section className="relative bg-slate-900 py-20 sm:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[4rem_4rem] opacity-20"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2 lg:gap-20">
              <Reveal direction="left">
                <div className="group relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-xl transition-all duration-500 hover:bg-slate-800/60 sm:rounded-[2.5rem] sm:p-10">
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl text-emerald-400 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 sm:mb-8 sm:h-20 sm:w-20 sm:rounded-3xl sm:text-4xl">
                      🎯
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-4xl">
                      Our Mission
                    </h2>
                    <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
                      To provide accessible, high-quality preparatory education that empowers
                      students with knowledge, critical thinking skills, and moral values, enabling
                      them to become responsible citizens and future leaders.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="right" delay={200}>
                <div className="group relative mt-6 overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-xl transition-all duration-500 hover:bg-slate-800/60 sm:rounded-[2.5rem] sm:p-10 md:mt-0">
                  <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/20 text-3xl text-teal-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:mb-8 sm:h-20 sm:w-20 sm:rounded-3xl sm:text-4xl">
                      👁️
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-4xl">
                      Our Vision
                    </h2>
                    <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
                      To be the leading preparatory school in the region, recognized for academic
                      excellence, innovative teaching, and producing graduates who excel in higher
                      education and contribute positively to society.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────
          TIMELINE / HISTORY SECTION 
      ───────────────────────────────────────────────────────── */}
        <section id="our-journey" className="relative overflow-hidden bg-slate-950 py-32">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-24 text-center">
              <h2 className="mb-3 text-sm font-semibold tracking-widest text-emerald-400 uppercase">
                Our Heritage
              </h2>
              <h3 className="text-4xl font-bold text-white md:text-5xl">The Journey of Habucho</h3>
            </Reveal>

            <div className="relative mx-auto max-w-4xl">
              <div className="timeline-line"></div>

              {/* Timeline Item 1 */}
              <div className="group relative mb-16 flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-125 md:absolute md:left-1/2 md:-translate-x-1/2"></div>
                <Reveal
                  direction="up"
                  className="w-[calc(100%-3rem)] pl-8 md:w-[calc(50%-3rem)] md:pl-0 md:group-odd:pr-12 md:group-even:pl-12"
                >
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md transition-colors group-hover:border-emerald-500/30">
                    <span className="mb-2 block text-xl font-bold text-emerald-400">2007 E.C.</span>
                    <h4 className="mb-3 text-2xl font-bold text-white">Foundation</h4>
                    <p className="text-slate-400">
                      Habucho Preparatory School was established in 2007 E.C. with a vision to
                      provide quality secondary education to students in the Aseko and across the
                      hole oromia region student.
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Timeline Item 2 */}
              <div className="group relative mb-16 flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-125 md:absolute md:left-1/2 md:-translate-x-1/2"></div>
                <Reveal
                  direction="up"
                  delay={200}
                  className="w-[calc(100%-3rem)] pl-8 md:w-[calc(50%-3rem)] md:pl-0 md:group-odd:pr-12 md:group-even:pl-12"
                >
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md transition-colors group-hover:border-emerald-500/30">
                    <span className="mb-2 block text-xl font-bold text-emerald-400">2012 E.C.</span>
                    <h4 className="mb-3 text-2xl font-bold text-white">Academic Expansion</h4>
                    <p className="text-slate-400">
                      Expanded facilities to include modern science laboratories and comprehensive
                      tracks for Natural and Social Sciences.
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Timeline Item 3 */}
              <div className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-125 md:absolute md:left-1/2 md:-translate-x-1/2"></div>
                <Reveal
                  direction="up"
                  delay={400}
                  className="w-[calc(100%-3rem)] pl-8 md:w-[calc(50%-3rem)] md:pl-0 md:group-odd:pr-12 md:group-even:pl-12"
                >
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md transition-colors group-hover:border-emerald-500/30">
                    <span className="mb-2 block text-xl font-bold text-emerald-400">Today</span>
                    <h4 className="mb-3 text-2xl font-bold text-white">Digital Transformation</h4>
                    <p className="text-slate-400">
                      Building on our proud legacy since 2007 E.C., now stepping into a fully
                      integrated digital era, ensuring real-time performance tracking and modern
                      portals.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────
          CORE VALUES SECTION 
      ───────────────────────────────────────────────────────── */}
        <section className="relative bg-slate-900 py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-teal-900/20 via-slate-900 to-slate-950"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-20 text-center">
              <h2 className="mb-3 text-sm font-semibold tracking-widest text-emerald-400 uppercase">
                Our DNA
              </h2>
              <h3 className="text-4xl font-bold text-white md:text-5xl">Core Values</h3>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/30 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80">
                    {/* Hover glow effect */}
                    <div className="absolute -inset-2 -z-10 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10"></div>

                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 text-4xl shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:border-emerald-500/50">
                      {v.icon}
                    </div>
                    <h4 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-emerald-400">
                      {v.title}
                    </h4>
                    <p className="leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                      {v.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────
          NOTABLE ALUMNI & STUDENT ACHIEVERS SECTION 
      ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-32">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-900/10 blur-[140px] filter"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-emerald-400 uppercase">
                Pride of Habucho
              </div>
              <h3 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Notable Alumni & Achievers
              </h3>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Our graduates continue to excel across Medicine, Law, Engineering, Technology,
                Finance, and Public Health.
              </p>
            </Reveal>

            <div className="alumni-timeline">
              <div className="alumni-timeline-line" aria-hidden="true" />
              {[
                {
                  name: "Kenenisa Boru",
                  field: "Information Science & Full-Stack Engineering",
                  institution: "Haramaya University & Portal Architect",
                  badge: "Lead Portal Developer",
                  desc: "4th Year Information Science student and lead developer of the Habucho Digital Campus Web Application.",
                  image: kenenisaImg,
                },
                {
                  name: "Ibrahim Jemal Elema",
                  field: "Medicine & Surgery",
                  institution: "Haramaya University",
                  badge: "Medical Scholar",
                  desc: "Pursuing human medicine after completing rigorous academic preparation at Habucho.",
                  image: ibrahimImg,
                },
                {
                  name: "Abdela Omer",
                  field: "Law & Jurisprudence",
                  institution: "Wachamo University",
                  badge: "5th Year Law Scholar",
                  desc: "5th Year Law student championing legal scholarship and advocacy.",
                  image: abdelaImg,
                },
                {
                  name: "Kelil Mohammed",
                  field: "Banking Operations & Leadership",
                  institution: "Awash Bank",
                  badge: "Operational Manager",
                  desc: "Leading high-level banking operations and branch administration at Awash Bank.",
                  image: kelilImg,
                },
                {
                  name: "Aliyi Husein",
                  field: "Financial Auditing & Accounting",
                  institution: "Awash Bank",
                  badge: "Bank Auditor",
                  desc: "Specializing in financial auditing, compliance, and institutional accuracy.",
                  image: aliyiImg,
                },
                {
                  name: "Fati Sulxan",
                  field: "Public Health & Medical Services",
                  institution: "Arba Minch University (Graduated)",
                  badge: "Health Officer",
                  desc: "Habucho Grade 11-12 graduate now serving society as a certified Health Officer.",
                  image: fatiImg,
                },
                {
                  name: "Nurelay Mohammed",
                  field: "Law & Legal Studies",
                  institution: "Wachamo University",
                  badge: "Law Student",
                  desc: "Excelling in legal research, debate, and university leadership tracks.",
                  image: nurelayImg,
                },
                {
                  name: "Anawar Tahir Gobena",
                  field: "Civil Engineering",
                  institution: "Haramaya University",
                  badge: "2nd Year Civil Eng.",
                  desc: "Designing infrastructure solutions with strong foundations built at Habucho.",
                  image:
                    "https://ui-avatars.com/api/?name=Anawar+Tahir&background=059669&color=fff&bold=true",
                },
                {
                  name: "Bezabih Tesfaye",
                  field: "Electrical & Computer Engineering",
                  institution: "Haramaya University",
                  badge: "ECE Scholar",
                  desc: "Engineering next-generation hardware and software computing systems.",
                  image: bezabihImg,
                },
              ].map((alumnus, index) => (
                <Reveal
                  key={alumnus.name}
                  delay={index * 70}
                  className={`alumni-timeline-item ${index % 2 === 0 ? "alumni-timeline-item-left" : "alumni-timeline-item-right"}`}
                >
                  <span className="alumni-timeline-node" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </span>
                  <article className="alumni-card">
                    <img
                      src={alumnus.image}
                      alt={alumnus.name}
                      className="alumni-card-photo"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="alumni-card-content">
                      <div className="alumni-card-heading">
                        <h4>{alumnus.name}</h4>
                        <span className="alumni-card-badge">{alumnus.badge}</span>
                      </div>
                      <p className="alumni-card-field">{alumnus.field}</p>
                      <p className="alumni-card-institution">{alumnus.institution}</p>
                      <p className="alumni-card-description">{alumnus.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
