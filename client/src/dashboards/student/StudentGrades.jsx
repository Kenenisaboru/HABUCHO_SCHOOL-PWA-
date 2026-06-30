/**
 * Student Grades — View own grades with detailed breakdowns
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import { getGrades } from "../../services/authService";
import { getGradeLetter, exportGradesToPDF } from "../../utils/helpers";


const StudentGrades = () => {
  const user = useAuthStore((s) => s.user);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGrades({ limit: 100 });
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

  // Calculate percentage based on score and total_marks
  const getPercentage = (score, total) => {
    if (!total || total == 0) return 0;
    return ((parseFloat(score) / parseFloat(total)) * 100).toFixed(1);
  };

  const avg = grades.length
    ? (grades.reduce((s, g) => s + parseFloat(getPercentage(g.score, g.total_marks || 100)), 0) / grades.length).toFixed(1)
    : 0;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-semibold tracking-wider uppercase">Overall Average</p>
          <p className="text-3xl font-extrabold text-emerald-600">{avg}%</p>
        </div>
        <button onClick={handleExport} className="btn-primary">📄 Export PDF</button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : grades.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700/50">
          <p className="text-slate-500 font-medium text-lg">No grades recorded yet.</p>
          <p className="text-slate-400 text-sm mt-1">Your scores will appear here once published by your teachers.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Subject</th>
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Assessment Type</th>
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Score / Total</th>
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Percentage</th>
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Grade</th>
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Comments</th>
                  <th className="px-4 py-3 font-semibold">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => {
                  const pct = getPercentage(g.score, g.total_marks || 100);
                  return (
                    <tr key={g.id} className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-emerald-50/50 dark:hover:bg-slate-700/30 transition-colors`}>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-700/50">
                        {g.subject}
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{g.semester}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-700/50">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-wide">
                          {g.assessment_type || "General"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium border-r border-slate-100 dark:border-slate-700/50">
                        <span className="text-slate-800 dark:text-slate-200">{g.score}</span>
                        <span className="text-slate-400 ml-1">/ {g.total_marks || 100}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <span className="w-10 font-bold text-slate-700 dark:text-slate-300">{pct}%</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden w-16">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-700/50">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                          parseFloat(pct) >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                          parseFloat(pct) >= 80 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                          parseFloat(pct) >= 70 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' :
                          parseFloat(pct) >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        }`}>
                          {getGradeLetter(parseFloat(pct))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 border-r border-slate-100 dark:border-slate-700/50 italic">
                        {g.comments || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {g.teacher_name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentGrades;
