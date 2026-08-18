/**
 * Auth Store (Zustand)
 * --------------------
 * Global state for authentication — user, login/logout.
 * Token is stored in httpOnly cookie (not accessible via JS).
 */
import { create } from "zustand";
import { getProfile } from "../services/authService";

const useAuthStore = create((set) => ({
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })(),

  setAuth: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  fetchUser: async () => {
    try {
      const res = await getProfile();
      const u = res.data.data;
      const userData = { id: u.id, name: u.full_name, role: u.role };
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData });
    } catch {
      // silent — token may be expired
    }
  },

  isAuthenticated: () => {
    try {
      return !!JSON.parse(localStorage.getItem("user"));
    } catch {
      return false;
    }
  },
}));

export default useAuthStore;