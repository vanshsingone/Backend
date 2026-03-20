import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { HiPlay, HiMagnifyingGlass, HiPlus, HiArrowRightOnRectangle, HiUser, HiCog6Tooth } from "react-icons/hi2"
import "./Navbar.css"

const Navbar = () => {
    const { user, logout } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleLogout = async () => {
        await logout()
        setShowDropdown(false)
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <HiPlay />
                    <span>VidTube</span>
                </Link>
            </div>

            <form className="navbar-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="navbar-search-btn" type="submit">
                    <HiMagnifyingGlass />
                </button>
            </form>

            <div className="navbar-right">
                {user ? (
                    <>
                        <Link to="/upload" className="navbar-upload-btn">
                            <HiPlus />
                            Upload
                        </Link>

                        <div className="navbar-user-menu">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="navbar-avatar"
                                onClick={() => setShowDropdown(!showDropdown)}
                            />

                            {showDropdown && (
                                <div className="user-dropdown">
                                    <div className="user-dropdown-header">
                                        <img src={user.avatar} alt={user.username} />
                                        <div className="user-dropdown-info">
                                            <h4>{user.fullName}</h4>
                                            <p>@{user.username}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/channel/${user.username}`}
                                        className="user-dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <HiUser /> My Channel
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="user-dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <HiCog6Tooth /> Dashboard
                                    </Link>
                                    <button
                                        className="user-dropdown-item danger"
                                        onClick={handleLogout}
                                    >
                                        <HiArrowRightOnRectangle /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="navbar-auth-btn">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar
