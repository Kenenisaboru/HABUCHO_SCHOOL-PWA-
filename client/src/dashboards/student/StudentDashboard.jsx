/**
 * Student Dashboard — Overview with grades summary
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import { getGrades, getAnnouncements, getSchedules } from "../../services/authService";
import { getGradeLetter } from "../../utils/helpers";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: "📊", end: true },
  { to: "/student/grades", label: "My Grades", icon: "📝" },
  { to: "/student/schedule", label: "Schedule", icon: "📅" },
  { to: "/student/announcements", label: "Announcements", icon: "📢" },
  { to: "/student/contact", label: "Contact", icon: "✉️" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];

const StudentDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [grades, setGrades] = useState([]);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradeRes, annRes, schedRes] = await Promise.all([
          getGrades({ limit: 50 }),
          getAnnouncements({ limit: 1 }),
          getSchedules({ limit: 1 }),
        ]);
        setGrades(gradeRes.data.data.grades);
        setAnnouncementCount(annRes.data.data.pagination.total);
        setScheduleCount(schedRes.data.data.pagination.total);
      } catch {
        /* handled by interceptor */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgScore = grades.length
    ? (grades.reduce((sum, g) => sum + parseFloat(g.score), 0) / grades.length).toFixed(1)
    : "N/A";

  if (loading) return <DashboardLayout links={studentLinks} title="Student Dashboard"><LoadingSpinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout links={studentLinks} title="Student Dashboard">
      <p className="mb-6 text-lg">Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>!</p>

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Average Score" value={avgScore} icon="📊" color="blue" />
        <StatCard title="Subjects" value={grades.length} icon="📚" color="emerald" />
        <StatCard title="Announcements" value={announcementCount} icon="📢" color="purple" />
      </div>

      <div className="mt-8 card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Recent Grades</h3>
          <Link to="/student/grades" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        {grades.length === 0 ? (
          <p className="text-gray-500">No grades recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {grades.slice(0, 5).map((g) => (
              <div key={g.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                <span>{g.subject}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{g.score}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                    {getGradeLetter(parseFloat(g.score))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
