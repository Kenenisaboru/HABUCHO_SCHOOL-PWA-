import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import useFetch from "../hooks/useFetch";
import { getPublicStats } from "../services/publicService";

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
    { value: "28+", label: "Years of Legacy" },
  ];

  const stats = statsData
    ? [
        { value: statsData.students, label: "Enrolled Students" },
        { value: statsData.teachers, label: "Expert Faculty" },
        { value: statsData.passRate, label: "University Placement" },
        { value: statsData.years, label: "Years of Legacy" },
      ]
    : defaultStats;

  const testimonials = [
    {
      name: "Dr. Aster Tadesse",
      role: "Alumni '15 & Surgeon",
      text: "The rigorous academic environment at Habucho laid the undeniable foundation for my medical career. The faculty truly invests in your future.",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Yared Melaku",
      role: "Current Senior (Grade 12)",
      text: "The new digital portal makes managing assignments and tracking my grades effortless. It's a massive upgrade to our daily workflow.",
      image: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Solomon Getachew",
      role: "Parent of Two",
      text: "Security, communication, and academic excellence. I have complete peace of mind knowing my children are receiving the best education in the region.",
      image: "https://i.pravatar.cc/150?img=12",
    },
  ];

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
            className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.1] mb-8 max-w-5xl"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.2s forwards', opacity: 0 }}
          >
            Empowering the Future of <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-500">
              Education
            </span>
          </h1>

          <p 
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mb-12 font-light leading-relaxed"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.4s forwards', opacity: 0 }}
          >
            Habucho Preparatory School blends academic rigor with cutting-edge technology to prepare students for top-tier universities.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.6s forwards', opacity: 0 }}
          >
            <Link 
              to="/login" 
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-emerald-400 rounded-full overflow-hidden group transition-all"
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
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all glass-panel rounded-full hover:bg-slate-800/80 hover:scale-105"
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
      <section className="py-24 bg-slate-950 relative border-t border-slate-900 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          TESTIMONIALS SECTION 
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-slate-950 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-emerald-900/10 filter blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-20">
            <h2 className="text-teal-400 font-semibold tracking-widest uppercase text-sm mb-3">Community Voices</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white">Don't just take our word for it</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 150} direction="up">
                <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative border border-slate-800 hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-2">
                  <div className="text-emerald-500/20 text-6xl font-serif absolute top-4 right-6 group-hover:text-emerald-500/40 transition-colors">"</div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full border-2 border-emerald-500/50 object-cover" />
                    <div>
                      <h4 className="text-white font-bold text-lg">{t.name}</h4>
                      <p className="text-teal-400 text-sm">{t.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 italic leading-relaxed grow text-lg">
                    {t.text}
                  </p>

                  <div className="flex gap-1 mt-6">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
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
