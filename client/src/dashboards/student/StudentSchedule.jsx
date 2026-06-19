/**
 * Student Schedule — View class timetable
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getSchedules } from "../../services/authService";
import { formatTime } from "../../utils/helpers";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: "📊", end: true },
  { to: "/student/grades", label: "My Grades", icon: "📝" },
  { to: "/student/schedule", label: "Schedule", icon: "📅" },
  { to: "/student/announcements", label: "Announcements", icon: "📢" },
  { to: "/student/contact", label: "Contact", icon: "✉️" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];

const StudentSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSchedules({ limit: 50 });
        setSchedules(res.data.data.schedules);
      } catch {
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout links={studentLinks} title="Class Schedule">
      {loading ? (
        <LoadingSpinner className="py-20" />
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
              {schedules.map((s, i) => (
                <tr key={s.id} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}`}>
                  <td className="px-4 py-3">{s.day}</td>
                  <td className="px-4 py-3">{formatTime(s.start_time)} – {formatTime(s.end_time)}</td>
                  <td className="px-4 py-3 font-medium">{s.subject}</td>
                  <td className="px-4 py-3">{s.teacher_name}</td>
                  <td className="px-4 py-3">Grade {s.grade_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentSchedule;
