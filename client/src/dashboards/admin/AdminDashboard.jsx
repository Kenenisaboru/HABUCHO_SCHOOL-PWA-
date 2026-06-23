/**
 * Admin Dashboard — Overview with stats, charts, quick actions, and inbox
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import {
  getStats,
  getContactMessages,
  getUsers,
  createUser,
  createSchedule,
  createAnnouncement,
} from "../../services/authService";
import { formatDate } from "../../utils/helpers";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);

  // Live ticking date-time
  const [currentTime, setCurrentTime] = useState(new Date());

  const { register: registerUser, handleSubmit: handleSubmitUser, reset: resetUser } = useForm();
  const { register: registerSched, handleSubmit: handleSubmitSched, reset: resetSched } = useForm();
  const { register: registerAnn, handleSubmit: handleSubmitAnn, reset: resetAnn } = useForm();

  const fetchData = async () => {
    try {
      const [statsRes, msgRes, teacherRes] = await Promise.all([
        getStats(),
        getContactMessages({ limit: 4 }),
        getUsers({ role: "teacher", limit: 100 }),
      ]);
      setStats(statsRes.data.data);
      setMessages(msgRes.data.data.messages || []);
      setTeachers(teacherRes.data.data.users || []);
    } catch (err) {
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Clock ticker
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Form Submissions
  const onUserSubmit = async (data) => {
    try {
      await createUser(data);
      toast.success("User account created successfully!");
      setShowUserModal(false);
      resetUser();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  const onScheduleSubmit = async (data) => {
    try {
      await createSchedule({
        ...data,
        teacher_id: parseInt(data.teacher_id),
      });
      toast.success("Class schedule created successfully!");
      setShowScheduleModal(false);
      resetSched();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create schedule");
    }
  };

  const onAnnSubmit = async (data) => {
    try {
      await createAnnouncement(data);
      toast.success("Announcement posted successfully!");
      setShowAnnModal(false);
      resetAnn();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post announcement");
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  // Chart Data
  const doughnutData = {
    labels: ["Students", "Teachers", "Admins"],
    datasets: [
      {
        data: stats ? [stats.students, stats.teachers, stats.admins] : [0, 0, 0],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
        borderWidth: 2,
        borderColor: "transparent",
      },
    ],
  };

  const barData = {
    labels: ["Students", "Teachers", "Announcements", "Schedules"],
    datasets: [
      {
        label: "Count",
        data: stats ? [stats.students, stats.teachers, stats.announcements, stats.schedules] : [],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
        borderRadius: 8,
      },
    ],
  };

  const getGreeting = () => {
    const hrs = currentTime.getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greetings Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-md">
              👑 System Administrator
            </span>
            <h1 className="mt-4 text-3xl font-extrabold md:text-4xl tracking-tight">
              {getGreeting()}, {user?.full_name || "Admin"}
            </h1>
            <p className="mt-2 text-slate-200 text-sm md:text-base font-light max-w-md">
              Welcome back to your command center. Monitor system activities, manage school lists, and update class routines.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3.5 rounded-2xl bg-white/10 p-4 backdrop-blur-lg border border-white/10 shadow-inner">
            <span className="text-3xl">⏰</span>
            <div>
              <p className="text-xs font-medium text-slate-300 uppercase tracking-wider">Server Status</p>
              <p className="text-lg font-bold">{currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
              <p className="text-xs text-slate-400">{currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats?.students || 0} icon="🎓" color="blue" />
        <StatCard title="Total Teachers" value={stats?.teachers || 0} icon="👨‍🏫" color="emerald" />
        <StatCard title="Announcements" value={stats?.announcements || 0} icon="📢" color="purple" />
        <StatCard title="Schedules" value={stats?.schedules || 0} icon="📅" color="orange" />
      </div>

      {/* Quick Actions Panel */}
      <div className="card">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-4 dark:border-slate-800">Quick Console Operations</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/60 shadow-xs hover:border-blue-500 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl bg-blue-500/10 p-2.5 rounded-xl text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">👤</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Add User Account</h3>
              <p className="text-xs text-slate-500">Register teachers/students</p>
            </div>
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/60 shadow-xs hover:border-emerald-500 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">📅</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Create Schedule</h3>
              <p className="text-xs text-slate-500">Configure class timetable</p>
            </div>
          </button>

          <button
            onClick={() => setShowAnnModal(true)}
            className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/60 shadow-xs hover:border-purple-500 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl bg-purple-500/10 p-2.5 rounded-xl text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">📢</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Post Announcement</h3>
              <p className="text-xs text-slate-500">Publish school updates</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Stats Charts & Recent Messages */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Charts Container */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card">
              <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">User Distribution</h3>
              <div className="h-64 flex justify-center items-center">
                <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="card">
              <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">System Overview</h3>
              <div className="h-64">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Inbox Messages */}
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-4 dark:border-slate-800">Recent Messages Inbox</h2>
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500 mt-6 text-center">No contact messages received.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="rounded-xl border border-slate-100 p-3 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-800/60">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{msg.name}</p>
                      <span className="text-[10px] text-slate-400">{formatDate(msg.created_at)}</span>
                    </div>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{msg.email}</p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Health */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">System Health</h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Database connection:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Environment mode:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">development</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Client instance:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Vite PWA active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD USER */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-slide-up border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Add User Account</h2>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmitUser(onUserSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Full Name</label>
                <input className="input-field" placeholder="John Doe" {...registerUser("full_name", { required: true })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Email Address</label>
                <input type="email" className="input-field" placeholder="user@habucho.edu" {...registerUser("email", { required: true })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Password</label>
                <input type="password" className="input-field" placeholder="••••••••" {...registerUser("password", { required: true, minLength: 6 })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Role / Access Type</label>
                <select className="input-field" {...registerUser("role", { required: true })}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-emerald flex-1 shadow-sm">Save User</button>
                <button type="button" onClick={() => setShowUserModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE SCHEDULE */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-slide-up border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Create Timetable Schedule</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmitSched(onScheduleSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Grade Level</label>
                <select className="input-field" {...registerSched("grade_level", { required: true })}>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Subject</label>
                <input className="input-field" placeholder="e.g., Mathematics" {...registerSched("subject", { required: true })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Assigned Teacher</label>
                <select className="input-field" {...registerSched("teacher_id", { required: true })}>
                  <option value="">Choose teacher...</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Weekday Day</label>
                <select className="input-field" {...registerSched("day", { required: true })}>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Start Time</label>
                  <input type="time" className="input-field" {...registerSched("start_time", { required: true })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">End Time</label>
                  <input type="time" className="input-field" {...registerSched("end_time", { required: true })} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-emerald flex-1 shadow-sm">Save Schedule</button>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: POST ANNOUNCEMENT */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-slide-up border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Post School Announcement</h2>
              <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmitAnn(onAnnSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Title</label>
                <input className="input-field" placeholder="e.g., Final Exam Schedule" {...registerAnn("title", { required: true })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Announcement Content</label>
                <textarea rows={5} className="input-field" placeholder="Write announcement details..." {...registerAnn("content", { required: true })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 shadow-sm">Post Now</button>
                <button type="button" onClick={() => setShowAnnModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
