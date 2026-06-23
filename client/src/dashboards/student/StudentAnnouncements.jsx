/**
 * Student Announcements — View school announcements
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SkeletonLoader from "../../components/SkeletonLoader";
import { getAnnouncements } from "../../services/authService";
import { formatDate } from "../../utils/helpers";


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
    <>
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
    </>
  );
};

export default StudentAnnouncements;
