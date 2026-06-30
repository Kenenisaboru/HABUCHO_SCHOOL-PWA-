/**
 * Login Page — Authentication with role-based redirect
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../services/authService";
import useAuthStore from "../context/authStore";
import { getDashboardPath } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      const { token, user } = res.data.data;
      setAuth(token, user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(getDashboardPath(user.role));
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="relative hidden w-1/2 overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-700 to-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur-sm">
            H
          </div>
          <span className="font-display text-xl font-bold text-white">Habucho School</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white">
            Your gateway to academic excellence
          </h2>
          <p className="mt-4 max-w-md text-lg text-emerald-100/80">
            Access grades, schedules, announcements, and more — all in one secure portal.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {["📊 Grades", "📅 Schedule", "📢 News", "✉️ Contact"].map((item) => (
              <div key={item} className="glass rounded-xl px-4 py-3 text-sm font-medium text-white/90">
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-emerald-200/60">
          © {new Date().getFullYear()} Habucho Preparatory School
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white">
                H
              </div>
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Habucho School</span>
            </Link>
          </div>

          <div className="card shadow-xl dark:shadow-emerald-950/10">
            <div className="mb-8 text-center">
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
              <p className="mt-1 text-sm text-slate-500">Sign in to your school portal</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@habucho.edu"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? <LoadingSpinner size="sm" /> : "Sign In"}
              </button>
            </form>

            {import.meta.env.DEV && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="mb-2 font-semibold text-slate-700 dark:text-slate-300">Demo Accounts</p>
                <p>Admin: admin@habucho.edu</p>
                <p>Teacher: teacher@habucho.edu</p>
                <p>Student: student@habucho.edu</p>
                <p className="mt-1 font-medium">Password: Password123!</p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/" className="font-medium text-primary transition-colors hover:text-primary-dark">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
