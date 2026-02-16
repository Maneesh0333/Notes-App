import axios from "axios";
import { useAuthStore } from "@/auth/authStore";

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
apiAxios.interceptors.request.use((config) => {
  const { accessToken, csrfToken } = useAuthStore.getState();

  config.headers = config.headers || {};

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (
    csrfToken &&
    ["post", "put", "patch", "delete"].includes(config.method || "")
  ) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */
let refreshPromise = null;

apiAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = apiAxios
            .post("/auth/refresh-token")
            .then((res) => {
              useAuthStore
                .getState()
                .setAccessToken(res.data.accessToken);
              return res.data.accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiAxios(originalRequest);
      } catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiAxios;
