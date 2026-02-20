import {create} from 'zustand';



export const useAuthStore = create((set) => ({
  authUser: { name: "john", _id: 123, age: 25 }, 
  isLoggedin:false,

  login:()=>{
    console.log("login called");
    set({isLoggedin:true})

  }
}));