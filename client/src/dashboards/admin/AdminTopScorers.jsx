/**
 * Admin Top Scorer Analytics & Academic Rankings
 * ---------------------------------------------
 * Provides school-wide ranking analytics filtered by:
 * - Class (Grade + Section)
 * - Grade Level (9, 10, 11, 12)
 * - School-Wide (Top 5, 10, 20)
 * - Individual Subject Top Scorers
 * 
 * STRICT COMPLIANCE: Numerical marks, averages, and rankings only.
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Trophy,
  Medal,
  Award,
  RefreshCw,
  Search,
  Filter,
  Users,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  getTopScorersByClass,
  getTopScorersByGrade,
  getTopScorersSchoolWide,
  getTopScorersBySubject,
  recalculateRankings,
  getSubjects,
} from "../../services/authService";

const GRADE_LEVELS = ["9", "10", "11", "12"];
const SECTIONS = ["A", "B", "C", "D"];
const SEMESTERS = ["Semester 1", "Semester 2"];

const AdminTopScorers = () => {
  const [activeTab, setActiveTab] = useState("school"); // "school" | "grade" | "class" | "subject"
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  // Global filters
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [semester, setSemester] = useState("Semester 1");
  const [assessmentType, setAssessmentType] = useState("All");

  // Tab-specific filters
  const [selectedGrade, setSelectedGrade] = useState("10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [schoolLimit, setSchoolLimit] = useState(10);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);

  // Data states
  const [topScorers, setTopScorers] = useState([]);

  // Load curriculum subjects for the subject filter
  useEffect(() => {
    getSubjects({ is_active: true })
      .then((res) => {
        const list = res.data?.data || [];
        setSubjectsList(list);
        if (list.length > 0 && !selectedSubject) {
          setSelectedSubject(list[0].name);
        }
      })
      .catch(() => {});
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "school") {
        const res = await getTopScorersSchoolWide({
          academic_year: academicYear,
          semester,
          assessment_type: assessmentType,
          limit: schoolLimit,
        });
        setTopScorers(res.data?.data || []);
      } else if (activeTab === "grade") {
        const res = await getTopScorersByGrade({
          academic_year: academicYear,
          semester,
          assessment_type: assessmentType,
          grade_level: selectedGrade,
          limit: 15,
        });
        setTopScorers(res.data?.data || []);
      } else if (activeTab === "class") {
        const res = await getTopScorersByClass({
          academic_year: academicYear,
          semester,
          assessment_type: assessmentType,
          grade_level: selectedGrade,
          section: selectedSection,
          limit: 15,
        });
        setTopScorers(res.data?.data || []);
      } else if (activeTab === "subject") {
        if (!selectedSubject) return;
        const res = await getTopScorersBySubject({
          academic_year: academicYear,
          semester,
          subject: selectedSubject,
          grade_level: selectedGrade,
          limit: 15,
        });
        setTopScorers(res.data?.data || []);
      }
    } catch {
      toast.error("Failed to load top scorers data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    activeTab,
    academicYear,
    semester,
    assessmentType,
    selectedGrade,
    selectedSection,
    schoolLimit,
    selectedSubject,
  ]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await recalculateRankings({
        academic_year: academicYear,
        semester,
        assessment_type: assessmentType,
      });
      toast.success("School-wide numerical rankings recalculated successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Recalculation failed");
    } finally {
      setRecalculating(false);
    }
  };

  const getRankBadge = (rank) => {
    const num = parseInt(rank, 10);
    if (num === 1) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
          <Trophy className="h-3.5 w-3.5 text-amber-600" /> 1st Rank
        </span>
      );
    }
    if (num === 2) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-black text-slate-800 dark:bg-slate-700 dark:text-slate-200">
          <Medal className="h-3.5 w-3.5 text-slate-500" /> 2nd Rank
        </span>
      );
    }
    if (num === 3) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-700/20 px-2.5 py-1 text-xs font-black text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
          <Award className="h-3.5 w-3.5 text-amber-700" /> 3rd Rank
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Ethiopian Academic Performance System
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-3xl">
            Student Performance & Top Scorer Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Automatic school-wide ranking engine based purely on numerical marks, averages, and finalized results.
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-4 w-4 ${recalculating ? "animate-spin" : ""}`} />
          {recalculating ? "Calculating..." : "Recalculate Rankings"}
        </button>
      </div>

      {/* Global Academic Year & Semester Selector */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-100 dark:border-slate-800 dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Filter className="h-3.5 w-3.5" /> Academic Period:
        </div>

        <select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="2024/2025">Academic Year 2024/2025</option>
          <option value="2023/2024">Academic Year 2023/2024</option>
          <option value="2022/2023">Academic Year 2022/2023</option>
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={assessmentType}
          onChange={(e) => setAssessmentType(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="All">All Finalized Assessments</option>
          <option value="Final Exam">Final Examination</option>
          <option value="Midterm">Midterm Examination</option>
        </select>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("school")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "school"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <Trophy className="h-4 w-4" />
          Overall School Top Scorers
        </button>

        <button
          onClick={() => setActiveTab("grade")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "grade"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <Medal className="h-4 w-4" />
          Top Scorers by Grade Level (9–12)
        </button>

        <button
          onClick={() => setActiveTab("class")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "class"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <Users className="h-4 w-4" />
          Top Scorers by Class & Section
        </button>

        <button
          onClick={() => setActiveTab("subject")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "subject"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Top Scorers by Individual Subject
        </button>
      </div>

      {/* Tab-Specific Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-xs border border-slate-100 dark:border-slate-800 dark:bg-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          {activeTab === "school" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Display:</span>
              {[5, 10, 20].map((l) => (
                <button
                  key={l}
                  onClick={() => setSchoolLimit(l)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    schoolLimit === l
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  Top {l}
                </button>
              ))}
            </div>
          )}

          {(activeTab === "grade" || activeTab === "class" || activeTab === "subject") && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Grade:</span>
              {GRADE_LEVELS.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    selectedGrade === g
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          )}

          {activeTab === "class" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Section:</span>
              {SECTIONS.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    selectedSection === sec
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  Sec {sec}
                </button>
              ))}
            </div>
          )}

          {activeTab === "subject" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {subjectsList.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Showing {topScorers.length} ranked record(s)
        </div>
      </div>

      {/* Main Ranking Table */}
      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : topScorers.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-xs border border-slate-100 dark:border-slate-800 dark:bg-slate-800">
          <Trophy className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-200">
            No finalized academic rankings available for this selection
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Ensure teacher scores are submitted and approved, then click "Recalculate Rankings".
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-100 dark:border-slate-800 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold dark:bg-slate-700/50 dark:border-slate-700 dark:text-slate-300">
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Grade & Section</th>
                  {activeTab === "subject" ? (
                    <>
                      <th className="px-4 py-3">Subject Mark</th>
                      <th className="px-4 py-3">Max Mark</th>
                      <th className="px-4 py-3">Subject %</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3">Total Marks</th>
                      <th className="px-4 py-3">Average %</th>
                      <th className="px-4 py-3">Subjects (Pass/Fail)</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {topScorers.map((row, idx) => {
                  const rank = row.rank || row.class_rank || row.grade_rank || row.school_rank || (idx + 1);
                  return (
                    <tr
                      key={row.student_id || idx}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition ${
                        parseInt(rank, 10) === 1 ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3">{getRankBadge(rank)}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800 dark:text-slate-100">
                          {row.full_name || row.student_name}
                        </div>
                        {row.stream && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            {row.stream}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-300">
                        {row.student_code || row.student_id_code || `STU-${row.student_id}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          Grade {row.grade_level} - {row.section}
                        </span>
                      </td>

                      {activeTab === "subject" ? (
                        <>
                          <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            {parseFloat(row.score).toFixed(1)}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-500">
                            {row.total_marks || 100}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-200">
                            {((parseFloat(row.score) / (parseFloat(row.total_marks) || 100)) * 100).toFixed(1)}%
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            {parseFloat(row.total_marks_obtained).toFixed(1)}
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              / {parseFloat(row.total_possible_marks).toFixed(0)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                                {parseFloat(row.average_percentage).toFixed(1)}%
                              </span>
                              <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-emerald-500"
                                  style={{ width: `${Math.min(parseFloat(row.average_percentage), 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-emerald-600 font-bold">
                              {row.subjects_passed || row.subjects_registered} passed
                            </span>
                            {row.subjects_failed > 0 && (
                              <span className="text-rose-500 font-bold ml-1">
                                ({row.subjects_failed} failed)
                              </span>
                            )}
                          </td>
                        </>
                      )}

                      <td className="px-4 py-3 text-right">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Finalized
                        </span>
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

export default AdminTopScorers;

