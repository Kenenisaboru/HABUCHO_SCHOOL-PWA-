/**
 * Teacher Schedule — View assigned classes
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getSchedules } from "../../services/authService";
import { formatTime } from "../../utils/helpers";


const TeacherSchedule = () => {
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
    <>
      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : schedules.length === 0 ? (
        <p className="text-center text-gray-500">No classes assigned.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((s) => (
            <div key={s.id} className="card">
              <h3 className="text-lg font-semibold text-blue-600">{s.subject}</h3>
              <p className="mt-1 text-sm text-gray-500">Grade {s.grade_level}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p>📅 {s.day}</p>
                <p>🕐 {formatTime(s.start_time)} – {formatTime(s.end_time)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TeacherSchedule;
