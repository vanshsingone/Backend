import { useState, useEffect } from "react"
import axiosInstance from "../api/axios"
import VideoCard from "../components/VideoCard"
import { HiClock } from "react-icons/hi2"
import "./Home.css"

const HistoryPage = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get("/users/history")
                setVideos(res.data.data || [])
            } catch (error) {
                console.error("Error fetching history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    if (loading) {
        return (
            <div className="home-page">
                <h2>Watch History</h2>
                <div className="video-grid">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton skeleton-thumbnail" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="home-page">
            <h2>Watch History</h2>
            {videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <HiClock />
                    <h3>No watch history</h3>
                    <p>Videos you watch will appear here.</p>
                </div>
            )}
        </div>
    )
}

export default HistoryPage
