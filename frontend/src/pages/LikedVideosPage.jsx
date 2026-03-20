import { useState, useEffect } from "react"
import axiosInstance from "../api/axios"
import VideoCard from "../components/VideoCard"
import { HiHeart } from "react-icons/hi2"
import "./Home.css"

const LikedVideosPage = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                const res = await axiosInstance.get("/likes/videos")
                const data = res.data.data || []
                // API returns [{video: {...}}, ...] — unwrap the video objects
                const unwrapped = data.map((item) => item.video).filter(Boolean)
                setVideos(unwrapped)
            } catch (error) {
                console.error("Error fetching liked videos:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLikedVideos()
    }, [])

    if (loading) {
        return (
            <div className="home-page">
                <h2>Liked Videos</h2>
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
            <h2>Liked Videos</h2>
            {videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <HiHeart />
                    <h3>No liked videos</h3>
                    <p>Videos you like will appear here.</p>
                </div>
            )}
        </div>
    )
}

export default LikedVideosPage
