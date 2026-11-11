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
    <div
      className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-md transition-all duration-500 hover:bg-slate-800/60"
      style={{ animation: `fade-in-up 0.8s ease-out ${delay}s forwards`, opacity: 0 }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <h3 className="z-10 mb-2 bg-linear-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-5xl font-black text-transparent tabular-nums drop-shadow-lg md:text-6xl">
        {display}
      </h3>
      <p className="z-10 text-sm font-medium tracking-[0.2em] text-slate-400 uppercase">{label}</p>
    </div>
  );
};

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeHomeSlide, setActiveHomeSlide] = useState(0);

  useEffect(() => {
    document.title = "Habucho Preparatory School - Home";
  }, []);

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useFetch(getPublicStats, []);

  const features = [
    {
      icon: BookOpen,
      title: "Elite Curriculum",
      desc: "Advanced placement tracks designed to guarantee university admission.",
      gradient: "from-emerald-400/20 to-teal-900/40",
    },
    {
      icon: FlaskConical,
      title: "Modern Labs",
      desc: "State-of-the-art facilities for physics, chemistry, and computer science.",
      gradient: "from-blue-400/20 to-indigo-900/40",
    },
    {
      icon: BarChart3,
      title: "Real-time Tracking",
      desc: "Instant access to grades, attendance, and academic analytics.",
      gradient: "from-violet-400/20 to-purple-900/40",
    },
    {
      icon: Monitor,
      title: "Digital Campus",
      desc: "Fully integrated digital ecosystem for assignments and resources.",
      gradient: "from-amber-400/20 to-orange-900/40",
    },
    {
      icon: ShieldCheck,
      title: "Secure Portal",
      desc: "Enterprise-grade security protecting all student and staff data.",
      gradient: "from-rose-400/20 to-red-900/40",
    },
    {
      icon: Users,
      title: "Active Community",
      desc: "Vibrant clubs, sports, and extracurricular networks.",
      gradient: "from-cyan-400/20 to-blue-900/40",
    },
  ];

  const stats = [
    { value: statsData?.students, label: "Students" },
    { value: statsData?.teachers, label: "Teachers" },
  ].filter((stat) => stat.value !== undefined && stat.value !== null);

  const homeSlides = [
    {
      src: aboutCampusImg,
      alt: "School building and grounds, shown as representative campus imagery",
      title: "A welcoming place to learn",
    },
    {
      src: collaborativeClassroomImg,
      alt: "Students learning together in a classroom, shown as representative imagery",
      title: "Learning together",
    },
    {
      src: classroomImg,
      alt: "Teacher supporting students in a classroom, shown as representative imagery",
      title: "Supportive classroom learning",
    },
    {
      src: campusImg,
      alt: "School campus building, shown as representative campus imagery",
      title: "A foundation for future growth",
    },
  ];

  const homeLearningFeatures = [
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "Build a strong foundation through focused learning and steady progress.",
      color: "bg-[#118b6b]",
    },
    {
      icon: Users,
      title: "Holistic Growth",
      description: "Develop knowledge, confidence, and character as part of a caring community.",
      color: "bg-[#0d795e]",
    },
    {
      icon: Monitor,
      title: "Connected Learning",
      description:
        "Use Habucho's digital portal to stay connected with learning and school progress.",
      color: "bg-[#09684f]",
    },
    {
      icon: GraduationCap,
      title: "Supportive Teachers",
      description:
        "Learn with guidance from educators who encourage students to reach their goals.",
      color: "bg-[#075640]",
    },
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
      image:
        "https://ui-avatars.com/api/?name=Sudi+Shemsedin&background=0d9488&color=fff&bold=true",
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

  const filteredTestimonials =
    activeCategory === "all"
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
                A strong foundation for <span>what&apos;s next</span>
              </h1>

              <p className="home-hero-description">
                Explore Habucho Preparatory School, learn about our community, and get in touch with
                the school about admissions.
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
                <Link
                  to="/gallery"
                  className="home-hero-secondary border-amber-400/40 text-amber-300 hover:text-white"
                >
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
        <section
          aria-labelledby="habucho-community-heading"
          className="relative overflow-hidden bg-[#f7f4ed] px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 grid overflow-hidden rounded-2xl border border-[#e7e0d2] bg-white shadow-[0_24px_70px_rgba(10,25,48,0.12)] sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Academic focus", "Strong foundations for the next step"],
                ["02", "Personal growth", "Confidence, curiosity, and character"],
                ["03", "School community", "Learning through connection and care"],
                ["04", "Future ready", "Skills to take on new opportunities"],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex items-center gap-4 border-b border-[#e7e0d2] px-5 py-5 last:border-b-0 sm:even:border-l lg:border-b-0 lg:border-l lg:first:border-l-0"
                >
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
                <div
                  className="absolute -bottom-4 -left-4 h-2/3 w-2/3 rounded-3xl bg-[#d5ad63]/20"
                  aria-hidden="true"
                />
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
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#98743c] uppercase">
                    Habucho Preparatory School
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#10233d]">
                    A place to learn and grow
                  </p>
                </div>
              </div>

              <div className="max-w-xl">
                <p className="text-xs font-bold tracking-[0.2em] text-[#98743c] uppercase">
                  The Habucho community
                </p>
                <h2
                  id="habucho-community-heading"
                  className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-[#10233d] sm:text-4xl lg:text-5xl"
                >
                  A community built around every student&apos;s potential.
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  At Habucho, learning is shaped by committed educators, a supportive school
                  community, and the belief that every student can build a bright future.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-[#263b55] sm:text-base">
                  {[
                    "A welcoming community that helps students thrive",
                    "A strong academic foundation for future goals",
                    "Learning that values curiosity and character",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#98743c]"
                        aria-hidden="true"
                      />
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
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="habucho-learning-heading"
          className="bg-[#f7f4ed] px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-[#98743c] uppercase">
                Habucho Preparatory School
              </p>
              <h2
                id="habucho-learning-heading"
                className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-[#10233d] sm:text-4xl lg:text-5xl"
              >
                Empowering Habucho students to build a brighter future
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                We support students with a strong academic foundation, opportunities to grow, and a
                school community that believes in their potential.
              </p>
              <Link
                to="/admissions"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b5544] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#0b5544]/15 transition-colors hover:bg-[#084535] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98743c]"
              >
                Explore admissions
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#061225]/85 via-[#061225]/40 to-transparent px-4 pt-14 pb-4 sm:px-7 sm:pb-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#f1d8a2] uppercase">
                    Habucho Preparatory School
                  </p>
                  <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                    {homeSlides[activeHomeSlide].title}
                  </p>
                  <p className="mt-1 text-xs text-white/75">Representative school imagery</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="Show previous school image"
                    onClick={() =>
                      setActiveHomeSlide(
                        (index) => (index - 1 + homeSlides.length) % homeSlides.length,
                      )
                    }
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

        <section
          aria-labelledby="school-stats-heading"
          className="relative z-10 border-t border-slate-900 bg-slate-950 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="school-stats-heading" className="sr-only">
              School at a glance
            </h2>
            {statsLoading ? (
              <div
                role="status"
                aria-label="Loading school figures"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
              >
                {[0, 1].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-36 flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/40 p-8"
                  >
                    <span className="skeleton h-12 w-28" />
                    <span className="skeleton mt-4 h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : stats.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {stats.map((stat, index) => (
                  <StatCounter
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            ) : (
              <p
                role={statsError ? "alert" : "status"}
                className="mx-auto max-w-2xl text-center text-sm text-slate-400"
              >
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
        <section className="relative overflow-hidden bg-slate-900 py-32">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[4rem_4rem] opacity-20"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-20 text-center">
              <h2 className="mb-3 text-sm font-semibold tracking-widest text-blue-400 uppercase">
                Why Choose Habucho
              </h2>
              <h3 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Engineered for Excellence
              </h3>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                We provide a holistic educational environment supported by modern infrastructure and
                digital tools.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 100}>
                  <div className="group glass-panel relative h-full overflow-hidden rounded-3xl border border-slate-700/50 p-8 transition-all duration-500 hover:border-emerald-500/30 hover:bg-slate-800/80">
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${f.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                    ></div>
                    <div className="relative z-10">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-3xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <f.icon className="h-7 w-7" aria-hidden="true" />
                      </div>
                      <h4 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                        {f.title}
                      </h4>
                      <p className="leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
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
        <section className="relative overflow-hidden border-t border-slate-900 bg-slate-950 py-32">
          {/* Glow ambient backgrounds */}
          <div className="pointer-events-none absolute top-1/3 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-r from-blue-500/10 via-teal-500/10 to-indigo-500/10 blur-[140px]"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-20 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-teal-300 uppercase">
                <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400"></span>
                Platform Capabilities & Features
              </div>
              <h2 className="mb-6 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                What Does This{" "}
                <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Portal Do?
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-slate-400 md:text-xl">
                Habucho Preparatory School's digital platform is an all-in-one Progressive Web
                Application (PWA) designed to automate, simplify, and elevate every aspect of school
                management and academic tracking.
              </p>
            </Reveal>

            {/* 3 Core Role Portals */}
            <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Student Hub */}
              <Reveal delay={100}>
                <div className="glass-panel group flex h-full flex-col rounded-3xl border border-slate-800 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/40 hover:shadow-[0_15px_40px_rgba(16,185,129,0.12)]">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-3xl transition-transform group-hover:scale-110">
                      <GraduationCap className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-blue-400 uppercase">
                      Student Portal
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-emerald-300">
                    For Students & Parents
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400">
                    Gives students 24/7 transparent access to their academic progress, schedules,
                    and official school records.
                  </p>
                  <ul className="mb-8 grow space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                      <span>
                        <strong>Live Gradebook & Scorecards:</strong> View semester assessments,
                        midterms, and final exam marks in real-time.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                      <span>
                        <strong>Instant PDF Report Cards:</strong> Download official, printable
                        student report cards with calculated ranks.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                      <span>
                        <strong>Interactive Timetables:</strong> Access weekly period schedules for
                        Grades 9-12 and streams.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                      <span>
                        <strong>Official Notice Board:</strong> Receive immediate school updates,
                        exam dates, and event broadcasts.
                      </span>
                    </li>
                  </ul>
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-semibold text-blue-400">
                    <span>Self-service Academic Hub</span>
                    <span>Fast and Mobile-Ready</span>
                  </div>
                </div>
              </Reveal>

              {/* Teacher Hub */}
              <Reveal delay={200}>
                <div className="glass-panel group flex h-full flex-col rounded-3xl border border-slate-800 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-teal-500/40 hover:shadow-[0_15px_40px_rgba(20,184,166,0.12)]">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/10 text-3xl transition-transform group-hover:scale-110">
                      <Users className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-400 uppercase">
                      Teacher Suite
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-teal-300">
                    For Teachers & Faculty
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400">
                    Eliminates paperwork with lightning-fast digital grade entry, roster management,
                    and performance insights.
                  </p>
                  <ul className="mb-8 grow space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                      <span>
                        <strong>Fast Score Entry:</strong> Input marks for quizzes, tests, projects,
                        and final exams with one click.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                      <span>
                        <strong>Automatic Computation:</strong> Instant calculation of totals,
                        semester averages, rankings, and pass/fail statuses.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                      <span>
                        <strong>Assigned Class Management:</strong> Filter and manage students by
                        grade, section, and subject track.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                      <span>
                        <strong>Teaching Schedule:</strong> Personal teaching timetables accessible
                        from any device.
                      </span>
                    </li>
                  </ul>
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-semibold text-teal-400">
                    <span>Automated Grading Suite</span>
                    <span>Paperless Workflow</span>
                  </div>
                </div>
              </Reveal>

              {/* Admin Hub */}
              <Reveal delay={300}>
                <div className="glass-panel group flex h-full flex-col rounded-3xl border border-slate-800 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)]">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-3xl transition-transform group-hover:scale-110">
                      <Briefcase className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 uppercase">
                      Admin Command
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan-300">
                    For School Leadership
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400">
                    Complete centralized control over school records, user privileges, academic
                    analytics, and school communications.
                  </p>
                  <ul className="mb-8 grow space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                      <span>
                        <strong>User Account Management:</strong> Create, manage, and verify
                        student, teacher, and administrator accounts.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                      <span>
                        <strong>Class & Stream Allocations:</strong> Assign teachers to sections and
                        organize Natural/Social science tracks.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                      <span>
                        <strong>Central Announcement Dispatch:</strong> Broadcast high-priority
                        alerts with category badges school-wide.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                      <span>
                        <strong>School Analytics & Security:</strong> Monitor enrollment figures,
                        academic averages, and audit access logs.
                      </span>
                    </li>
                  </ul>
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-semibold text-cyan-400">
                    <span>Central Operations Control</span>
                    <span>Full Institutional Visibility</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* 4 Core Technology Pillars */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl md:p-12">
              <h4 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
                Core Technologies Powering the Platform
              </h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="group rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 transition-all hover:border-emerald-500/30">
                  <Zap className="mb-4 h-8 w-8 text-amber-400" aria-hidden="true" />
                  <h5 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-blue-400">
                    Offline-Ready PWA
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Installable on phones, tablets, and laptops. Caches key schedules and scorecards
                    for offline viewing even without internet.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 transition-all hover:border-teal-500/30">
                  <FileText className="mb-4 h-8 w-8 text-teal-400" aria-hidden="true" />
                  <h5 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-teal-400">
                    Auto PDF Transcripts
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Instantly compiles marks into official, formatted PDF report cards ready for
                    print, parent distribution, or university applications.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 transition-all hover:border-cyan-500/30">
                  <BarChart3 className="mb-4 h-8 w-8 text-cyan-400" aria-hidden="true" />
                  <h5 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-cyan-400">
                    Intelligent Ranking
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Automated computation algorithms sort class percentiles, total point averages,
                    and rank standings without manual errors.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 transition-all hover:border-indigo-500/30">
                  <Lock className="mb-4 h-8 w-8 text-indigo-400" aria-hidden="true" />
                  <h5 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-indigo-400">
                    Protected & Encrypted
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-400">
                    JWT-authenticated sessions and role-guard middleware safeguard all student
                    records, passwords, and sensitive exam marks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
          TESTIMONIALS SECTION 
      Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <section className="relative bg-slate-950 py-32">
          <div className="pointer-events-none absolute top-1/2 left-0 h-full w-1/3 -translate-y-1/2 rounded-full bg-emerald-900/10 blur-[120px] filter"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-12 text-center">
              <h2 className="mb-3 text-sm font-semibold tracking-widest text-teal-400 uppercase">
                Student Voices & Elite Alumni
              </h2>
              <h3 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Inspiring Journeys & Achievements
              </h3>
              <p className="mx-auto max-w-2xl text-base text-slate-400">
                Discover stories from Habucho's proud university scholars, medical students,
                engineering pioneers, and industry leaders.
              </p>
            </Reveal>

            {/* Category Filter Tabs */}
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              {[
                { id: "all", label: "All Achievers", count: testimonials.length, icon: Star },
                {
                  id: "scholars",
                  label: "University Scholars",
                  count: testimonials.filter((t) => t.category === "scholars").length,
                  icon: GraduationCap,
                },
                {
                  id: "elite",
                  label: "Industry & Banking Leaders",
                  count: testimonials.filter((t) => t.category === "elite").length,
                  icon: Briefcase,
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "scale-105 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                      : "border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <cat.icon className="h-4 w-4" aria-hidden="true" />
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTestimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 150} direction="up">
                  <div className="glass-panel group relative flex h-full flex-col rounded-3xl border border-slate-800 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-teal-500/40 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]">
                    <div className="pointer-events-none absolute top-4 right-6 font-serif text-6xl text-emerald-500/20 transition-colors group-hover:text-emerald-500/40">
                      "
                    </div>

                    <div className="mb-6 flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={t.image}
                          alt={t.name}
                          width="64"
                          height="64"
                          loading="lazy"
                          decoding="async"
                          className="h-16 w-16 rounded-2xl border-2 border-emerald-500/60 object-cover shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-teal-400"
                        />
                        <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg leading-tight font-bold text-white transition-colors group-hover:text-emerald-300">
                            {t.name}
                          </h4>
                          {t.badge && (
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-blue-400 uppercase">
                              {t.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-snug font-medium text-teal-400">
                          {t.role}
                        </p>
                      </div>
                    </div>

                    <p className="grow text-base leading-relaxed text-slate-300 italic">
                      "{t.text}"
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="h-4 w-4 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      {t.portfolio && (
                        <a
                          href={t.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-all duration-200 hover:bg-emerald-500 hover:text-slate-950 hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                          <span>Portfolio</span>
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
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
        <section className="relative overflow-hidden border-t border-slate-800 bg-slate-900 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950"></div>

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="mb-6 text-5xl font-black text-white md:text-6xl">
                Ready to Shape Your <span className="text-blue-400">Future?</span>
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-400">
                Learn more about the school or sign in to the student and staff portal to view
                grades, schedules, and announcements.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/login"
                  className="rounded-full bg-emerald-500 px-10 py-5 text-lg font-bold text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:bg-emerald-400"
                >
                  Student & Staff Portal
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-slate-600 bg-slate-800 px-10 py-5 text-lg font-bold text-white transition-all hover:border-slate-500 hover:bg-slate-700"
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
