/**
 * Admin Users — User management with search, pagination, CRUD
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/authService";
import { capitalize } from "../../utils/helpers";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/schedules", label: "Schedules", icon: "📅" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/messages", label: "Messages", icon: "✉️" },
  { to: "/admin/profile", label: "Profile", icon: "👤" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit: 10, search, role: roleFilter });
      setUsers(res.data.data.users);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  const openCreate = () => {
    setEditingUser(null);
    reset({ full_name: "", email: "", password: "", role: "student" });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    reset({ full_name: user.full_name, email: user.email, role: user.role, password: "" });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        const payload = { full_name: data.full_name, email: data.email, role: data.role };
        if (data.password) payload.password = data.password;
        await updateUser(editingUser.id, payload);
        toast.success("User updated");
      } else {
        await createUser(data);
        toast.success("User created");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <DashboardLayout links={adminLinks} title="User Management">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search users..."
          className="input-field max-w-xs"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="input-field max-w-xs"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <button onClick={openCreate} className="btn-primary ml-auto">+ Add User</button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}`}>
                  <td className="px-4 py-3 font-medium">{u.full_name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 capitalize dark:bg-blue-900/30 dark:text-blue-400">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(u)} className="mr-2 text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">{editingUser ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm">Full Name</label>
                <input className="input-field" {...register("full_name", { required: true })} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Email</label>
                <input type="email" className="input-field" {...register("email", { required: true })} />
              </div>
              <div>
                <label className="mb-1 block text-sm">{editingUser ? "New Password (optional)" : "Password"}</label>
                <input type="password" className="input-field" {...register("password", { required: !editingUser })} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Role</label>
                <select className="input-field" {...register("role", { required: true })}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminUsers;
