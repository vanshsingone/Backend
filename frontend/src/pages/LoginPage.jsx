import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { HiPlay } from "react-icons/hi2"
import "./Auth.css"

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await login(formData)
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-logo">
                    <HiPlay />
                    <h1>VidTube</h1>
                </div>
                <p className="auth-subtitle">Sign in to continue</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label>Email or Username</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter your email or username"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/register">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
