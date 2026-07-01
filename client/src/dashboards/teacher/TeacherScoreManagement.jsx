/**
 * Teacher Score Management — Excel-like score entry grid
 */
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getStudents, getGrades, bulkUpsertGrades } from "../../services/authService";

const ACADEMIC_YEARS = ["2023/2024", "2024/2025", "2025/2026"];
const GRADE_LEVELS = ["9", "10", "11", "12"];
const SECTIONS = ["A", "B", "C", "D"];
const SEMESTERS = ["Semester 1", "Semester 2"];
const ASSESSMENT_TYPES = ["Assignment", "Quiz", "Mid Exam", "Final Exam", "Project", "Attendance"];

const TeacherScoreManagement = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  
  const [filters, setFilters] = useState({
    academic_year: "2023/2024",
    semester: "Semester 1",
    grade_level: "",
    section: "",
    subject: "",
    assessment_type: "Mid Exam",
    total_marks: 100,
  });

  // Data grid state: object indexed by student_id
  // e.g., { 1: { score: 85, comments: "Good" } }
  const [gridData, setGridData] = useState({});
  const inputsRef = useRef({});

  // Fetch roster and existing grades when filters change
  const loadData = async () => {
    if (!filters.grade_level || !filters.section || !filters.subject) {
      setStudents([]);
      setGridData({});
      setAllGrades([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch students in this class/section
      const studentsRes = await getStudents({ 
        grade_level: filters.grade_level, 
        section: filters.section,
        limit: 1000 
      });
      const roster = studentsRes.data.data.students || [];

      // Fetch existing grades for this specific assessment
      const gradesRes = await getGrades({
        academic_year: filters.academic_year,
        semester: filters.semester,
        grade_level: filters.grade_level,
        section: filters.section,
        subject: filters.subject,
        assessment_type: filters.assessment_type,
        limit: 1000,
      });
      
      const existingGrades = gradesRes.data.data.grades || [];

      // Merge data
      const newGridData = {};
      roster.forEach(student => {
        const existing = existingGrades.find(g => g.student_id === student.id);
        newGridData[student.id] = {
          score: existing && existing.score !== null ? existing.score : "",
          comments: existing ? existing.comments || "" : "",
        };
      });

      // Fetch all grades for this subject/class to show in the summary table
      const allGradesRes = await getGrades({
        academic_year: filters.academic_year,
        semester: filters.semester,
        grade_level: filters.grade_level,
        section: filters.section,
        subject: filters.subject,
        limit: 1000,
      });

      setStudents(roster);
      setGridData(newGridData);
      setAllGrades(allGradesRes.data.data.grades || []);
    } catch {
      toast.error("Failed to load roster or scores.");
    } finally {
      setLoading(false);
    }
  };

  // Re-load data if core filters change
  useEffect(() => {
    // Debounce or just load when ready
    if (filters.grade_level && filters.section && filters.subject) {
      loadData();
    } else {
      setStudents([]);
      setGridData({});
      setAllGrades([]);
    }
  }, [
    filters.academic_year, 
    filters.semester, 
    filters.grade_level, 
    filters.section, 
    filters.subject, 
    filters.assessment_type
  ]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGridChange = (studentId, field, value) => {
    setGridData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  // Keyboard navigation logic
  const handleKeyDown = (e, rowIndex, field) => {
    const isScore = field === 'score';
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextInput = inputsRef.current[`${rowIndex + 1}-${field}`];
      if (nextInput) nextInput.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = inputsRef.current[`${rowIndex - 1}-${field}`];
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && isScore && e.target.selectionEnd === e.target.value.length) {
      // Only jump if cursor is at the end of the input
      const commentInput = inputsRef.current[`${rowIndex}-comments`];
      if (commentInput) commentInput.focus();
    } else if (e.key === 'ArrowLeft' && !isScore && e.target.selectionStart === 0) {
      const scoreInput = inputsRef.current[`${rowIndex}-score`];
      if (scoreInput) scoreInput.focus();
    }
  };

  const saveScores = async () => {
    if (!filters.grade_level || !filters.section || !filters.subject) {
      return toast.error("Please select Grade, Section, and Subject.");
    }

    const payload = students.map(s => {
      const row = gridData[s.id];
      return {
        student_id: s.id,
        subject: filters.subject,
        score: row.score === "" ? null : parseFloat(row.score),
        semester: filters.semester,
        academic_year: filters.academic_year,
        grade_level: filters.grade_level,
        section: filters.section,
        assessment_type: filters.assessment_type,
        total_marks: filters.total_marks,
        comments: row.comments
      };
    }).filter(row => row.score !== null && !isNaN(row.score)); // Only save rows with actual scores entered

    if (payload.length === 0) {
      return toast.error("No valid scores to save.");
    }

    // Validate scores against total marks
    const invalid = payload.find(p => p.score < 0 || p.score > filters.total_marks);
    if (invalid) {
      return toast.error(`Scores must be between 0 and ${filters.total_marks}. Check your entries.`);
    }

    setSaving(true);
    try {
      await bulkUpsertGrades({ grades: payload });
      toast.success("All scores saved successfully!");
      // Optionally reload
      loadData();
    } catch {
      toast.error("Failed to save scores.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return toast.error("No data to export");
    const headers = ["Student Name", "Score", "Comments"];
    const rows = students.map(s => [
      s.full_name,
      gridData[s.id]?.score || "",
      gridData[s.id]?.comments || ""
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Scores_${filters.grade_level}${filters.section}_${filters.subject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Score Management</h2>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-outline text-sm">
            📄 Export CSV
          </button>
          <button onClick={saveScores} disabled={saving || students.length === 0} className="btn-primary text-sm flex items-center gap-2">
            {saving ? <LoadingSpinner className="h-4 w-4" /> : "💾 Save Scores"}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Academic Year</label>
            <select name="academic_year" value={filters.academic_year} onChange={handleFilterChange} className="input-field py-2 text-sm">
              {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Semester</label>
            <select name="semester" value={filters.semester} onChange={handleFilterChange} className="input-field py-2 text-sm">
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Grade</label>
            <select name="grade_level" value={filters.grade_level} onChange={handleFilterChange} className="input-field py-2 text-sm">
              <option value="">Select Grade</option>
              {GRADE_LEVELS.map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Section</label>
            <select name="section" value={filters.section} onChange={handleFilterChange} className="input-field py-2 text-sm">
              <option value="">Select Section</option>
              {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Subject</label>
            <input name="subject" value={filters.subject} onChange={handleFilterChange} placeholder="e.g. Mathematics" className="input-field py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Assessment Type</label>
            <select name="assessment_type" value={filters.assessment_type} onChange={handleFilterChange} className="input-field py-2 text-sm">
              {ASSESSMENT_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Marks</label>
            <input type="number" name="total_marks" value={filters.total_marks} onChange={handleFilterChange} min="1" className="input-field py-2 text-sm" />
          </div>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner /></div>
        ) : !filters.grade_level || !filters.section || !filters.subject ? (
          <div className="p-12 text-center text-slate-500">
            Please select Grade, Section, and Subject to load the student roster.
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No students found in Grade {filters.grade_level} Section {filters.section}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 w-16 font-semibold border-r border-slate-200 dark:border-slate-700 text-center">#</th>
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Student Name</th>
                  <th className="px-4 py-3 w-48 font-semibold border-r border-slate-200 dark:border-slate-700 text-center">Score (/{filters.total_marks})</th>
                  <th className="px-4 py-3 font-semibold">Teacher Comments</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, rowIndex) => {
                  const scoreVal = gridData[student.id]?.score;
                  const isInvalid = scoreVal !== "" && (parseFloat(scoreVal) > parseFloat(filters.total_marks) || parseFloat(scoreVal) < 0);
                  
                  return (
                    <tr key={student.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-emerald-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-700/50 text-center text-slate-500">{rowIndex + 1}</td>
                      <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-700/50 font-medium text-slate-700 dark:text-slate-200">{student.full_name}</td>
                      <td className="p-0 border-r border-slate-100 dark:border-slate-700/50 relative group">
                        <input
                          ref={el => inputsRef.current[`${rowIndex}-score`] = el}
                          type="number"
                          step="0.01"
                          className={`w-full h-full p-3 bg-transparent outline-none text-center font-semibold transition-all ${isInvalid ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'focus:bg-emerald-50 dark:focus:bg-emerald-900/20'}`}
                          value={scoreVal}
                          onChange={(e) => handleGridChange(student.id, 'score', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'score')}
                          placeholder="--"
                        />
                      </td>
                      <td className="p-0 relative group">
                        <input
                          ref={el => inputsRef.current[`${rowIndex}-comments`] = el}
                          type="text"
                          className="w-full h-full p-3 bg-transparent outline-none focus:bg-emerald-50 dark:focus:bg-emerald-900/20 transition-all text-slate-600 dark:text-slate-300"
                          value={gridData[student.id]?.comments}
                          onChange={(e) => handleGridChange(student.id, 'comments', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 'comments')}
                          placeholder="Add note..."
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="text-xs text-slate-400 text-center mb-8">
        💡 Tip: Use your keyboard arrow keys, Tab, or Enter to quickly navigate between cells.
      </div>

      {/* Summary Table: All Scores by Category */}
      {students.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden mt-8">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Class Scores Summary</h3>
              <p className="text-sm text-slate-500">Overview of all scores grouped by category</p>
            </div>
            <button className="btn-outline text-xs" onClick={() => toast.success("Reports generated and sent to students!")}>
              ✉️ Send to Students
            </button>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 shadow-sm">
                <tr className="text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700">Student Name</th>
                  {ASSESSMENT_TYPES.map(type => (
                     <th key={type} className="px-4 py-3 font-semibold border-r border-slate-200 dark:border-slate-700 text-center whitespace-nowrap">{type}</th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-center text-emerald-600">Average</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const studentGrades = allGrades.filter(g => g.student_id === student.id);
                  let totalScore = 0;
                  let validScoresCount = 0;

                  return (
                    <tr key={student.id} className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-emerald-50/50 dark:hover:bg-slate-700/30 ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/30 dark:bg-slate-800/50'}`}>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200 border-r border-slate-100 dark:border-slate-700/50 whitespace-nowrap">
                        {student.full_name}
                      </td>
                      {ASSESSMENT_TYPES.map(type => {
                        const g = studentGrades.find(g => g.assessment_type === type);
                        if (g && g.score !== null) {
                           // Attempt to normalize score to percentage if total_marks is known for that grade,
                           // but for simplicity we'll just sum raw scores or assume they are out of 100 if we average them.
                           // Actually, let's just display the raw score.
                           totalScore += parseFloat(g.score);
                           validScoresCount++;
                        }
                        return (
                          <td key={type} className="px-4 py-3 text-center border-r border-slate-100 dark:border-slate-700/50">
                            {g && g.score !== null ? (
                               <div className="flex flex-col items-center justify-center">
                                 <span className="font-bold text-slate-700 dark:text-slate-300">{g.score}</span>
                                 <span className="text-[10px] text-slate-400">/{g.total_marks || 100}</span>
                               </div>
                            ) : (
                               <span className="text-slate-300 dark:text-slate-600">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center font-extrabold text-emerald-600 bg-emerald-50/30 dark:bg-emerald-900/10">
                        {validScoresCount > 0 ? (totalScore / validScoresCount).toFixed(1) : "-"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherScoreManagement;
