import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight,
  Atom,
  Globe2,
  Cpu,
  Calculator,
  Compass,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SkeletonLoader from "../components/SkeletonLoader";
import useFetch from "../hooks/useFetch";
import { getAcademicPrograms } from "../services/publicService";

const FALLBACK_PROGRAMS = [
  {
    id: 1,
    name: "Natural Sciences & Pre-Medicine Track",
    category: "Science",
    description:
      "An intensive curriculum designed for aspiring doctors, researchers, and biotech pioneers. Covers advanced physics, organic chemistry, cellular biology, and college-prep calculus with hands-on modern lab experiments.",
    icon: Atom,
    highlights: [
      "Advanced Chemistry & Physics Labs",
      "National Olympiad Coaching",
      "Research Methodology",
    ],
  },
  {
    id: 2,
    name: "STEM, Mathematics & Computing Track",
    category: "Technology",
    description:
      "Tailored for future software architects, engineers, and data scientists. Features algorithmic problem solving, calculus, digital logic, and foundational programming in Python and web technologies.",
    icon: Cpu,
    highlights: ["Coding & Robotics Lab", "Applied Mathematics", "Engineering Project Defense"],
  },
  {
    id: 3,
    name: "Social Sciences & Global Economics Track",
    category: "Social Studies",
    description:
      "A prestigious stream preparing students for careers in law, international relations, business, and policy. Explores macro-economics, political philosophy, modern world history, and academic rhetoric.",
    icon: Globe2,
    highlights: [
      "Model United Nations Prep",
      "Economic Policy Analysis",
      "Advanced Debate Seminars",
    ],
  },
  {
    id: 4,
    name: "Advanced Applied Mathematics Track",
    category: "Mathematics",
    description:
      "Rigorous analytical preparation in discrete mathematics, probability, calculus, and matrix algebra for students aiming for competitive entrance exams and university engineering programs.",
    icon: Calculator,
    highlights: ["College-Level Calculus", "Statistical Modeling", "Competitive Math Prep"],
  },
  {
    id: 5,
    name: "Languages & Humanities Honors Track",
    category: "Humanities",
    description:
      "Fosters critical inquiry, creative expression, and global communication through deep analysis of literature, academic writing, cross-cultural studies, and secondary modern languages.",
    icon: Compass,
    highlights: ["Literary Analysis", "Scholarly Essay Writing", "Public Speaking"],
  },
];

const Academics = () => {
  const { data: programs, loading, error, execute } = useFetch(getAcademicPrograms);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const displayPrograms =
    Array.isArray(programs) && programs.length > 0 ? programs : FALLBACK_PROGRAMS;

  const categories = ["All", ...new Set(displayPrograms.map((p) => p.category || "General"))];

  const filteredPrograms =
    selectedCategory === "All"
      ? displayPrograms
      : displayPrograms.filter((p) => (p.category || "General") === selectedCategory);

  return (
    <MainLayout>
      <PageHeader
        badge="ACADEMIC EXCELLENCE"
        title="Curriculum & Programs"
        subtitle="Rigorous university-preparatory academics designed to nurture critical thinking, scientific curiosity, and leadership for Grades 11 and 12."
      />

      {/* Metrics Banner */}
      <section className="border-y border-slate-200/80 bg-white py-8 dark:border-slate-800/80 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            <div className="p-4">
              <div className="font-display text-primary text-3xl font-extrabold dark:text-blue-400">
                98.8%
              </div>
              <p className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                University Entrance Rate
              </p>
            </div>
            <div className="p-4">
              <div className="font-display text-3xl font-extrabold text-amber-500">1:15</div>
              <p className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Teacher-Student Ratio
              </p>
            </div>
            <div className="p-4">
              <div className="font-display text-primary text-3xl font-extrabold dark:text-blue-400">
                100%
              </div>
              <p className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Accredited Faculty
              </p>
            </div>
            <div className="p-4">
              <div className="font-display text-3xl font-extrabold text-emerald-500">24+</div>
              <p className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Advanced Electives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Program Catalog */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="section-label">GRADES 11 & 12 PATHWAYS</span>
              <h2 className="section-title">Specialized Academic Streams</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                Choose a targeted academic stream matched to your future university degree and
                career ambitions.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card p-6">
                  <SkeletonLoader className="mb-4 h-6 w-3/4" />
                  <SkeletonLoader className="mb-2 h-4 w-full" />
                  <SkeletonLoader className="mb-4 h-4 w-5/6" />
                  <SkeletonLoader className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error && (!displayPrograms || displayPrograms.length === 0) ? (
            <div className="card py-12 text-center">
              <p className="mb-4 text-sm text-red-500">{error}</p>
              <button onClick={() => execute()} className="btn-primary">
                Retry Loading
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program, idx) => (
                <Reveal key={program.id || idx} delay={idx * 0.1}>
                  <div className="card card-hover group flex h-full flex-col justify-between border border-slate-200/80 bg-white p-7 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900">
                    <div>
                      {/* Category Badge & Icon */}
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-primary rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-bold dark:bg-blue-400/15 dark:text-blue-300">
                          {program.category || "Preparatory Track"}
                        </span>
                        <div className="group-hover:bg-primary flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:text-white dark:bg-slate-800 dark:text-slate-300">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      </div>

                      <h3 className="font-display group-hover:text-primary text-xl font-bold tracking-tight text-slate-900 transition-colors dark:text-white dark:group-hover:text-blue-400">
                        {program.name}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {program.description}
                      </p>

                      {program.highlights && (
                        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800/60">
                          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                            Key Focus Areas
                          </p>
                          <ul className="space-y-1.5">
                            {program.highlights.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                              >
                                <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800/60">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Grade 11 & 12 Enrolled
                      </span>
                      <Link
                        to="/admissions"
                        className="text-primary inline-flex items-center gap-1 text-xs font-bold transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <span>Apply for Track</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-sm">
            <Award className="h-4 w-4 text-amber-400" />
            Admissions for 2026/2027 Academic Year Are Now Open
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Begin Your Preparatory Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Submit your application online in under 5 minutes, upload transcripts, and track your
            admission status instantly with your unique reference code.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/admissions"
              className="btn-primary px-6 py-3 text-sm shadow-lg shadow-blue-500/30"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Apply Online Now
            </Link>
            <Link
              to="/contact"
              className="btn-outline border-white/20 px-6 py-3 text-sm text-white hover:bg-white/10"
            >
              Contact Academic Counseling
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Academics;
