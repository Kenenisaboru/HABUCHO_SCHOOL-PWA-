/**
 * Auth Store (Zustand)
 * --------------------
 * Global state for authentication — token, user, login/logout.
 * Persists token to localStorage for session continuity.
 */
import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user") || "null"),

  /** Save token and user after successful login/register */
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },

  /** Clear auth state on logout */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },

  /** Check if user is authenticated */
  isAuthenticated: () => !!localStorage.getItem("token"),
}));

export default useAuthStore;
