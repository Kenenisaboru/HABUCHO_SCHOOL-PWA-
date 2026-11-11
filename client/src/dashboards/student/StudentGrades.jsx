/**
 * Student Grades & Academic Performance Dashboard
 * -----------------------------------------------
 * Pure numerical grading, ranking indicators, and official
 * Ethiopian report card generation.
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trophy, Award, FileText, CheckCircle2, XCircle } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import { getGrades, getStudentAcademicSummary } from "../../services/authService";
import { exportGradesToPDF, getPassStatus } from "../../utils/helpers";
import { generateEthiopianReportCard } from "../../utils/reportCardGenerator";

const StudentGrades = () => {
  const user = useAuthStore((s) => s.user);
  const [grades, setGrades] = useState([]);
  const [academicSummary, setAcademicSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradeRes, summaryRes] = await Promise.all([
          getGrades({ limit: 100 }),
          user?.id
            ? getStudentAcademicSummary(user.id).catch(() => ({ data: { data: [] } }))
            : Promise.resolve({ data: { data: [] } }),
        ]);
        setGrades(gradeRes.data?.data?.grades || []);
        const summaries = summaryRes.data?.data || [];
        setAcademicSummary(summaries[0] || null);
      } catch {
        toast.error("Failed to load grades");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const handleDownloadReportCard = async () => {
    if (grades.length === 0) {
      toast.error("No examination marks available to generate report card");
      return;
    }
    setGeneratingReport(true);
    try {
      await generateEthiopianReportCard({
        student: user,
        academicSummary,
        subjectGrades: grades,
        academicYear: grades[0]?.academic_year || "2024/2025",
        semester: grades[0]?.semester || "Semester 1",
      });
      toast.success("Official Ethiopian Report Card downloaded!");
    } catch (err) {
      toast.error("Failed to generate report card PDF");
    } finally {
      setGeneratingReport(false);
    }
  };

  const getPercentage = (score, total) => {
    if (!total || total == 0) return 0;
    return ((parseFloat(score) / parseFloat(total)) * 100).toFixed(1);
  };

  const totalObtained = grades.reduce((s, g) => s + (parseFloat(g.score) || 0), 0);
  const totalPossible = grades.reduce((s, g) => s + (parseFloat(g.total_marks) || 100), 0);
  const calculatedAvg = totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : 0;
  const passedCount = grades.filter((g) => (parseFloat(g.score) || 0) >= 50).length;
  const failedCount = grades.length - passedCount;

  return (
    <div className="space-y-6">
      {/* Top Header with Report Card Download */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            Ethiopian Curriculum Secondary Assessment
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl dark:text-slate-100">
            My Academic Results
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Grade {user?.grade_level || "10"} Section {user?.section || "A"} — Numerical grading and
            rank summary.
          </p>
        </div>

        <button
          onClick={handleDownloadReportCard}
          disabled={generatingReport || grades.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          {generatingReport ? "Generating..." : "Download Official Report Card (PDF)"}
        </button>
      </div>

      {/* KPI Cards: Numerical Totals & Rankings */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Total Marks
          </span>
          <div className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">
            {totalObtained.toFixed(1)}
            <span className="ml-1 text-xs font-normal text-slate-400">
              / {totalPossible.toFixed(0)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">{grades.length} subjects recorded</div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Overall Average
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {calculatedAvg}%
          </div>
          <div className="mt-1 text-[11px] font-bold text-emerald-600">
            {parseFloat(calculatedAvg) >= 50 ? "Satisfactory Progress" : "Academic Remedial"}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Class Rank
          </span>
          <div className="mt-2 flex items-center gap-2 text-2xl font-black text-slate-800 dark:text-slate-100">
            <Trophy className="h-5 w-5 text-amber-500" />
            {academicSummary?.class_rank ? `#${academicSummary.class_rank}` : "Pending"}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">In Section {user?.section || "A"}</div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Passed / Failed
          </span>
          <div className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">
            <span className="text-emerald-600">{passedCount}</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className="text-rose-500">{failedCount}</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Pass mark is 50%</div>
        </div>
      </div>

      {/* Main Grades Table */}
      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : grades.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <p className="text-lg font-medium text-slate-500">No examination marks recorded yet.</p>
          <p className="mt-1 text-sm text-slate-400">
            Your scores will appear here once finalized by your teachers.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
                  <th className="border-r border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
                    Subject
                  </th>
                  <th className="border-r border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
                    Assessment Type
                  </th>
                  <th className="border-r border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
                    Score / Total
                  </th>
                  <th className="border-r border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
                    Percentage
                  </th>
                  <th className="border-r border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
                    Status
                  </th>
                  <th className="border-r border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
                    Comments
                  </th>
                  <th className="px-4 py-3 font-semibold">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {grades.map((g) => {
                  const pct = getPercentage(g.score, g.total_marks || 100);
                  return (
                    <tr
                      key={g.id}
                      className="transition-colors hover:bg-emerald-50/30 dark:hover:bg-slate-700/30"
                    >
                      <td className="border-r border-slate-100 px-4 py-3 font-semibold text-slate-800 dark:border-slate-700/50 dark:text-slate-200">
                        {g.subject}
                        <div className="mt-0.5 text-[10px] font-normal text-slate-400">
                          {g.semester}
                        </div>
                      </td>
                      <td className="border-r border-slate-100 px-4 py-3 text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                        <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-blue-600 uppercase dark:bg-blue-900/30 dark:text-blue-400">
                          {g.assessment_type || "Examination"}
                        </span>
                      </td>
                      <td className="border-r border-slate-100 px-4 py-3 font-medium dark:border-slate-700/50">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {g.score}
                        </span>
                        <span className="ml-1 text-slate-400">/ {g.total_marks || 100}</span>
                      </td>
                      <td className="border-r border-slate-100 px-4 py-3 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <span className="w-10 font-bold text-slate-700 dark:text-slate-300">
                            {pct}%
                          </span>
                          <div className="h-1.5 w-16 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="border-r border-slate-100 px-4 py-3 dark:border-slate-700/50">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            parseFloat(pct) >= 50
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                          }`}
                        >
                          {getPassStatus(pct)}
                        </span>
                      </td>
                      <td className="border-r border-slate-100 px-4 py-3 text-slate-500 italic dark:border-slate-700/50">
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
    </div>
  );
};

export default StudentGrades;
