import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  FlaskConical,
  GraduationCap,
  Lock,
  Monitor,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import useFetch from "../hooks/useFetch";
import { getPublicStats } from "../services/publicService";
import classroomImg from "../Images/about-classroom.webp";
import aboutCampusImg from "../Images/about-campus.webp";
import collaborativeClassroomImg from "../Images/NAxYCGkrrCcJo__YuGjKdq_161NaTbpIZZwr3hc30SNUBQOGJ2l3FpQVJSknWS6GuyY7JuwtmXPT6coDe_blPsJG05ohqBW5ENnsykjgySw7XG5CbFkYtZLbQcqIWGOnmKka_rnZwGoCFGfWPZtGqlxePER-_eyq-mojSmHZC5bSSR8xj.jpg";
import campusImg from "../Images/6qyj6zYI2n_DY-8a45W37sE_ZQtqHZQhV3sXjM_SV-i7gt7D1TbfWIyyEXx64X3FlBS3NdOeTe4Curnt4SJaisZ2WAczAE1fnmj_Crz6JRpgm5KUKzr1OWLTF0DzG6jNBGPjb14CF8hntMUWhGQe4vckkacS6pXABdFWCjMlk_2u0KQjbc0hg2tIiPNDkYUy.jpg";

import kenenisaImg from "../Images/photo_2026-08-17_07-41-04.jpg";
import nurelayImg from "../Images/photo_2026-08-17_07-40-50.jpg";
import bezabihImg from "../Images/photo_2026-08-17_07-40-20.jpg";
import ibrahimImg from "../Images/photo_2026-08-17_07-40-43.jpg";
import fatiImg from "../Images/photo_2026-08-17_08-21-22.jpg";
import kelilImg from "../Images/photo_2026-08-17_08-21-12.jpg";
import abdelaImg from "../Images/photo_2026-08-17_08-21-12 (2).jpg";
import aliyiImg from "../Images/photo_2026-08-17_08-21-55.jpg";

const StatCounter = ({ value, label, delay }) => {
  const numericValue = String(value).match(/^([\d,]+)(.*)$/);
  const display = numericValue
    ? `${new Intl.NumberFormat("en-US").format(Number(numericValue[1].replace(/,/g, "")))}${numericValue[2]}`
    : value;
  return (
    <div className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md overflow-hidden hover:bg-slate-800/60 transition-all duration-500" style={{ animation: `fade-in-up 0.8s ease-out ${delay}s forwards`, opacity: 0 }}>
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-sky-300 to-amber-300 tabular-nums z-10 mb-2 drop-shadow-lg">
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
  const [activeHomeSlide, setActiveHomeSlide] = useState(0);

  useEffect(() => {
    document.title = "Habucho Preparatory School - Home";
  }, []);

  const { data: statsData, loading: statsLoading, error: statsError } = useFetch(getPublicStats, []);

  const features = [
    { icon: BookOpen, title: "Elite Curriculum", desc: "Advanced placement tracks designed to guarantee university admission.", gradient: "from-emerald-400/20 to-teal-900/40" },
    { icon: FlaskConical, title: "Modern Labs", desc: "State-of-the-art facilities for physics, chemistry, and computer science.", gradient: "from-blue-400/20 to-indigo-900/40" },
    { icon: BarChart3, title: "Real-time Tracking", desc: "Instant access to grades, attendance, and academic analytics.", gradient: "from-violet-400/20 to-purple-900/40" },
    { icon: Monitor, title: "Digital Campus", desc: "Fully integrated digital ecosystem for assignments and resources.", gradient: "from-amber-400/20 to-orange-900/40" },
    { icon: ShieldCheck, title: "Secure Portal", desc: "Enterprise-grade security protecting all student and staff data.", gradient: "from-rose-400/20 to-red-900/40" },
    { icon: Users, title: "Active Community", desc: "Vibrant clubs, sports, and extracurricular networks.", gradient: "from-cyan-400/20 to-blue-900/40" },
  ];

  const stats = [
    { value: statsData?.students, label: "Students" },
    { value: statsData?.teachers, label: "Teachers" },
  ].filter((stat) => stat.value !== undefined && stat.value !== null);

  const homeSlides = [
    { src: aboutCampusImg, alt: "School building and grounds, shown as representative campus imagery", title: "A welcoming place to learn" },
    { src: collaborativeClassroomImg, alt: "Students learning together in a classroom, shown as representative imagery", title: "Learning together" },
    { src: classroomImg, alt: "Teacher supporting students in a classroom, shown as representative imagery", title: "Supportive classroom learning" },
    { src: campusImg, alt: "School campus building, shown as representative campus imagery", title: "A foundation for future growth" },
  ];

  const homeLearningFeatures = [
    { icon: BookOpen, title: "Academic Excellence", description: "Build a strong foundation through focused learning and steady progress.", color: "bg-[#118b6b]" },
    { icon: Users, title: "Holistic Growth", description: "Develop knowledge, confidence, and character as part of a caring community.", color: "bg-[#0d795e]" },
    { icon: Monitor, title: "Connected Learning", description: "Use Habucho's digital portal to stay connected with learning and school progress.", color: "bg-[#09684f]" },
    { icon: GraduationCap, title: "Supportive Teachers", description: "Learn with guidance from educators who encourage students to reach their goals.", color: "bg-[#075640]" },
  ];

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
      <div className="home-page">
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

      {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
          HERO SECTION 
      Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="home-hero relative isolate overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-20 lg:min-h-[calc(100svh-4.25rem)] lg:py-14">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-hero-grid relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-8">
          <div className="home-hero-copy">
            <div className="home-hero-badge">
              <span className="home-hero-pulse" aria-hidden="true" />
              <span>HABUCHO PREPARATORY SCHOOL</span>
            </div>

            <h1 className="home-hero-title">
              A strong foundation for{" "}
              <span>what&apos;s next</span>
            </h1>

            <p className="home-hero-description">
              Explore Habucho Preparatory School, learn about our community, and
              get in touch with the school about admissions.
            </p>

            <div className="home-hero-actions flex-wrap gap-3">
              <Link to="/admissions" className="home-hero-primary shadow-lg shadow-blue-500/25">
                Apply for Admission
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <Link to="/about" className="home-hero-secondary">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m10 8 6 4-6 4V8Z" />
                </svg>
                About Our School
              </Link>
              <Link to="/gallery" className="home-hero-secondary border-amber-400/40 text-amber-300 hover:text-white">
                Campus Gallery
              </Link>
            </div>
          </div>

          <div className="home-hero-visual" aria-label="Illustrative classroom and school images">
            <div className="home-hero-image home-hero-image-main">
              <img
                src={collaborativeClassroomImg}
                alt="Students learning together in a classroom"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <p className="absolute bottom-3 left-3 z-10 rounded-full bg-slate-950/75 px-3 py-1 text-xs text-slate-200 backdrop-blur">
              Representative imagery
            </p>
            <div className="home-hero-image home-hero-image-detail">
              <img
                src={classroomImg}
                alt="Students and a teacher working together in a classroom"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="home-hero-image home-hero-image-campus">
              <img
                src={campusImg}
                alt="A school building and its grounds, shown as representative campus imagery"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
          STATS SECTION 
      Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section aria-labelledby="habucho-community-heading" className="relative overflow-hidden bg-[#f7f4ed] px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 grid overflow-hidden rounded-2xl border border-[#e7e0d2] bg-white shadow-[0_24px_70px_rgba(10,25,48,0.12)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Academic focus", "Strong foundations for the next step"],
              ["02", "Personal growth", "Confidence, curiosity, and character"],
              ["03", "School community", "Learning through connection and care"],
              ["04", "Future ready", "Skills to take on new opportunities"],
            ].map(([number, title, description]) => (
              <div key={number} className="flex items-center gap-4 border-b border-[#e7e0d2] px-5 py-5 last:border-b-0 sm:even:border-l lg:border-b-0 lg:border-l lg:first:border-l-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3efe5] text-sm font-bold text-[#98743c]">
                  {number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#10233d]">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid items-center gap-10 pt-14 sm:pt-20 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 h-2/3 w-2/3 rounded-3xl bg-[#d5ad63]/20" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-3xl border border-[#e7e0d2] bg-[#10233d] shadow-[0_24px_60px_rgba(10,25,48,0.18)]">
                <img
                  src={aboutCampusImg}
                  alt="School building and grounds, shown as representative campus imagery"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -right-3 bottom-5 rounded-xl border border-white/60 bg-white/95 px-4 py-3 shadow-lg sm:right-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#98743c]">Habucho Preparatory School</p>
                <p className="mt-1 text-sm font-semibold text-[#10233d]">A place to learn and grow</p>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#98743c]">The Habucho community</p>
              <h2 id="habucho-community-heading" className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#10233d] sm:text-4xl lg:text-5xl">
                A community built around every student&apos;s potential.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                At Habucho, learning is shaped by committed educators, a supportive school community, and the belief that every student can build a bright future.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#263b55] sm:text-base">
                {["A welcoming community that helps students thrive", "A strong academic foundation for future goals", "Learning that values curiosity and character"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#98743c]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#10233d] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1b3555] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98743c]"
              >
                Discover our school
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="habucho-learning-heading" className="bg-[#f7f4ed] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#98743c]">Habucho Preparatory School</p>
            <h2 id="habucho-learning-heading" className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#10233d] sm:text-4xl lg:text-5xl">
              Empowering Habucho students to build a brighter future
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              We support students with a strong academic foundation, opportunities to grow, and a school community that believes in their potential.
            </p>
            <Link
              to="/admissions"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b5544] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#0b5544]/15 transition-colors hover:bg-[#084535] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98743c]"
            >
              Explore admissions
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-[#e7e0d2] bg-[#10233d] shadow-[0_24px_60px_rgba(10,25,48,0.18)] sm:mt-12">
            <img
              src={homeSlides[activeHomeSlide].src}
              alt={homeSlides[activeHomeSlide].alt}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/7]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#061225]/85 via-[#061225]/40 to-transparent px-4 pb-4 pt-14 sm:px-7 sm:pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f1d8a2]">Habucho Preparatory School</p>
                <p className="mt-1 text-base font-semibold text-white sm:text-lg">{homeSlides[activeHomeSlide].title}</p>
                <p className="mt-1 text-xs text-white/75">Representative school imagery</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label="Show previous school image"
                  onClick={() => setActiveHomeSlide((index) => (index - 1 + homeSlides.length) % homeSlides.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#0b5544] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d8a2]"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Show next school image"
                  onClick={() => setActiveHomeSlide((index) => (index + 1) % homeSlides.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#0b5544] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d8a2]"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(10,25,48,0.12)] sm:grid-cols-2 lg:grid-cols-4">
            {homeLearningFeatures.map(({ icon: Icon, title, description, color }) => (
              <article key={title} className={`${color} min-h-48 px-5 py-6 text-white sm:px-6`}>
                <Icon className="h-7 w-7 text-[#f1d8a2]" strokeWidth={1.8} aria-hidden="true" />
                <h3 className="mt-5 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/80">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="school-stats-heading" className="relative z-10 border-t border-slate-900 bg-slate-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="school-stats-heading" className="sr-only">School at a glance</h2>
          {statsLoading ? (
            <div role="status" aria-label="Loading school figures" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {[0, 1].map((item) => (
                <div key={item} className="flex min-h-36 flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/40 p-8">
                  <span className="skeleton h-12 w-28" />
                  <span className="skeleton mt-4 h-4 w-24" />
                </div>
              ))}
            </div>
          ) : stats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {stats.map((stat, index) => (
                <StatCounter key={stat.label} value={stat.value} label={stat.label} delay={index * 0.1} />
              ))}
            </div>
          ) : (
            <p role={statsError ? "alert" : "status"} className="mx-auto max-w-2xl text-center text-sm text-slate-400">
              {statsError
                ? "Current school figures are temporarily unavailable. Please contact the school for the latest information."
                : "School figures will appear here when available."}
            </p>
          )}
        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
          FEATURES SECTION 
      Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-20">
            <h2 className="text-blue-400 font-semibold tracking-widest uppercase text-sm mb-3">Why Choose Habucho</h2>
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
                      <f.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{f.title}</h4>
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

      {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
          WHAT THIS WEBSITE DOES / PLATFORM CAPABILITIES SECTION 
      Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="py-32 bg-slate-950 relative overflow-hidden border-t border-slate-900">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-200 h-125 bg-linear-to-r from-blue-500/10 via-teal-500/10 to-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

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
                    <GraduationCap className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-blue-400 border border-emerald-500/20">
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                    <span><strong>Live Gradebook & Scorecards:</strong> View semester assessments, midterms, and final exam marks in real-time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                    <span><strong>Instant PDF Report Cards:</strong> Download official, printable student report cards with calculated ranks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                    <span><strong>Interactive Timetables:</strong> Access weekly period schedules for Grades 9-12 and streams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                    <span><strong>Official Notice Board:</strong> Receive immediate school updates, exam dates, and event broadcasts.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                  <span>Self-service Academic Hub</span>
                  <span>Fast and Mobile-Ready</span>
                </div>
              </div>
            </Reveal>

            {/* Teacher Hub */}
            <Reveal delay={200}>
              <div className="glass-panel rounded-3xl p-8 h-full flex flex-col border border-slate-800 hover:border-teal-500/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(20,184,166,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7" aria-hidden="true" />
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                    <span><strong>Fast Score Entry:</strong> Input marks for quizzes, tests, projects, and final exams with one click.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                    <span><strong>Automatic Computation:</strong> Instant calculation of totals, semester averages, rankings, and pass/fail statuses.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                    <span><strong>Assigned Class Management:</strong> Filter and manage students by grade, section, and subject track.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                    <span><strong>Teaching Schedule:</strong> Personal teaching timetables accessible from any device.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-400 font-semibold">
                  <span>Automated Grading Suite</span>
                  <span>Paperless Workflow</span>
                </div>
              </div>
            </Reveal>

            {/* Admin Hub */}
            <Reveal delay={300}>
              <div className="glass-panel rounded-3xl p-8 h-full flex flex-col border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    <Briefcase className="h-7 w-7" aria-hidden="true" />
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                    <span><strong>User Account Management:</strong> Create, manage, and verify student, teacher, and administrator accounts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                    <span><strong>Class & Stream Allocations:</strong> Assign teachers to sections and organize Natural/Social science tracks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                    <span><strong>Central Announcement Dispatch:</strong> Broadcast high-priority alerts with category badges school-wide.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                    <span><strong>School Analytics & Security:</strong> Monitor enrollment figures, academic averages, and audit access logs.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span>Central Operations Control</span>
                  <span>Full Institutional Visibility</span>
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
                <Zap className="mb-4 h-8 w-8 text-amber-400" aria-hidden="true" />
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">Offline-Ready PWA</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Installable on phones, tablets, and laptops. Caches key schedules and scorecards for offline viewing even without internet.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/30 transition-all group">
                <FileText className="mb-4 h-8 w-8 text-teal-400" aria-hidden="true" />
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-teal-400 transition-colors">Auto PDF Transcripts</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Instantly compiles marks into official, formatted PDF report cards ready for print, parent distribution, or university applications.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all group">
                <BarChart3 className="mb-4 h-8 w-8 text-cyan-400" aria-hidden="true" />
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">Intelligent Ranking</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Automated computation algorithms sort class percentiles, total point averages, and rank standings without manual errors.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all group">
                <Lock className="mb-4 h-8 w-8 text-indigo-400" aria-hidden="true" />
                <h5 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">Protected & Encrypted</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  JWT-authenticated sessions and role-guard middleware safeguard all student records, passwords, and sensitive exam marks.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
          TESTIMONIALS SECTION 
      Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
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
              { id: "all", label: "All Achievers", count: testimonials.length, icon: Star },
              { id: "scholars", label: "University Scholars", count: testimonials.filter((t) => t.category === "scholars").length, icon: GraduationCap },
              { id: "elite", label: "Industry & Banking Leaders", count: testimonials.filter((t) => t.category === "elite").length, icon: Briefcase },
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
                <cat.icon className="h-4 w-4" aria-hidden="true" />
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
                        width="64"
                        height="64"
                        loading="lazy"
                        decoding="async"
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
                          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-blue-400 border border-emerald-500/20">
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

      {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
          CTA SECTION 
      Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="py-24 relative overflow-hidden bg-slate-900 border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Shape Your <span className="text-blue-400">Future?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Learn more about the school or sign in to the student and staff portal to view grades, schedules, and announcements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
              >
                Student & Staff Portal
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

      </div>
    </MainLayout>
  );
};

export default Home;
