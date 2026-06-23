/**
 * Admin Schedules — CRUD for class timetables
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getUsers } from "../../services/authService";
import { formatTime } from "../../utils/helpers";


const AdminSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedRes, usersRes] = await Promise.all([
        getSchedules({ limit: 50 }),
        getUsers({ role: "teacher", limit: 50 }),
      ]);
      setSchedules(schedRes.data.data.schedules);
      setTeachers(usersRes.data.data.users);
    } catch {
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ grade_level: "11", subject: "", teacher_id: "", day: "Monday", start_time: "08:00", end_time: "09:30" });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    reset({
      grade_level: s.grade_level,
      subject: s.subject,
      teacher_id: s.teacher_id,
      day: s.day,
      start_time: s.start_time?.slice(0, 5),
      end_time: s.end_time?.slice(0, 5),
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, teacher_id: parseInt(data.teacher_id) || null };
      if (editing) {
        await updateSchedule(editing.id, payload);
        toast.success("Schedule updated");
      } else {
        await createSchedule(payload);
        toast.success("Schedule created");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this schedule?")) return;
    try {
      await deleteSchedule(id);
      toast.success("Schedule deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={openCreate} className="btn-primary">+ Add Schedule</button>
      </div>

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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, i) => (
                <tr key={s.id} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}`}>
                  <td className="px-4 py-3">{s.day}</td>
                  <td className="px-4 py-3">{formatTime(s.start_time)} – {formatTime(s.end_time)}</td>
                  <td className="px-4 py-3">{s.subject}</td>
                  <td className="px-4 py-3">{s.teacher_name || "TBA"}</td>
                  <td className="px-4 py-3">Grade {s.grade_level}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(s)} className="mr-2 text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Edit Schedule" : "Add Schedule"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <select className="input-field" {...register("grade_level")}>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
              <input className="input-field" placeholder="Subject" {...register("subject", { required: true })} />
              <select className="input-field" {...register("teacher_id")}>
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.full_name}</option>
                ))}
              </select>
              <select className="input-field" {...register("day")}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="time" className="input-field" {...register("start_time", { required: true })} />
                <input type="time" className="input-field" {...register("end_time", { required: true })} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSchedules;
