import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// const BASE_URL = "https://chatup-1-a7zk.onrender.com"
const BASE_URL = "https://chatup-mz5r.onrender.com"
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
    localStorage.setItem("token", res.data.token);

      // set({ authUser: res.data });
      await get().checkAuth();
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // login: async (data) => {
  //   set({ isLoggingIn: true });
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (token) {
  //     const res = await axiosInstance.post("/auth/login", data);
  //     get().connectSocket();
  //     }
  //     const res = await axiosInstance.post("/auth/login", data);
  //     // set({ authUser: res.data });
  //     localStorage.setItem("token", res.data.token);

  //     toast.success("Logged in successfully");

  //     get().connectSocket();
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isLoggingIn: false });
  //   }
  // },

login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);

    // ✅ save token
    localStorage.setItem("token", res.data.token);

    // ✅ set user
    set({ authUser: res.data });

    toast.success("Logged in successfully");

    // ✅ connect socket AFTER token is saved
    get().connectSocket();
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    set({ isLoggingIn: false });
  }
},

  logout: async () => {
    try {
      // await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

//   connectSocket: () => {
//     const { authUser } = get();
//     // if (!authUser || get().socket?.connected) return;
//     const token = localStorage.getItem("token");
// if (!token) return;

//     const socket = io(BASE_URL, {
//       // withCredentials: true, // this ensures cookies are sent with the connection
//         auth: {
//     token: localStorage.getItem("token"),
//   },
//     });

//     socket.connect();

//     set({ socket });

//     // listen for online users event
//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });
//   },

connectSocket: () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const existingSocket = get().socket;

  // ✅ prevent duplicate connections
  if (existingSocket?.connected) return;

  const socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket"], // 🔥 important for Render stability
  });

  set({ socket });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
},

  // disconnectSocket: () => {
  //   if (get().socket?.connected) get().socket.disconnect();
  // },

  disconnectSocket: () => {
  const socket = get().socket;

  if (socket) {
    socket.disconnect();
    set({ socket: null });
  }
},

}));
