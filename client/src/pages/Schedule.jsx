/**
 * Schedule Page — Responsive timetable display
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import SkeletonLoader from "../components/SkeletonLoader";
import { getSchedules } from "../services/authService";
import { formatTime } from "../utils/helpers";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
      <section className="bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <p className="mt-2 text-blue-100">Weekly timetable for all grade levels</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex gap-2">
          {["", "11", "12"].map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                gradeFilter === g
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {g ? `Grade ${g}` : "All Grades"}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader count={5} type="table" />
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No schedules found
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr
                      key={s.id}
                      className={`border-b dark:border-gray-700 ${
                        i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{s.day}</td>
                      <td className="px-4 py-3">{formatTime(s.start_time)} – {formatTime(s.end_time)}</td>
                      <td className="px-4 py-3">{s.subject}</td>
                      <td className="px-4 py-3">{s.teacher_name || "TBA"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Grade {s.grade_level}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Schedule;
