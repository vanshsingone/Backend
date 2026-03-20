import { useState, useEffect } from "react"
import axiosInstance from "../api/axios"
import VideoCard from "../components/VideoCard"
import "./Channel.css"

const DashboardPage = () => {
    const [stats, setStats] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true)
            try {
                const [statsRes, videosRes] = await Promise.all([
                    axiosInstance.get("/dashboard/stats"),
                    axiosInstance.get("/dashboard/videos"),
                ])
                setStats(statsRes.data.data)
                setVideos(videosRes.data.data || [])
            } catch (error) {
                console.error("Error fetching dashboard:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    if (loading) {
        return (
            <div className="dashboard-page">
                <h2>Channel Dashboard</h2>
                <div className="dashboard-stats">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton stat-card" style={{ height: "90px" }} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            <h2>Channel Dashboard</h2>

            {stats && (
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <p className="stat-card-label">Total Videos</p>
                        <p className="stat-card-value">{stats.totalVideos || 0}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-card-label">Total Views</p>
                        <p className="stat-card-value">{stats.totalViews || 0}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-card-label">Subscribers</p>
                        <p className="stat-card-value">{stats.totalSubscribers || 0}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-card-label">Total Likes</p>
                        <p className="stat-card-value">{stats.totalLikes || 0}</p>
                    </div>
                </div>
            )}

            <div className="dashboard-videos">
                <h3>Your Videos</h3>
                {videos.length > 0 ? (
                    <div className="video-grid">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                ) : (
                    <p style={{ color: "var(--text-secondary)" }}>You haven't uploaded any videos yet.</p>
                )}
            </div>
        </div>
    )
}

export default DashboardPage
