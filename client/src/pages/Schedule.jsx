/**
 * Schedule Page — Toggle between table and card view,
 * color-coded days, grade filters, and animated layout
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import SkeletonLoader from "../components/SkeletonLoader";
import { getSchedules } from "../services/authService";
import { formatTime } from "../utils/helpers";

const MOCK_SCHEDULES = [
  { id: 1, grade_level: "11", subject: "Mathematics", teacher_name: "Sarah Johnson", day: "Monday", start_time: "08:00:00", end_time: "09:30:00" },
  { id: 2, grade_level: "11", subject: "Physics", teacher_name: "Michael Chen", day: "Monday", start_time: "09:45:00", end_time: "11:15:00" },
  { id: 3, grade_level: "12", subject: "Biology", teacher_name: "Dr. Lemma", day: "Tuesday", start_time: "08:00:00", end_time: "09:30:00" },
  { id: 4, grade_level: "11", subject: "English", teacher_name: "Tigist Alemu", day: "Wednesday", start_time: "10:00:00", end_time: "11:30:00" },
  { id: 5, grade_level: "12", subject: "Chemistry", teacher_name: "Michael Chen", day: "Thursday", start_time: "08:00:00", end_time: "09:30:00" },
  { id: 6, grade_level: "11", subject: "History", teacher_name: "Abebe Worku", day: "Friday", start_time: "11:00:00", end_time: "12:30:00" },
];

const dayColors = {
  Monday:    { bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-400",    border: "border-blue-200 dark:border-blue-800" },
  Tuesday:   { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800" },
  Wednesday: { bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-400",  border: "border-amber-200 dark:border-amber-800" },
  Thursday:  { bg: "bg-rose-100 dark:bg-rose-900/30",    text: "text-rose-700 dark:text-rose-400",    border: "border-rose-200 dark:border-rose-800" },
  Friday:    { bg: "bg-teal-100 dark:bg-teal-900/30",    text: "text-teal-700 dark:text-teal-400",    border: "border-teal-200 dark:border-teal-800" },
};

const subjectIcons = {
  Mathematics: "🔢", Physics: "⚛️", Biology: "🧬", Chemistry: "🧪",
  English: "📖", History: "📜", Geography: "🌍", default: "📚",
};

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" | "card"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setSchedules(MOCK_SCHEDULES);
          setLoading(false);
          return;
        }
        const params = { limit: 50 };
        if (gradeFilter) params.grade_level = gradeFilter;
        const res = await getSchedules(params);
        setSchedules(res.data.data.schedules);
      } catch {
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [gradeFilter]);

  const filtered = gradeFilter
    ? schedules.filter((s) => s.grade_level === gradeFilter)
    : schedules;

  return (
    <MainLayout>
      <PageHeader
        badge="Timetable"
        title="Class Schedule"
        subtitle="Weekly timetable for all grade levels — organized and easy to read"
      />

      <section className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        {/* Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Grade filter */}
          <div className="flex flex-wrap gap-2">
            {[{ val: "", label: "All Grades", icon: "📋" }, { val: "11", label: "Grade 11", icon: "1️⃣" }, { val: "12", label: "Grade 12", icon: "2️⃣" }].map((g) => (
              <button
                key={g.val}
                onClick={() => setGradeFilter(g.val)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  gradeFilter === g.val
                    ? "bg-primary text-white shadow-md shadow-emerald-500/20"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:ring-slate-600"
                }`}
              >
                {g.icon} {g.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { mode: "table", icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18" />
                </svg>
              )},
              { mode: "card", icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )},
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                  viewMode === mode
                    ? "bg-white text-primary shadow-sm dark:bg-slate-700 dark:text-emerald-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                aria-label={`${mode} view`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={5} type="table" />
        ) : filtered.length === 0 ? (
          <div className="card py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl dark:bg-slate-800">
              📅
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">No schedules found</h3>
            <p className="mt-2 text-slate-500">Try changing the grade filter.</p>
          </div>
        ) : viewMode === "table" ? (
          /* ── TABLE VIEW ── */
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #059669, #047857)" }} className="text-white">
                    <th className="px-5 py-4 font-semibold">Day</th>
                    <th className="px-5 py-4 font-semibold">Time</th>
                    <th className="px-5 py-4 font-semibold">Subject</th>
                    <th className="px-5 py-4 font-semibold">Teacher</th>
                    <th className="px-5 py-4 font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const dc = dayColors[s.day] || dayColors.Monday;
                    return (
                      <tr
                        key={s.id}
                        className={`border-b border-slate-100 transition-colors hover:bg-emerald-50/50 dark:border-slate-800 dark:hover:bg-emerald-950/20 ${
                          i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/80 dark:bg-slate-900/50"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <span className={`rounded-lg px-3 py-1 text-xs font-bold ${dc.bg} ${dc.text}`}>
                            {s.day}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                            <span>{subjectIcons[s.subject] || subjectIcons.default}</span>
                            {s.subject}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{s.teacher_name || "TBA"}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                            Grade {s.grade_level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ── CARD VIEW ── */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, i) => {
              const dc = dayColors[s.day] || dayColors.Monday;
              return (
                <div
                  key={s.id}
                  className="group card card-hover relative overflow-hidden"
                  style={{ animation: `scale-in 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 50}ms both` }}
                >
                  {/* Day color bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${dc.bg}`} />
                  <div className="pt-2">
                    <div className="mb-4 flex items-start justify-between">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${dc.bg} ${dc.text} ${dc.border}`}>
                        {s.day}
                      </span>
                      <span className="text-2xl">{subjectIcons[s.subject] || subjectIcons.default}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {s.subject}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {s.teacher_name || "TBA"}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(s.start_time)} – {formatTime(s.end_time)}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        Gr. {s.grade_level}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Schedule;
