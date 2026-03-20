import { createContext, useContext, useState, useEffect } from "react"
import axiosInstance from "../api/axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchCurrentUser = async () => {
        try {
            const res = await axiosInstance.get("/users/current-user")
            setUser(res.data.data)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCurrentUser()
    }, [])

    const login = async (credentials) => {
        const res = await axiosInstance.post("/users/login", credentials)
        setUser(res.data.data.user)
        return res.data
    }

    const register = async (formData) => {
        const res = await axiosInstance.post("/users/register", formData)
        return res.data
    }

    const logout = async () => {
        await axiosInstance.post("/users/logout")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
