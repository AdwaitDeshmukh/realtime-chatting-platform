import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";


export const useAuthStore = create((set,get) => ({
  authUser:null,
  isCheckingAuth:true,
  isSigningUp:false,
  isLoggingIn: false,
  onlineUsers: [],
  socket:null,
    signup:async(userData)=>{
        try{
            set({isSigningUp:true})
            const res=await axiosInstance.post("/auth/signup",userData)
            set({authUser:res.data});
            toast.success("Signup successful");

        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isSigningUp:false})
        }
    },
     checkAuth: async () => {
    try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        get().connectSocket(); // ← add this
    } catch (error) {
        console.log("error in authcheck", error);
    } finally {
        set({ isCheckingAuth: false });
    }
},

login: async (data) => {
    set({ isLoggingIn: true });
    try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        get().connectSocket(); // ← add this
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
    } finally {
        set({ isLoggingIn: false });
    }
},

logout: async () => {
    try {
        await axiosInstance.post("/auth/logout");
        toast.success("Logged out successfully");
        set({ authUser: null });
        get().disconnectSocket(); // ← add this too
    } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
    }
},
    updateProfile: async (data) => {
    console.log("1. updateProfile called");
    console.log("2. data:", data);
    try {
        console.log("3. sending request...");
        const res = await axiosInstance.put("/auth/update", data);
        console.log("4. response:", res);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
    } catch (error) {
        console.log("5. error:", error);
        console.log("6. error.response:", error.response);
        toast.error(error.response?.data?.message || "Update failed");
    }
},

connectSocket: () => {
    const { authUser } = get();
    console.log("connectSocket called for:", authUser?.fullName);
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
    });

    socket.connect();

    set({ socket });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));