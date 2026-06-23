/**
 * Admin Dashboard — Overview with stats and charts
 */
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getStats } from "../../services/authService";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getStats();
        setStats(statsRes.data.data);
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
      data: stats ? [stats.students, stats.teachers, stats.admins] : [0, 0, 0],
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

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <>
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
    </>
  );
};

export default AdminDashboard;
