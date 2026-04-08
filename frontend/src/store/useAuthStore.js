import { create } from "zustand";


export const useAuthStore = create((set)=>(
    {
    authUser: {name:"Karan", _id:123,age:24},
    isLoading: false,

    login: ()=>{
        console.log("condom");
    }
}));