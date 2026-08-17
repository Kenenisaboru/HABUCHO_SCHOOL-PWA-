import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";

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
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes slide-right {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.5) 20%, rgba(16, 185, 129, 0.5) 80%, rgba(16, 185, 129, 0));
          transform: translateX(-50%);
        }
        @media (max-width: 768px) {
          .timeline-line {
            left: 20px;
          }
        }
      `}</style>

      {/* ────────────────────────────────────────────────────────
          HERO/HEADER SECTION
      ───────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'float-slow 10s ease-in-out infinite' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-120 h-120 bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'float-slow 12s ease-in-out infinite reverse' }}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md mb-8">
              <span className="text-emerald-400 font-medium tracking-wider text-sm uppercase">Our Story</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight">
              A Legacy of <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
              Since 2007 E.C., Habucho Preparatory School has been shaping the minds of tomorrow's leaders, blending rich traditions with cutting-edge education.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          MISSION & VISION SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-slate-900 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <Reveal direction="left">
              <div className="group relative p-10 rounded-[2.5rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                    🎯
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    To provide accessible, high-quality preparatory education that empowers students with knowledge, critical thinking skills, and moral values, enabling them to become responsible citizens and future leaders.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={200}>
              <div className="group relative p-10 rounded-[2.5rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-500 overflow-hidden mt-12 md:mt-0">
                <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-teal-500/20 text-teal-400 rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    👁️
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-6">Our Vision</h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
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
      <section className="py-32 bg-slate-950 relative overflow-hidden">
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
                    Habucho Preparatory School was established in 2007 E.C. with a vision to provide quality secondary education to students in the Habucho region.
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ].map((alumnus) => (
              <Reveal key={alumnus.name}>
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1.5 flex gap-4 items-start h-full">
                  <img 
                    src={alumnus.image} 
                    alt={alumnus.name} 
                    className="w-14 h-14 rounded-2xl border-2 border-emerald-500/50 object-cover shrink-0 group-hover:scale-105 transition-transform" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-white font-bold text-base leading-tight group-hover:text-emerald-300 transition-colors">
                        {alumnus.name}
                      </h4>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {alumnus.badge}
                      </span>
                    </div>
                    <p className="text-teal-400 text-xs font-semibold">{alumnus.institution}</p>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{alumnus.desc}</p>
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
