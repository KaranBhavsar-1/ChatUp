import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  baseURL: "https://chatup-1-a7zk.onrender.com/api"
  withCredentials: true,
});
