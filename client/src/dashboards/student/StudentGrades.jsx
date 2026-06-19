/**
 * Student Grades — View own grades with PDF export
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import { getGrades } from "../../services/authService";
import { getGradeLetter, exportGradesToPDF } from "../../utils/helpers";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: "📊", end: true },
  { to: "/student/grades", label: "My Grades", icon: "📝" },
  { to: "/student/schedule", label: "Schedule", icon: "📅" },
  { to: "/student/announcements", label: "Announcements", icon: "📢" },
  { to: "/student/contact", label: "Contact", icon: "✉️" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];

const StudentGrades = () => {
  const user = useAuthStore((s) => s.user);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGrades({ limit: 50 });
        setGrades(res.data.data.grades);
      } catch {
        toast.error("Failed to load grades");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = () => {
    if (grades.length === 0) {
      toast.error("No grades to export");
      return;
    }
    exportGradesToPDF(grades, user?.name);
    toast.success("PDF downloaded!");
  };

  const avg = grades.length
    ? (grades.reduce((s, g) => s + parseFloat(g.score), 0) / grades.length).toFixed(1)
    : 0;

  return (
    <DashboardLayout links={studentLinks} title="My Grades">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Overall Average</p>
          <p className="text-3xl font-bold text-blue-600">{avg}%</p>
        </div>
        <button onClick={handleExport} className="btn-primary">📄 Export PDF</button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : grades.length === 0 ? (
        <p className="text-center text-gray-500">No grades recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => (
                <tr key={g.id} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}`}>
                  <td className="px-4 py-3 font-medium">{g.subject}</td>
                  <td className="px-4 py-3">{g.score}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                      {getGradeLetter(parseFloat(g.score))}
                    </span>
                  </td>
                  <td className="px-4 py-3">{g.semester}</td>
                  <td className="px-4 py-3">{g.teacher_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentGrades;
