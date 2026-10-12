import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔗 API Base URL:", API_URL);

const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  // Sub-admin: always use their assignedBranch (ignore localStorage branch)
  if (user?.role === "sub-admin" && user?.assignedBranch?._id) {
    config.headers["x-branch-id"] = user.assignedBranch._id;
  } else {
    // Admin: use selected branch from localStorage
    const selectedBranch = JSON.parse(
      localStorage.getItem("selectedBranch") || "null"
    );
    if (selectedBranch?._id) {
      config.headers["x-branch-id"] = selectedBranch._id;
    }
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;