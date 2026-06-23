/**
 * Teacher Dashboard — Overview with assigned schedule
 */
import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getSchedules, getGrades, getAnnouncements } from "../../services/authService";
import { formatTime } from "../../utils/helpers";


const TeacherDashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [gradeCount, setGradeCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedRes, gradeRes, annRes] = await Promise.all([
          getSchedules({ limit: 10 }),
          getGrades({ limit: 1 }),
          getAnnouncements({ limit: 1 }),
        ]);
        setSchedules(schedRes.data.data.schedules);
        setGradeCount(gradeRes.data.data.pagination.total);
        setAnnouncementCount(annRes.data.data.pagination.total);
      } catch {
        /* handled by interceptor */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="My Classes" value={schedules.length} icon="📚" color="blue" />
        <StatCard title="Grades Entered" value={gradeCount} icon="📝" color="emerald" />
        <StatCard title="Announcements" value={announcementCount} icon="📢" color="purple" />
      </div>

      <div className="mt-8 card">
        <h3 className="mb-4 font-semibold">Today&apos;s Schedule</h3>
        {schedules.length === 0 ? (
          <p className="text-gray-500">No classes assigned.</p>
        ) : (
          <div className="space-y-3">
            {schedules.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                <div>
                  <p className="font-medium">{s.subject}</p>
                  <p className="text-sm text-gray-500">Grade {s.grade_level} · {s.day}</p>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {formatTime(s.start_time)} – {formatTime(s.end_time)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherDashboard;
