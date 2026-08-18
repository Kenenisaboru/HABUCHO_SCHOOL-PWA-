/**
 * Auth Store (Zustand)
 * --------------------
 * Global state for authentication — user, login/logout.
 * Token is stored in httpOnly cookie (not accessible via JS).
 */
import { create } from "zustand";

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

  isAuthenticated: () => {
    try {
      return !!JSON.parse(localStorage.getItem("user"));
    } catch {
      return false;
    }
  },
}));

export default useAuthStore;
