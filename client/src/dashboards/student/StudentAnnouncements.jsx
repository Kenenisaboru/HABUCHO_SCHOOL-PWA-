/**
 * Student Announcements — View school announcements
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import SkeletonLoader from "../../components/SkeletonLoader";
import { getAnnouncements } from "../../services/authService";
import { formatDate } from "../../utils/helpers";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: "📊", end: true },
  { to: "/student/grades", label: "My Grades", icon: "📝" },
  { to: "/student/schedule", label: "Schedule", icon: "📅" },
  { to: "/student/announcements", label: "Announcements", icon: "📢" },
  { to: "/student/contact", label: "Contact", icon: "✉️" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnnouncements({ limit: 20 });
        setAnnouncements(res.data.data.announcements);
      } catch {
        toast.error("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout links={studentLinks} title="Announcements">
      {loading ? (
        <SkeletonLoader count={3} />
      ) : announcements.length === 0 ? (
        <p className="text-center text-gray-500">No announcements.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {announcements.map((a) => (
            <div key={a.id} className="card">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{a.content}</p>
              <p className="mt-3 text-xs text-gray-500">{formatDate(a.created_at)} · {a.author_name}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentAnnouncements;
