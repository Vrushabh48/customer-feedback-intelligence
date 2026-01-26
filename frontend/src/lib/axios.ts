import axios from "axios";
import { authStore } from "./authStore";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (
      err.response?.status !== 401 ||
      originalRequest._retry
    ) {
      throw err;
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      authStore.clearToken();
      window.location.href = "/login";
      throw err;
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const res = await refreshApi.post("/auth/refresh");
        const newToken = res.data.accessToken;
        authStore.setToken(newToken);

        queue.forEach(cb => cb(newToken));
        queue = [];
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise(resolve => {
      queue.push((token: string) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(api(originalRequest));
      });
    });
  }
);
