import { create } from "zustand";
import apiAxios from "@/api/apiAxios";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  csrfToken: null,
  loading: true,

  /* ================== SETTERS ================== */
  setAccessToken: (token) => set({ accessToken: token }),
  setCsrfToken: (token) => set({ csrfToken: token }),
  setUser: (user) => set({ user }),
  setLoading: (state) => set({ loading: state }),

  /* ================== ACTIONS ================== */
  fetchCsrfToken: async () => {
    const res = await apiAxios.get("/auth/csrf-token");
    set({ csrfToken: res.data.csrfToken });
  },

  login: async (accessToken) => {
    try {
      set({ loading: true, accessToken });

      await get().fetchCsrfToken();

      const userRes = await apiAxios.get("/auth/me");
      set({ user: userRes.data.user });
    } catch {
      set({ user: null, accessToken: null });
      throw new Error("Login failed");
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      csrfToken: null,
      loading: false,
    });
  },
}));
