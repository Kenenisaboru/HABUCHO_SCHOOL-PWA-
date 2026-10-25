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
    { title: "Community", desc: "Building strong relationships among all stakeholders.", icon: "🏫" },
    { title: "Respect", desc: "Valuing diversity and treating everyone with dignity.", icon: "🙏" },
    { title: "Perseverance", desc: "Encouraging resilience and continuous improvement.", icon: "💪" },
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
              Since 2007 E.C., Habucho Preparatory School has been shaping the
              minds of tomorrow&apos;s leaders, blending rich traditions with
              modern, inspiring learning.
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
                alt="Habucho school life represented by a welcoming campus building"
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
        <section className="py-20 sm:py-32 bg-slate-900 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">

            <Reveal direction="left">
              <div className="group relative p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 text-emerald-400 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mb-6 sm:mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                    🎯
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Our Mission</h2>
                  <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                    To provide accessible, high-quality preparatory education that empowers students with knowledge, critical thinking skills, and moral values, enabling them to become responsible citizens and future leaders.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={200}>
              <div className="group relative p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-500 overflow-hidden mt-6 md:mt-0">
                <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-500/20 text-teal-400 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    👁️
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Our Vision</h2>
                  <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                    To be the leading preparatory school in the region, recognized for academic excellence, innovative teaching, and producing graduates who excel in higher education and contribute positively to society.
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
        <section id="our-journey" className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-24">
            <h2 className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-3">Our Heritage</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white">The Journey of Habucho</h3>
          </Reveal>

          <div className="relative max-w-4xl mx-auto">
            <div className="timeline-line"></div>

            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-16">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 group-hover:scale-125 transition-transform shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2"></div>
              <Reveal direction="up" className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] pl-8 md:pl-0 md:group-odd:pr-12 md:group-even:pl-12">
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-md group-hover:border-emerald-500/30 transition-colors">
                  <span className="text-emerald-400 font-bold text-xl mb-2 block">2007 E.C.</span>
                  <h4 className="text-2xl font-bold text-white mb-3">Foundation</h4>
                  <p className="text-slate-400">
                    Habucho Preparatory School was established in 2007 E.C. with a vision to provide quality secondary education to students in the Aseko and across the hole oromia region student.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-16">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 group-hover:scale-125 transition-transform shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2"></div>
              <Reveal direction="up" delay={200} className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] pl-8 md:pl-0 md:group-odd:pr-12 md:group-even:pl-12">
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-md group-hover:border-emerald-500/30 transition-colors">
                  <span className="text-emerald-400 font-bold text-xl mb-2 block">2012 E.C.</span>
                  <h4 className="text-2xl font-bold text-white mb-3">Academic Expansion</h4>
                  <p className="text-slate-400">
                    Expanded facilities to include modern science laboratories and comprehensive tracks for Natural and Social Sciences.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 group-hover:scale-125 transition-transform shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2"></div>
              <Reveal direction="up" delay={400} className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] pl-8 md:pl-0 md:group-odd:pr-12 md:group-even:pl-12">
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-md group-hover:border-emerald-500/30 transition-colors">
                  <span className="text-emerald-400 font-bold text-xl mb-2 block">Today</span>
                  <h4 className="text-2xl font-bold text-white mb-3">Digital Transformation</h4>
                  <p className="text-slate-400">
                    Building on our proud legacy since 2007 E.C., now stepping into a fully integrated digital era, ensuring real-time performance tracking and modern portals.
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
        <section className="py-32 bg-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-teal-900/20 via-slate-900 to-slate-950 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-20">
            <h2 className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-3">Our DNA</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white">Core Values</h3>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="group bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl backdrop-blur-sm hover:bg-slate-800/80 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute -inset-2 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 blur-xl group-hover:opacity-10 transition-opacity duration-500 -z-10"></div>

                  <div className="text-4xl mb-6 bg-slate-900/50 w-16 h-16 flex items-center justify-center rounded-2xl border border-slate-700 group-hover:border-emerald-500/50 group-hover:scale-110 transition-all duration-500 shadow-inner">
                    {v.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{v.title}</h4>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        </section>

      {/* ────────────────────────────────────────────────────────
          NOTABLE ALUMNI & STUDENT ACHIEVERS SECTION 
      ───────────────────────────────────────────────────────── */}
        <section className="py-32 bg-slate-950 relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-900/10 filter blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
              Pride of Habucho
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Notable Alumni & Achievers</h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Our graduates continue to excel across Medicine, Law, Engineering, Technology, Finance, and Public Health.
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
                image: "https://ui-avatars.com/api/?name=Anawar+Tahir&background=059669&color=fff&bold=true",
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
                      <h4>
                        {alumnus.name}
                      </h4>
                      <span className="alumni-card-badge">
                        {alumnus.badge}
                      </span>
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
