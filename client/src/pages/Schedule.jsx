/**
 * Schedule Page — Responsive timetable display
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import SkeletonLoader from "../components/SkeletonLoader";
import { getSchedules } from "../services/authService";
import { formatTime } from "../utils/helpers";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setSchedules([
            { id: 1, grade_level: "11", subject: "Mathematics", teacher_name: "Sarah Johnson", day: "Monday", start_time: "08:00:00", end_time: "09:30:00" },
            { id: 2, grade_level: "11", subject: "Physics", teacher_name: "Michael Chen", day: "Monday", start_time: "09:45:00", end_time: "11:15:00" },
            { id: 3, grade_level: "12", subject: "Biology", teacher_name: "Michael Chen", day: "Friday", start_time: "08:00:00", end_time: "09:30:00" },
          ]);
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
        subtitle="Weekly timetable for all grade levels"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-wrap gap-2">
          {["", "11", "12"].map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                gradeFilter === g
                  ? "bg-primary text-white shadow-md shadow-emerald-500/20"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:ring-slate-600"
              }`}
            >
              {g ? `Grade ${g}` : "All Grades"}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader count={5} type="table" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
                    <th className="px-5 py-4 font-semibold">Day</th>
                    <th className="px-5 py-4 font-semibold">Time</th>
                    <th className="px-5 py-4 font-semibold">Subject</th>
                    <th className="px-5 py-4 font-semibold">Teacher</th>
                    <th className="px-5 py-4 font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        No schedules found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, i) => (
                      <tr
                        key={s.id}
                        className={`border-b border-slate-100 transition-colors hover:bg-emerald-50/50 dark:border-slate-800 dark:hover:bg-emerald-950/20 ${
                          i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/80 dark:bg-slate-900/50"
                        }`}
                      >
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{s.day}</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">{s.subject}</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{s.teacher_name || "TBA"}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                            Grade {s.grade_level}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Schedule;
