/**
 * Teacher Grades — Manage student grades
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getGrades, createGrade, updateGrade, deleteGrade, getStudents } from "../../services/authService";
import { getGradeLetter } from "../../utils/helpers";


const TeacherGrades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gradeRes, userRes] = await Promise.all([
        getGrades({ limit: 50 }),
        getStudents({ limit: 50 }),
      ]);
      setGrades(gradeRes.data.data.grades);
      setStudents(userRes.data.data.students);
    } catch {
      toast.error("Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ student_id: "", subject: "", score: "", semester: "Semester 1" });
    setShowModal(true);
  };

  const openEdit = (g) => {
    setEditing(g);
    reset({ subject: g.subject, score: g.score, semester: g.semester });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateGrade(editing.id, { subject: data.subject, score: parseFloat(data.score), semester: data.semester });
        toast.success("Grade updated");
      } else {
        await createGrade({ ...data, student_id: parseInt(data.student_id), score: parseFloat(data.score) });
        toast.success("Grade created");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this grade?")) return;
    try {
      await deleteGrade(id);
      toast.success("Grade deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={openCreate} className="btn-primary">+ Add Grade</button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => (
                <tr key={g.id} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}`}>
                  <td className="px-4 py-3">{g.student_name}</td>
                  <td className="px-4 py-3">{g.subject}</td>
                  <td className="px-4 py-3 font-medium">{g.score}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                      {getGradeLetter(parseFloat(g.score))}
                    </span>
                  </td>
                  <td className="px-4 py-3">{g.semester}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(g)} className="mr-2 text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:underline">Delete</button>
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
            <h2 className="mb-4 text-lg font-bold">{editing ? "Edit Grade" : "Add Grade"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {!editing && (
                <select className="input-field" {...register("student_id", { required: true })}>
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name}</option>
                  ))}
                </select>
              )}
              <input className="input-field" placeholder="Subject" {...register("subject", { required: true })} />
              <input type="number" step="0.01" min="0" max="100" className="input-field" placeholder="Score (0-100)" {...register("score", { required: true })} />
              <select className="input-field" {...register("semester")}>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-emerald flex-1">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherGrades;
