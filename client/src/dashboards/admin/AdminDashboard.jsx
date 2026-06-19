/**
 * Admin Dashboard — Overview with stats and charts
 */
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getStats, getUsers } from "../../services/authService";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/schedules", label: "Schedules", icon: "📅" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/messages", label: "Messages", icon: "✉️" },
  { to: "/admin/profile", label: "Profile", icon: "👤" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [userBreakdown, setUserBreakdown] = useState({ students: 0, teachers: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          getStats(),
          getUsers({ limit: 100 }),
        ]);
        setStats(statsRes.data.data);
        const users = usersRes.data.data.users;
        setUserBreakdown({
          students: users.filter((u) => u.role === "student").length,
          teachers: users.filter((u) => u.role === "teacher").length,
          admins: users.filter((u) => u.role === "admin").length,
        });
      } catch {
        /* handled by interceptor */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const doughnutData = {
    labels: ["Students", "Teachers", "Admins"],
    datasets: [{
      data: [userBreakdown.students, userBreakdown.teachers, userBreakdown.admins],
      backgroundColor: ["#2563eb", "#10b981", "#8b5cf6"],
    }],
  };

  const barData = {
    labels: ["Students", "Teachers", "Announcements", "Schedules"],
    datasets: [{
      label: "Count",
      data: stats ? [stats.students, stats.teachers, stats.announcements, stats.schedules] : [],
      backgroundColor: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"],
    }],
  };

  if (loading) return <DashboardLayout links={adminLinks} title="Admin Dashboard"><LoadingSpinner className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout links={adminLinks} title="Admin Dashboard">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats?.students || 0} icon="🎓" color="blue" />
        <StatCard title="Total Teachers" value={stats?.teachers || 0} icon="👨‍🏫" color="emerald" />
        <StatCard title="Announcements" value={stats?.announcements || 0} icon="📢" color="purple" />
        <StatCard title="Schedules" value={stats?.schedules || 0} icon="📅" color="orange" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold">User Distribution</h3>
          <Doughnut data={doughnutData} />
        </div>
        <div className="card">
          <h3 className="mb-4 font-semibold">System Overview</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
