import {create} from "zustand";

const useAuthStore=create((set)=>({
    isValid: false,
    setValid: (arg)=>set({isValid:arg})
}));
export default useAuthStore;