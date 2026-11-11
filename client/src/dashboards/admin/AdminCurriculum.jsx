/**
 * Admin Curriculum & Subject Management
 * -------------------------------------
 * Configures the Ethiopian Secondary Education Curriculum (Grades 9-12),
 * Natural & Social Science streams, assessment marks, and teacher assignments.
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  BookOpen,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Filter,
  UserCheck,
  Trash2,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  getSubjects,
  createSubject,
  updateSubject,
  getTeacherAssignments,
  assignTeacherToSubject,
  removeTeacherAssignment,
  getUsers,
} from "../../services/authService";

const GRADE_OPTIONS = ["9", "10", "11", "12"];
const STREAM_OPTIONS = ["General", "Natural Science", "Social Science", "Both"];

const AdminCurriculum = () => {
  const [activeTab, setActiveTab] = useState("subjects"); // "subjects" | "assignments"
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStream, setFilterStream] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    register: registerAssign,
    handleSubmit: handleAssignSubmit,
    reset: resetAssign,
    formState: { isSubmitting: isAssigning },
  } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [subjRes, assignRes, teachersRes] = await Promise.all([
        getSubjects(),
        getTeacherAssignments(),
        getUsers({ role: "teacher", limit: 100 }).catch(() => ({ data: { data: { users: [] } } })),
      ]);
      setSubjects(subjRes.data?.data || []);
      setAssignments(assignRes.data?.data || []);
      setTeachers(teachersRes.data?.data?.users || teachersRes.data?.data || []);
    } catch {
      toast.error("Failed to load curriculum data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddSubject = () => {
    setEditingSubject(null);
    reset({
      code: "",
      name: "",
      category: "Core",
      stream: "General",
      grade_levels: ["9", "10"],
      max_marks: 100,
      pass_mark: 50,
      is_active: true,
      description: "",
    });
    setShowSubjectModal(true);
  };

  const openEditSubject = (subj) => {
    setEditingSubject(subj);
    reset({
      code: subj.code,
      name: subj.name,
      category: subj.category || "Core",
      stream: subj.stream || "General",
      grade_levels: Array.isArray(subj.grade_levels) ? subj.grade_levels : [],
      max_marks: subj.max_marks || 100,
      pass_mark: subj.pass_mark || 50,
      is_active: subj.is_active,
      description: subj.description || "",
    });
    setShowSubjectModal(true);
  };

  const onSubjectSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        max_marks: parseFloat(formData.max_marks) || 100,
        pass_mark: parseFloat(formData.pass_mark) || 50,
        grade_levels: Array.isArray(formData.grade_levels)
          ? formData.grade_levels
          : [formData.grade_levels].filter(Boolean),
      };

      if (editingSubject) {
        await updateSubject(editingSubject.id, payload);
        toast.success("Subject updated successfully");
      } else {
        await createSubject(payload);
        toast.success("Subject added to Ethiopian curriculum");
      }
      setShowSubjectModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const onAssignSubmit = async (formData) => {
    try {
      await assignTeacherToSubject({
        teacher_id: parseInt(formData.teacher_id, 10),
        subject_id: parseInt(formData.subject_id, 10),
        grade_level: formData.grade_level,
        section: formData.section,
        academic_year: formData.academic_year || "2024/2025",
      });
      toast.success("Teacher assigned successfully");
      setShowAssignModal(false);
      resetAssign();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign teacher");
    }
  };

  const handleRemoveAssignment = async (id) => {
    if (!confirm("Remove this teacher assignment?")) return;
    try {
      await removeTeacherAssignment(id);
      toast.success("Assignment removed");
      loadData();
    } catch {
      toast.error("Failed to remove assignment");
    }
  };

  // Filter subjects
  const filteredSubjects = subjects.filter((s) => {
    if (filterGrade !== "all") {
      const grades = Array.isArray(s.grade_levels) ? s.grade_levels : [];
      if (!grades.includes(filterGrade)) return false;
    }
    if (filterStream !== "all" && s.stream !== filterStream) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchCode = s.code.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            Ethiopian Ministry of Education Standard
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl dark:text-slate-100">
            Curriculum & Subject Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure official curriculum subjects for Grades 9–12, Natural & Social Science
            streams, and teacher assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetAssign({ academic_year: "2024/2025", grade_level: "10", section: "A" });
              setShowAssignModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Assign Teacher
          </button>
          <button
            onClick={openAddSubject}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("subjects")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition ${
            activeTab === "subjects"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Curriculum Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab("assignments")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition ${
            activeTab === "assignments"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Teacher Subject Assignments ({assignments.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : activeTab === "subjects" ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                <Filter className="h-3.5 w-3.5" /> Grade:
              </span>
              <button
                onClick={() => setFilterGrade("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  filterGrade === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                All
              </button>
              {GRADE_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGrade(g)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    filterGrade === g
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  Grade {g}
                </button>
              ))}

              <span className="ml-4 flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                Stream:
              </span>
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <option value="all">All Streams</option>
                {STREAM_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Search subject or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 sm:w-64 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
            />
          </div>

          {/* Subjects Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3">Grade Levels</th>
                    <th className="px-4 py-3">Stream / Pathway</th>
                    <th className="px-4 py-3">Max Marks</th>
                    <th className="px-4 py-3">Pass Mark</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-slate-400">
                        No subjects match your selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((s) => (
                      <tr
                        key={s.id}
                        className="transition hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                      >
                        <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {s.code}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                          {s.name}
                          {s.description && (
                            <div className="text-[10px] font-normal text-slate-400">
                              {s.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(s.grade_levels) &&
                              s.grade_levels.map((lvl) => (
                                <span
                                  key={lvl}
                                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                >
                                  Gr {lvl}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              s.stream === "Natural Science"
                                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"
                                : s.stream === "Social Science"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {s.stream || "General"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                          {s.max_marks || 100}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                          {s.pass_mark || 50}
                        </td>
                        <td className="px-4 py-3">
                          {s.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                              <XCircle className="h-3.5 w-3.5" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openEditSubject(s)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-700"
                            title="Edit Subject"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Teacher Subject Assignments Table */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Subject Code</th>
                  <th className="px-4 py-3">Grade Level</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No teacher subject assignments configured. Click "Assign Teacher" to add one.
                    </td>
                  </tr>
                ) : (
                  assignments.map((a) => (
                    <tr
                      key={a.id}
                      className="transition hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {a.teacher_name}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                        {a.subject_name}
                      </td>
                      <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">
                        {a.subject_code}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          Grade {a.grade_level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          Section {a.section}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{a.academic_year}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveAssignment(a.id)}
                          className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Remove Assignment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subject Create / Edit Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {editingSubject ? "Edit Curriculum Subject" : "Add Ethiopian Curriculum Subject"}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Complies with Ethiopian Ministry of Education curriculum requirements.
            </p>

            <form onSubmit={handleSubmit(onSubjectSubmit)} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Subject Code
                  </label>
                  <input
                    {...register("code", { required: "Code is required" })}
                    placeholder="e.g. MTH-09"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs uppercase dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                  {errors.code && (
                    <span className="text-[10px] text-rose-500">{errors.code.message}</span>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Subject Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                  {errors.name && (
                    <span className="text-[10px] text-rose-500">{errors.name.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Stream / Pathway
                  </label>
                  <select
                    {...register("stream")}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {STREAM_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Language">Language</option>
                  </select>
                </div>
              </div>

              {/* Grade Levels Multi-select */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Applicable Grade Levels
                </label>
                <div className="flex gap-4">
                  {GRADE_OPTIONS.map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <input
                        type="checkbox"
                        value={g}
                        {...register("grade_levels")}
                        className="rounded text-emerald-600"
                      />
                      Grade {g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Maximum Marks (Numerical)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="10"
                    max="1000"
                    {...register("max_marks", { required: true })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Pass Mark Threshold (Numerical)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="1000"
                    {...register("pass_mark", { required: true })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register("is_active")}
                  className="rounded text-emerald-600"
                />
                <label
                  htmlFor="is_active"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Subject is Active in Curriculum
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Description / Curriculum Notes
                </label>
                <textarea
                  {...register("description")}
                  rows="2"
                  placeholder="Ethiopian curriculum notes..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingSubject
                      ? "Update Subject"
                      : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Assign Teacher to Subject
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Link an instructor to a curriculum subject for a specific grade and section.
            </p>

            <form onSubmit={handleAssignSubmit(onAssignSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Select Teacher
                </label>
                <select
                  {...registerAssign("teacher_id", { required: true })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">-- Choose Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || t.full_name} ({t.role || t.position || "Teacher"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Select Subject
                </label>
                <select
                  {...registerAssign("subject_id", { required: true })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects
                    .filter((s) => s.is_active)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}) - {s.stream}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Grade Level
                  </label>
                  <select
                    {...registerAssign("grade_level", { required: true })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Section
                  </label>
                  <select
                    {...registerAssign("section", { required: true })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {["A", "B", "C", "D"].map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Academic Year
                </label>
                <input
                  {...registerAssign("academic_year", { required: true })}
                  defaultValue="2024/2025"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isAssigning ? "Assigning..." : "Save Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCurriculum;
