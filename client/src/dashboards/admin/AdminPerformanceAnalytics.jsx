/**
 * Admin School Performance & Academic Analytics Dashboard
 * -------------------------------------------------------
 * Comprehensive Ethiopian academic performance comparison:
 * - Grade-by-grade performance metrics
 * - Section comparisons
 * - Subject-by-subject average scores & pass rates
 * - School-wide pass/fail distribution
 *
 * STRICT COMPLIANCE: Purely numerical metrics, averages, and percentages.
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  TrendingUp,
  BarChart3,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getSchoolAnalytics } from "../../services/authService";

const AdminPerformanceAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [semester, setSemester] = useState("Semester 1");
  const [assessmentType, setAssessmentType] = useState("All");

  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getSchoolAnalytics({
        academic_year: academicYear,
        semester,
        assessment_type: assessmentType,
      });
      setAnalytics(res.data?.data || null);
    } catch {
      toast.error("Failed to load school performance analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [academicYear, semester, assessmentType]);

  const summary = {
    total_students: analytics?.finalizedStudents ?? analytics?.totalRegisteredStudents ?? 0,
    avg_percentage: analytics?.schoolAverage ?? 0,
    total_pass: analytics?.passedStudents ?? 0,
    total_fail: analytics?.failedStudents ?? 0,
    pass_rate: analytics?.overallPassRate ?? 0,
  };
  const gradeBreakdown = (analytics?.gradePerformance || []).map((g) => ({
    grade_level: g.grade_level,
    student_count: g.student_count,
    avg_score: g.average_percentage,
    pass_rate: g.student_count > 0 ? ((g.passed_count / g.student_count) * 100).toFixed(1) : 0,
  }));
  const subjectBreakdown = (analytics?.subjectPerformance || []).map((s) => ({
    subject: s.subject,
    student_count: s.test_count,
    avg_score: s.average_score,
    highest_score: s.max_score,
    lowest_score: s.min_score,
    pass_rate: s.average_score,
    pass_count: "-",
    fail_count: "-",
  }));
  const sectionBreakdown = (analytics?.sectionPerformance || []).map((sec) => ({
    grade_level: sec.grade_level,
    section: sec.section,
    student_count: sec.student_count,
    avg_score: sec.average_percentage,
    pass_rate: sec.average_percentage,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            Ethiopian Ministry of Education Standards
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl dark:text-slate-100">
            School Academic Performance Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            School-wide academic trends, grade comparisons, subject mastery rates, and student
            achievement metrics.
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="2024/2025">Year 2024/2025</option>
            <option value="2023/2024">Year 2023/2024</option>
            <option value="2022/2023">Year 2022/2023</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : !analytics ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <BarChart3 className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-200">
            No academic data available for this academic period
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Once examination marks are submitted and approved, analytics will populate
            automatically.
          </p>
        </div>
      ) : (
        <>
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold tracking-wider uppercase">
                  Evaluated Students
                </span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">
                {summary.total_students || 0}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Enrolled across Grades 9–12</div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold tracking-wider uppercase">School Average</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {parseFloat(summary.avg_percentage || 0).toFixed(1)}%
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Overall academic average</div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold tracking-wider uppercase">Pass Rate</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">
                {parseFloat(summary.pass_rate || 0).toFixed(1)}%
              </div>
              <div className="mt-1 text-[11px] font-bold text-emerald-600">
                {summary.total_pass || 0} students passing
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold tracking-wider uppercase">Needs Remedial</span>
                <XCircle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">
                {summary.total_fail || 0}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Average below 50% pass mark</div>
            </div>
          </div>

          {/* Grade Comparison & Section Breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grade-Level Comparison */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                Grade-Level Academic Comparison (Grades 9–12)
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Average scores and pass rates compared across each secondary level.
              </p>

              <div className="mt-6 space-y-4">
                {gradeBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-400">No grade data available.</p>
                ) : (
                  gradeBreakdown.map((g) => {
                    const avg = parseFloat(g.avg_score || 0);
                    const passRate = parseFloat(g.pass_rate || 0);
                    return (
                      <div key={g.grade_level} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            Grade {g.grade_level} ({g.student_count} Students)
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                              Avg: {avg.toFixed(1)}%
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Pass Rate: {passRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-600"
                            style={{ width: `${Math.min(avg, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section Comparison */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                <Users className="h-4 w-4 text-blue-600" />
                Section-by-Section Performance
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Comparing class cohorts and sections across the school.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-700">
                      <th className="py-2">Class & Section</th>
                      <th className="py-2">Students</th>
                      <th className="py-2">Class Average</th>
                      <th className="py-2 text-right">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {sectionBreakdown.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-6 text-center text-slate-400">
                          No section data available.
                        </td>
                      </tr>
                    ) : (
                      sectionBreakdown.map((sec, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                          <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                            Grade {sec.grade_level} - {sec.section}
                          </td>
                          <td className="py-2.5 text-slate-500">{sec.student_count}</td>
                          <td className="py-2.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                            {parseFloat(sec.avg_score || 0).toFixed(1)}%
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">
                            {parseFloat(sec.pass_rate || 0).toFixed(1)}%
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Subject Mastery & Performance Breakdown */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  Subject-by-Subject Academic Mastery
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Comprehensive performance across each curriculum subject in Ethiopian secondary
                  education.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3">Students Tested</th>
                    <th className="px-4 py-3">Average Score</th>
                    <th className="px-4 py-3">Highest Mark</th>
                    <th className="px-4 py-3">Lowest Mark</th>
                    <th className="px-4 py-3">Passed</th>
                    <th className="px-4 py-3">Failed</th>
                    <th className="px-4 py-3 text-right">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {subjectBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-10 text-center text-slate-400">
                        No subject evaluation data recorded.
                      </td>
                    </tr>
                  ) : (
                    subjectBreakdown.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                          {s.subject}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{s.student_count}</td>
                        <td className="px-4 py-3 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {parseFloat(s.avg_score || 0).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">
                          {parseFloat(s.highest_score || 0).toFixed(1)}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-500">
                          {parseFloat(s.lowest_score || 0).toFixed(1)}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">{s.pass_count}</td>
                        <td className="px-4 py-3 font-bold text-rose-500">{s.fail_count}</td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`rounded-full px-2 py-0.5 font-bold ${
                              parseFloat(s.pass_rate || 0) >= 80
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : parseFloat(s.pass_rate || 0) >= 50
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            }`}
                          >
                            {parseFloat(s.pass_rate || 0).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPerformanceAnalytics;
