/**
 * Login Page — Premium authentication with glassmorphism form,
 * animated left panel, show/hide password, role hints
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../services/authService";
import useAuthStore from "../context/authStore";
import { getDashboardPath } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

const FloatingShape = ({ size, top, left, delay, color }) => (
  <div
    className="pointer-events-none absolute rounded-full opacity-20 blur-2xl"
    style={{
      width: size,
      height: size,
      top,
      left,
      background: color,
      animation: `float ${6 + delay}s ease-in-out ${delay}s infinite`,
    }}
  />
);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const featureItems = [
    { icon: "📊", label: "View Grades", desc: "Track your academic progress" },
    { icon: "📅", label: "Class Schedule", desc: "Manage your timetable" },
    { icon: "📢", label: "Announcements", desc: "Stay up to date" },
    { icon: "✉️", label: "Contact Admin", desc: "Reach out anytime" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel ──────────────────────────────────── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12"
        style={{ background: "linear-gradient(150deg, #064e3b 0%, #065f46 25%, #047857 60%, #0f172a 100%)" }}
      >
        {/* Floating blobs */}
        <FloatingShape size="300px" top="5%" left="60%" delay={0} color="radial-gradient(circle, rgba(52,211,153,0.4), rgba(16,185,129,0.1))" />
        <FloatingShape size="200px" top="50%" left="-10%" delay={2} color="radial-gradient(circle, rgba(20,184,166,0.3), transparent)" />
        <FloatingShape size="150px" top="75%" left="70%" delay={4} color="radial-gradient(circle, rgba(5,150,105,0.4), transparent)" />

        {/* Dot mesh */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Top: Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3 group">
          <div
            className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-black/30 transition-transform duration-300 group-hover:scale-105"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
          >
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div>
            <span className="font-display block text-base font-extrabold text-white">Habucho School</span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-emerald-300/80">Preparatory School Portal</span>
          </div>
        </Link>

        {/* Middle: Headline + features */}
        <div className="relative z-10">
          <h2
            className="font-display text-4xl font-extrabold leading-tight text-white xl:text-5xl"
            style={{ animation: "slide-up 0.7s ease-out 0.1s both" }}
          >
            Your gateway to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6ee7b7, #34d399)" }}
            >
              academic
            </span>{" "}
            excellence
          </h2>
          <p
            className="mt-4 max-w-md text-lg text-emerald-100/70"
            style={{ animation: "slide-up 0.7s ease-out 0.25s both" }}
          >
            Access grades, schedules, announcements, and more — all in one secure school portal.
          </p>

          <div
            className="mt-10 grid grid-cols-2 gap-3"
            style={{ animation: "slide-up 0.7s ease-out 0.4s both" }}
          >
            {featureItems.map((item) => (
              <div
                key={item.label}
                className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/12"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-emerald-200/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: copyright + stat */}
        <div className="relative z-10 flex items-end justify-between">
          <p className="text-sm text-emerald-200/50">
            © {new Date().getFullYear()} Habucho Preparatory School
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300">System Online</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────── */}
      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Habucho School</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="card-gradient-border rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 dark:bg-slate-900 dark:shadow-slate-900/40">
            <div className="mb-8 text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              >
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Sign in to your school portal</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="input-field pl-10"
                    placeholder="you@habucho.edu"
                    autoComplete="email"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field pl-10 pr-11"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Demo credentials (dev only) */}
            {import.meta.env.DEV && (
              <div className="mt-6 rounded-xl border border-emerald-200/60 bg-emerald-50/80 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/30">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Demo Accounts (Dev Only)
                </p>
                <div className="space-y-1 text-xs text-emerald-700 dark:text-emerald-400">
                  <p>🛡️ Admin: admin@habucho.edu</p>
                  <p>👨‍🏫 Teacher: teacher@habucho.edu</p>
                  <p>🎓 Student: student@habucho.edu</p>
                  <p className="mt-1.5 font-semibold">Password: Password123!</p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="font-semibold text-primary transition-colors hover:text-primary-dark dark:hover:text-emerald-400">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
