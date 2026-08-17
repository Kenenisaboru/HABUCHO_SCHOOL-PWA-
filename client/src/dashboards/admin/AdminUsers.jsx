/**
 * Admin Users — Comprehensive User & Student Management
 * Handles complete student records, identity, academic stream, guardian contacts, and demographics.
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/authService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const { register, handleSubmit, reset, watch } = useForm();
  const selectedRole = watch("role", "student");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        page,
        limit: 10,
        search,
        role: roleFilter,
        grade_level: gradeFilter,
      });
      setUsers(res.data.data.users);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, gradeFilter]);

  const openCreate = () => {
    setEditingUser(null);
    reset({
      full_name: "",
      email: "",
      password: "",
      role: "student",
      student_id: `HPS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      gender: "Male",
      date_of_birth: "",
      grade_level: "11",
      section: "A",
      stream: "Natural Science",
      phone: "",
      parent_name: "",
      parent_phone: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      address: "",
      academic_year: "2024/2025",
      admission_date: new Date().toISOString().split("T")[0],
      blood_group: "",
      previous_school: "",
      remarks: "",
    });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    reset({
      full_name: user.full_name || "",
      email: user.email || "",
      role: user.role || "student",
      password: "",
      student_id: user.student_id || "",
      gender: user.gender || "Male",
      date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : "",
      grade_level: user.grade_level || "11",
      section: user.section || "A",
      stream: user.stream || "Natural Science",
      phone: user.phone || "",
      parent_name: user.parent_name || "",
      parent_phone: user.parent_phone || "",
      emergency_contact_name: user.emergency_contact_name || "",
      emergency_contact_phone: user.emergency_contact_phone || "",
      address: user.address || "",
      academic_year: user.academic_year || "2024/2025",
      admission_date: user.admission_date ? user.admission_date.split("T")[0] : "",
      blood_group: user.blood_group || "",
      previous_school: user.previous_school || "",
      remarks: user.remarks || "",
    });
    setShowModal(true);
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await updateUser(editingUser.id, payload);
        toast.success("User profile updated successfully");
      } else {
        await createUser(data);
        toast.success("Account with full profile created successfully!");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this user account?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="input-field pl-9 text-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            className="input-field max-w-[140px] text-xs"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>

          <select
            className="input-field max-w-[140px] text-xs"
            value={gradeFilter}
            onChange={(e) => { setGradeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>

        <button onClick={openCreate} className="btn-emerald text-xs shadow-sm flex items-center gap-2 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Student / User</span>
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3.5">Student / User</th>
                <th className="px-4 py-3.5">Student ID</th>
                <th className="px-4 py-3.5">Grade & Stream</th>
                <th className="px-4 py-3.5">Parent / Contact</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-400">
                    No users found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center border border-emerald-500/20 dark:text-emerald-400 shrink-0">
                          {u.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate dark:text-white">{u.full_name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {u.student_id ? (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                          {u.student_id}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {u.role === "student" && u.grade_level ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Grade {u.grade_level}{u.section ? ` - Sec ${u.section}` : ""}
                          </p>
                          <p className="text-[11px] text-teal-600 dark:text-teal-400">{u.stream || "General"}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {u.parent_name || u.phone ? (
                        <div>
                          <p className="font-medium text-slate-700 text-xs dark:text-slate-300">{u.parent_name || u.phone}</p>
                          {u.parent_phone && <p className="text-[11px] text-slate-400">{u.parent_phone}</p>}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                          : u.role === "teacher"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetails(u)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEdit(u)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* COMPREHENSIVE CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingUser ? "Edit User & Student Records" : "Register New Student / User Account"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in all required academic, personal, and guardian details.
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* SECTION 1: ACCOUNT CREDENTIALS */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span>1. Account Credentials & Role</span>
                  <div className="h-px bg-emerald-200 dark:bg-emerald-950 grow"></div>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Full Name *</label>
                    <input className="input-field text-xs" placeholder="e.g., Abebe Bikila" {...register("full_name", { required: true })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Email Address *</label>
                    <input type="email" className="input-field text-xs" placeholder="student@habucho.edu" {...register("email", { required: true })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {editingUser ? "New Password (leave blank to keep current)" : "Password *"}
                    </label>
                    <input type="password" className="input-field text-xs" placeholder="••••••••" {...register("password", { required: !editingUser })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">User Role *</label>
                    <select className="input-field text-xs" {...register("role", { required: true })}>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: STUDENT ACADEMIC PLACEMENT (Visible if Student) */}
              {selectedRole === "student" && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-2">
                      <span>2. Academic Placement & Identity</span>
                      <div className="h-px bg-teal-200 dark:bg-teal-950 grow"></div>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Student ID / Roll No</label>
                        <input className="input-field text-xs font-mono" placeholder="HPS/2026/001" {...register("student_id")} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Grade Level</label>
                        <select className="input-field text-xs" {...register("grade_level")}>
                          <option value="9">Grade 9</option>
                          <option value="10">Grade 10</option>
                          <option value="11">Grade 11</option>
                          <option value="12">Grade 12</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Section</label>
                        <select className="input-field text-xs" {...register("section")}>
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                          <option value="D">Section D</option>
                          <option value="E">Section E</option>
                          <option value="F">Section F</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Academic Stream</label>
                        <select className="input-field text-xs" {...register("stream")}>
                          <option value="Natural Science">Natural Science</option>
                          <option value="Social Science">Social Science</option>
                          <option value="General">General Secondary</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Academic Year</label>
                        <input className="input-field text-xs" placeholder="2024/2025" {...register("academic_year")} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Admission Date</label>
                        <input type="date" className="input-field text-xs" {...register("admission_date")} />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: PERSONAL DEMOGRAPHICS */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                      <span>3. Personal & Contact Information</span>
                      <div className="h-px bg-cyan-200 dark:bg-cyan-950 grow"></div>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Gender</label>
                        <select className="input-field text-xs" {...register("gender")}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Date of Birth</label>
                        <input type="date" className="input-field text-xs" {...register("date_of_birth")} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Student Phone Number</label>
                        <input type="tel" className="input-field text-xs" placeholder="+251 9..." {...register("phone")} />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Residential Address / City / Kebele</label>
                      <input className="input-field text-xs" placeholder="e.g., Habucho Town, Kebele 02, House No 123" {...register("address")} />
                    </div>
                  </div>

                  {/* SECTION 4: PARENT / GUARDIAN & EMERGENCY */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                      <span>4. Parent / Guardian & Emergency Contact</span>
                      <div className="h-px bg-indigo-200 dark:bg-indigo-950 grow"></div>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Parent / Guardian Full Name</label>
                        <input className="input-field text-xs" placeholder="Father or Mother Full Name" {...register("parent_name")} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Parent Phone Number</label>
                        <input type="tel" className="input-field text-xs" placeholder="+251 9..." {...register("parent_phone")} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Emergency Contact Person</label>
                        <input className="input-field text-xs" placeholder="Relative or Neighbor Name" {...register("emergency_contact_name")} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Emergency Phone Number</label>
                        <input type="tel" className="input-field text-xs" placeholder="+251 9..." {...register("emergency_contact_phone")} />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: HEALTH & EXTRA */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>5. Health & Background Details</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 grow"></div>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Blood Group</label>
                        <select className="input-field text-xs" {...register("blood_group")}>
                          <option value="">Unknown / Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Previous School Attended</label>
                        <input className="input-field text-xs" placeholder="e.g., Habucho Junior Secondary" {...register("previous_school")} />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Administrative Remarks / Special Notes</label>
                      <textarea rows="2" className="input-field text-xs" placeholder="Any academic or special notes..." {...register("remarks")} />
                    </div>
                  </div>
                </>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" className="btn-emerald flex-1 py-3 text-sm font-bold shadow-md cursor-pointer">
                  {editingUser ? "Save & Update Profile" : "Register Student & Create Account"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 py-3 text-sm font-semibold">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FULL STUDENT PROFILE DETAILS MODAL */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800 max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold text-xl flex items-center justify-center border border-emerald-500/20">
                  {selectedUser.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedUser.full_name}</h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">×</button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-slate-400 block text-[11px]">Role</span>
                  <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">{selectedUser.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Student ID</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedUser.student_id || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Grade & Section</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedUser.grade_level ? `Grade ${selectedUser.grade_level} (${selectedUser.section || "A"})` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Academic Stream</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{selectedUser.stream || "General"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-1 dark:border-slate-800">
                  Personal & Demographics
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <p><strong className="text-slate-500">Gender:</strong> {selectedUser.gender || "—"}</p>
                  <p><strong className="text-slate-500">DOB:</strong> {selectedUser.date_of_birth ? selectedUser.date_of_birth.split("T")[0] : "—"}</p>
                  <p><strong className="text-slate-500">Phone:</strong> {selectedUser.phone || "—"}</p>
                  <p><strong className="text-slate-500">Blood Group:</strong> {selectedUser.blood_group || "—"}</p>
                  <p className="col-span-2"><strong className="text-slate-500">Address:</strong> {selectedUser.address || "—"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-1 dark:border-slate-800">
                  Parent / Guardian & Emergency
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <p><strong className="text-slate-500">Parent Name:</strong> {selectedUser.parent_name || "—"}</p>
                  <p><strong className="text-slate-500">Parent Phone:</strong> {selectedUser.parent_phone || "—"}</p>
                  <p><strong className="text-slate-500">Emergency Name:</strong> {selectedUser.emergency_contact_name || "—"}</p>
                  <p><strong className="text-slate-500">Emergency Phone:</strong> {selectedUser.emergency_contact_phone || "—"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 pb-1 dark:border-slate-800">
                  Academic Background & Notes
                </h4>
                <div className="space-y-2 text-xs">
                  <p><strong className="text-slate-500">Academic Year:</strong> {selectedUser.academic_year || "2024/2025"}</p>
                  <p><strong className="text-slate-500">Admission Date:</strong> {selectedUser.admission_date ? selectedUser.admission_date.split("T")[0] : "—"}</p>
                  <p><strong className="text-slate-500">Previous School:</strong> {selectedUser.previous_school || "—"}</p>
                  {selectedUser.remarks && (
                    <p className="p-3 rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <strong>Remarks:</strong> {selectedUser.remarks}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onClick={() => setShowDetailsModal(false)} className="btn-emerald px-6 py-2 text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
