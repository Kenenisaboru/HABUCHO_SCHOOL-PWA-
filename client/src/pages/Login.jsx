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
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-600 to-emerald-500 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
            H
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to Habucho School Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@habucho.edu"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <LoadingSpinner size="sm" /> : "Sign In"}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-gray-500 dark:bg-gray-700">
            <p className="mb-1 font-semibold">Demo Accounts:</p>
            <p>Admin: admin@habucho.edu</p>
            <p>Teacher: teacher@habucho.edu</p>
            <p>Student: student@habucho.edu</p>
            <p className="mt-1">Password: Password123!</p>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
