import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';

import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
  authUser:null,
  isCheckingAuth:true,
  isSigningUp:false,
  checkAuth:async()=>{
    try{
const res=await axiosInstance.get("/auth/check")
        set({authUser:res.data})
    }
    catch(error){
console.log("error in authcheck",error);

    }
    finally{
        set({isCheckingAuth:false})
    }
    },
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
    }
  
}));