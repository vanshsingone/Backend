import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
    HiHome,
    HiClock,
    HiHeart,
    HiRectangleStack,
    HiUserGroup,
    HiChatBubbleLeftRight,
    HiChartBar,
} from "react-icons/hi2"
import "./Sidebar.css"

const Sidebar = () => {
    const { user } = useAuth()

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `sidebar-item ${isActive ? "active" : ""}`
                    }
                    end
                >
                    <HiHome /> Home
                </NavLink>
            </div>

            {user && (
                <>
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">You</div>
                        <NavLink
                            to={`/channel/${user.username}`}
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? "active" : ""}`
                            }
                        >
                            <HiUserGroup /> My Channel
                        </NavLink>
                        <NavLink
                            to="/history"
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? "active" : ""}`
                            }
                        >
                            <HiClock /> Watch History
                        </NavLink>
                        <NavLink
                            to="/liked-videos"
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? "active" : ""}`
                            }
                        >
                            <HiHeart /> Liked Videos
                        </NavLink>
                        <NavLink
                            to="/playlists"
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? "active" : ""}`
                            }
                        >
                            <HiRectangleStack /> Playlists
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Creator</div>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? "active" : ""}`
                            }
                        >
                            <HiChartBar /> Dashboard
                        </NavLink>
                        <NavLink
                            to="/tweets"
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? "active" : ""}`
                            }
                        >
                            <HiChatBubbleLeftRight /> Community
                        </NavLink>
                    </div>
                </>
            )}
        </aside>
    )
}

export default Sidebar
