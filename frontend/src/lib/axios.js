import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://chatup-mz5r.onrender.com/api",
    withCredentials: true,
})