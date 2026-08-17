import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import useFetch from "../hooks/useFetch";
import { getPublicStats } from "../services/publicService";

import kenenisaImg from "../Images/photo_2026-08-17_07-41-04.jpg";
import nurelayImg from "../Images/photo_2026-08-17_07-40-50.jpg";
import bezabihImg from "../Images/photo_2026-08-17_07-40-20.jpg";
import ibrahimImg from "../Images/photo_2026-08-17_07-40-43.jpg";
import fatiImg from "../Images/photo_2026-08-17_08-21-22.jpg";
import kelilImg from "../Images/photo_2026-08-17_08-21-12.jpg";
import abdelaImg from "../Images/photo_2026-08-17_08-21-12 (2).jpg";
import aliyiImg from "../Images/photo_2026-08-17_08-21-55.jpg";

const useCountUp = (target, duration = 2000) => {
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
  return { ref, display: started ? `${count}${suffix}` : `0${suffix}` };
};

const StatCounter = ({ value, label, delay }) => {
  const { ref, display } = useCountUp(value);
  return (
    <div ref={ref} className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md overflow-hidden hover:bg-slate-800/60 transition-all duration-500" style={{ animation: `fade-in-up 0.8s ease-out ${delay}s forwards`, opacity: 0 }}>
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-teal-300 tabular-nums z-10 mb-2 drop-shadow-lg">
        {display}
      </h3>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400 z-10">
        {label}
      </p>
    </div>
  );
};


const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    document.title = "Habucho Preparatory School — Home";
  }, []);

  const { data: statsData } = useFetch(getPublicStats, []);

  const features = [
    { icon: "🎓", title: "Elite Curriculum", desc: "Advanced placement tracks designed to guarantee university admission.", gradient: "from-emerald-400/20 to-teal-900/40" },
    { icon: "👨‍🔬", title: "Modern Labs", desc: "State-of-the-art facilities for physics, chemistry, and computer science.", gradient: "from-blue-400/20 to-indigo-900/40" },
    { icon: "📊", title: "Real-time Tracking", desc: "Instant access to grades, attendance, and academic analytics.", gradient: "from-violet-400/20 to-purple-900/40" },
    { icon: "🌐", title: "Digital Campus", desc: "Fully integrated digital ecosystem for assignments and resources.", gradient: "from-amber-400/20 to-orange-900/40" },
    { icon: "🛡️", title: "Secure Portal", desc: "Enterprise-grade security protecting all student and staff data.", gradient: "from-rose-400/20 to-red-900/40" },
    { icon: "🤝", title: "Active Community", desc: "Vibrant clubs, sports, and extracurricular networks.", gradient: "from-cyan-400/20 to-blue-900/40" },
  ];

  const defaultStats = [
    { value: "1,200+", label: "Enrolled Students" },
    { value: "50+", label: "Expert Faculty" },
    { value: "98%", label: "University Placement" },
    { value: "2007 E.C.", label: "Established" },
  ];

  const stats = statsData
    ? [
        { value: statsData.students, label: "Enrolled Students" },
        { value: statsData.teachers, label: "Expert Faculty" },
        { value: statsData.passRate, label: "University Placement" },
        { value: statsData.years || "2007 E.C.", label: "Established (E.C.)" },
      ]
    : defaultStats;

  const testimonials = [
    {
      name: "Kenenisa Boru",
      role: "4th Year Information Science & Full-Stack Engineer, HRU",
      category: "scholars",
      badge: "Full-Stack Engineer & Architect",
      text: "Habucho instilled in us a relentless drive for innovation and engineering excellence. Designing and developing this digital school portal is my proud contribution to give back to the institution that shaped my foundation.",
      image: kenenisaImg,
      portfolio: "https://kenenisaboru.github.io/portfolio/",
    },
    {
      name: "Ibrahim Jemal Elema",
      role: "Medicine Student, Haramaya University (Alumni)",
      category: "scholars",
      badge: "Medical Scholar",
      text: "Habucho Preparatory School laid the solid foundation and discipline that paved my way to studying Medicine at Haramaya University. The academic excellence and dedicated teachers here truly prepare you to achieve your highest dreams.",
      image: ibrahimImg,
    },
    {
      name: "Abdela Omer",
      role: "5th Year Law Student, Wachamo University (Alumni)",
      category: "scholars",
      badge: "5th Year Law Scholar",
      text: "Habucho fostered an intellectual environment that honed my critical reasoning and passion for justice. That foundational training carries me through my 5th year of Law at Wachamo University.",
      image: abdelaImg,
    },
    {
      name: "Kelil Mohammed",
      role: "Operational Manager, Awash Bank (Alumni Elite)",
      category: "elite",
      badge: "Banking Executive",
      text: "Habucho Preparatory School shapes character and true leadership. The resilience and vision built in our high school classrooms continue to propel our leadership and operations at Awash Bank.",
      image: kelilImg,
    },
    {
      name: "Aliyi Husein",
      role: "Auditor, Awash Bank (Alumni Elite)",
      category: "elite",
      badge: "Financial Auditor",
      text: "The discipline, numerical accuracy, and ethics I learned at Habucho continue to be the cornerstone of my financial audit career at Awash Bank.",
      image: aliyiImg,
    },
    {
      name: "Fati Sulxan",
      role: "Health Officer (Arba Minch Univ. Grad, Habucho Class of 11-12)",
      category: "elite",
      badge: "Healthcare Leader",
      text: "Studying Grades 11 and 12 at Habucho changed the course of my life. The dedicated teachers inspired me to graduate in Health Science from Arba Minch University and serve the community with pride.",
      image: fatiImg,
    },
    {
      name: "Nurelay Mohammed",
      role: "Law Student, Wachamo University (Alumni)",
      category: "scholars",
      badge: "Legal Scholar",
      text: "The analytical thinking, debate culture, and leadership values fostered at Habucho empowered me to pursue Law with confidence. It is a school that turns raw ambition into real success.",
      image: nurelayImg,
    },
    {
      name: "Anawar Tahir Gobena",
      role: "2nd Year Civil Engineering, Haramaya University (Alumni)",
      category: "scholars",
      badge: "Civil Engineering",
      text: "The strong mathematical foundation and encouragement from Habucho's STEM faculty paved the way for my Civil Engineering journey at HRU.",
      image: "https://ui-avatars.com/api/?name=Anawar+Tahir&background=059669&color=fff&bold=true",
    },
    {
      name: "Sudi Shemsedin",
      role: "4th Year Biomedical Engineering, Jimma University (Alumni)",
      category: "scholars",
      badge: "Biomedical Eng.",
      text: "From science labs and math competitions at Habucho to Biomedical Engineering at Jimma University, the relentless standard of excellence here inspired me to push boundaries.",
      image: "https://ui-avatars.com/api/?name=Sudi+Shemsedin&background=0d9488&color=fff&bold=true",
    },
    {
      name: "Bezabih Tesfaye",
      role: "Electrical & Computer Engineering, HRU (Alumni)",
      category: "scholars",
      badge: "ECE Scholar",
      text: "The rigorous STEM curriculum and tireless support from Habucho's teachers ignited my love for technology and engineering. This school builds tomorrow's innovators.",
      image: bezabihImg,
    },
  ];

  const filteredTestimonials = activeCategory === "all" 
    ? testimonials 
    : testimonials.filter((t) => t.category === activeCategory);

  return (
    <MainLayout>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px 0px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 40px 10px rgba(16, 185, 129, 0.7); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* ────────────────────────────────────────────────────────
          HERO SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
        {/* Abstract Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
            style={{ animation: 'fade-in-up 0.8s ease-out forwards' }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium tracking-wide text-emerald-300 uppercase">Next-Gen Digital Campus</span>
          </div>

          <h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] mb-6 sm:mb-8 max-w-5xl"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.2s forwards', opacity: 0 }}
          >
            Empowering the Future of <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-500">
              Education
            </span>
          </h1>

          <p 
            className="text-base sm:text-lg md:text-2xl text-slate-300 max-w-3xl mb-8 sm:mb-12 font-light leading-relaxed px-2"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.4s forwards', opacity: 0 }}
          >
            Habucho Preparatory School blends academic rigor with cutting-edge technology to prepare students for top-tier universities.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md sm:max-w-none justify-center items-center px-4"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.6s forwards', opacity: 0 }}
          >
            <Link 
              to="/login" 
              className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-slate-900 bg-emerald-400 rounded-full overflow-hidden group transition-all"
              style={{ animation: 'pulse-glow 3s infinite' }}
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative flex items-center gap-2">
                Access Portal
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </span>
            </Link>
            
            <Link 
              to="/about" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold text-white transition-all glass-panel rounded-full hover:bg-slate-800/80 hover:scale-105"
            >
              Discover Our Story
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-xs tracking-widest text-emerald-400 uppercase">Scroll</span>
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          STATS SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-950 relative border-t border-slate-900 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, idx) => (
              <StatCounter key={s.label} value={s.value} label={s.label} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FEATURES SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-20">
            <h2 className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-3">Why Choose Habucho</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Engineered for Excellence</h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We provide a holistic educational environment supported by modern infrastructure and digital tools.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="group relative h-full glass-panel rounded-3xl p-8 hover:bg-slate-800/80 transition-all duration-500 border border-slate-700/50 hover:border-emerald-500/30 overflow-hidden">
                  <div className={`absolute inset-0 bg-linear-to-br ${f.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl mb-6 shadow-lg border border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      {f.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{f.title}</h4>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          WHAT THIS WEBSITE DOES / PLATFORM CAPABILITIES SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-slate-950 relative overflow-hidden border-t border-slate-900">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-200 h-125 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Platform Capabilities & Features
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
              What Does This <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">Portal Do?</span>
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              Habucho Preparatory School's digital platform is an all-in-one Progressive Web Application (PWA) designed to automate, simplify, and elevate every aspect of school management and academic tracking.
            </p>
          </Reveal>

          {/* 3 Core Role Portals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            
            {/* Student Hub */}
            <Reveal delay={100}>
              <div className="glass-panel rounded-3xl p-8 h-full flex flex-col border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(16,185,129,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🎓
                  </div>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Student Portal
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  For Students & Parents
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Gives students 24/7 transparent access to their academic progress, schedules, and official school records.
                </p>
                <ul className="space-y-3 text-sm text-slate-300 grow mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Live Gradebook & Scorecards:</strong> View semester assessments, midterms, and final exam marks in real-time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Instant PDF Report Cards:</strong> Download official, printable student report cards with calculated ranks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Interactive Timetables:</strong> Access weekly period schedules for all grades (9–12) and streams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Official Notice Board:</strong> Receive immediate school updates, exam dates, and event broadcasts.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Self-service Academic Hub</span>
                  <span>Fast & Mobile-Ready →</span>
                </div>
              </div>
            </Reveal>

            {/* Teacher Hub */}
            <Reveal delay={200}>
              <div className="glass-panel rounded-3xl p-8 h-full flex flex-col border border-slate-800 hover:border-teal-500/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(20,184,166,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    👨‍🏫
                  </div>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Teacher Suite
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                  For Teachers & Faculty
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Eliminates paperwork with lightning-fast digital grade entry, roster management, and performance insights.
                </p>
                <ul className="space-y-3 text-sm text-slate-300 grow mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span><strong>Fast Score Entry:</strong> Input marks for quizzes, tests, projects, and final exams with one click.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span><strong>Automatic Computation:</strong> Instant calculation of totals, semester averages, rankings, and pass/fail statuses.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span><strong>Assigned Class Management:</strong> Filter and manage students by grade, section, and subject track.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span><strong>Teaching Schedule:</strong> Personal teaching timetables accessible from any device.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-400 font-semibold">
                  <span>Automated Grading Suite</span>
                  <span>Paperless Workflow →</span>
                </div>
              </div>
            </Reveal>

            {/* Admin Hub */}
            <Reveal delay={300}>
              <div className="glass-panel rounded-3xl p-8 h-full flex flex-col border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🏛️
                  </div>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Admin Command
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  For School Leadership
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Complete centralized control over school records, user privileges, academic analytics, and school communications.
                </p>
                <ul className="space-y-3 text-sm text-slate-300 grow mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span>
                    <span><strong>User Account Management:</strong> Create, manage, and verify student, teacher, and administrator accounts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span>
                    <span><strong>Class & Stream Allocations:</strong> Assign teachers to sections and organize Natural/Social science tracks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span>
                    <span><strong>Central Announcement Dispatch:</strong> Broadcast high-priority alerts with category badges school-wide.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span>
                    <span><strong>School Analytics & Security:</strong> Monitor enrollment figures, academic averages, and audit access logs.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span>Central Operations Control</span>
                  <span>Full Institutional Visibility →</span>
                </div>
              </div>
            </Reveal>

          </div>

          {/* 4 Core Technology Pillars */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 md:p-12 backdrop-blur-xl">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Core Technologies Powering the Platform
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all group">
                <div className="text-3xl mb-4">⚡</div>
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">Offline-Ready PWA</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Installable on phones, tablets, and laptops. Caches key schedules and scorecards for offline viewing even without internet.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/30 transition-all group">
                <div className="text-3xl mb-4">📄</div>
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-teal-400 transition-colors">Auto PDF Transcripts</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Instantly compiles marks into official, formatted PDF report cards ready for print, parent distribution, or university applications.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all group">
                <div className="text-3xl mb-4">📊</div>
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">Intelligent Ranking</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Automated computation algorithms sort class percentiles, total point averages, and rank standings without manual errors.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all group">
                <div className="text-3xl mb-4">🔒</div>
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">Protected & Encrypted</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  JWT-authenticated sessions and role-guard middleware safeguard all student records, passwords, and sensitive exam marks.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          TESTIMONIALS SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-slate-950 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-emerald-900/10 filter blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-12">
            <h2 className="text-teal-400 font-semibold tracking-widest uppercase text-sm mb-3">Student Voices & Elite Alumni</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Inspiring Journeys & Achievements</h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Discover stories from Habucho's proud university scholars, medical students, engineering pioneers, and industry leaders.
            </p>
          </Reveal>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: "all", label: "🌟 All Achievers", count: testimonials.length },
              { id: "scholars", label: "🎓 University Scholars", count: testimonials.filter((t) => t.category === "scholars").length },
              { id: "elite", label: "💼 Industry & Banking Elite", count: testimonials.filter((t) => t.category === "elite").length },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 150} direction="up">
                <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative border border-slate-800 hover:border-teal-500/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]">
                  <div className="text-emerald-500/20 text-6xl font-serif absolute top-4 right-6 group-hover:text-emerald-500/40 transition-colors pointer-events-none">"</div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative shrink-0">
                      <img 
                        src={t.image} 
                        alt={t.name} 
                        className="w-16 h-16 rounded-2xl border-2 border-emerald-500/60 object-cover shadow-lg group-hover:scale-105 group-hover:border-teal-400 transition-all duration-300" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-white font-bold text-lg leading-tight group-hover:text-emerald-300 transition-colors">{t.name}</h4>
                        {t.badge && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-teal-400 text-xs mt-1 font-medium leading-snug">{t.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 italic leading-relaxed grow text-base">
                    "{t.text}"
                  </p>

                  <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800/80">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    {t.portfolio && (
                      <a 
                        href={t.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
                      >
                        <span>Portfolio</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          CTA SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-slate-900 border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Shape Your <span className="text-emerald-400">Future?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of successful alumni. Access your portal now to view schedules, grades, and school announcements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
              >
                Login to Portal
              </Link>
              <Link 
                to="/contact" 
                className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-full transition-all border border-slate-600 hover:border-slate-500"
              >
                Contact Admissions
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </MainLayout>
  );
};

export default Home;
