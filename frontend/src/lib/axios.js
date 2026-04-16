import axios from "axios";

// axios.defaults.withCredentials = true;
export const axiosInstance = axios.create({
    // baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    // baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://chatup-mz5r.onrender.com/api",
    baseURL: "https://chatup-mz5r.onrender.com/api",
    // withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});