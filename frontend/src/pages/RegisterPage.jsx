import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { HiPlay } from "react-icons/hi2"
import "./Auth.css"

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
    })
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const data = new FormData()
            data.append("fullName", formData.fullName)
            data.append("email", formData.email)
            data.append("username", formData.username)
            data.append("password", formData.password)
            if (avatar) data.append("avatar", avatar)
            if (coverImage) data.append("coverImage", coverImage)

            await register(data)
            navigate("/login")
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.")
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
                <p className="auth-subtitle">Create your account</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Avatar (Required)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Cover Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
