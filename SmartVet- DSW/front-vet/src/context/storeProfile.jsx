import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const getAuthHeaders = () => {
    const storeUser = JSON.parse(localStorage.getItem("auth-token"))
    return{
        headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${storeUser?.state?.token}`,
        }
    }
}

const storeProfile = create ((set) => ({
    user: null,
    clearUser: () => set({ user: null }),
    profile: async () => {
        try{
            const url = `${import.meta.env.VITE_BACKEND_URL}/veterinario/perfil`
            console.log(getAuthHeaders())
            const respuesta = await axios.get(url, getAuthHeaders())
            console.log(respuesta)
            set({ user:respuesta.data })
        }catch(error){
            console.log(error)
        }
    },
    updateProfile: async (url, data)=>{
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            set({ user: respuesta.data })
            toast.success("Perfil actualizado correctamente")
        } catch (error) {
            toast.error(error.response?.data?.msg)
        }
    },
    updatePasswordProfile: async (url,data)=>{
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            return respuesta
        } catch (error) {
            toast.error(error.response?.data?.msg)
        }
    }
}))


export default storeProfile