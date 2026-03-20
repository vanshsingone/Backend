import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axiosInstance from "../api/axios"
import VideoCard from "../components/VideoCard"
import { HiVideoCamera } from "react-icons/hi2"
import "./Home.css"

const HomePage = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query") || ""

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get("/videos", {
                    params: { query, sortBy: "createdAt", sortType: "desc" },
                })
                setVideos(res.data.data.docs || [])
            } catch (error) {
                console.error("Error fetching videos:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchVideos()
    }, [query])

    if (loading) {
        return (
            <div className="home-page">
                <div className="video-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton skeleton-thumbnail" />
                            <div className="skeleton-info">
                                <div className="skeleton skeleton-avatar" />
                                <div className="skeleton-text">
                                    <div className="skeleton skeleton-title" />
                                    <div className="skeleton skeleton-subtitle" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="home-page">
            {query && (
                <h2>Search results for "{query}"</h2>
            )}

            {videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <HiVideoCamera />
                    <h3>No videos found</h3>
                    <p>
                        {query
                            ? "Try a different search term"
                            : "Be the first to upload a video!"}
                    </p>
                </div>
            )}
        </div>
    )
}

export default HomePage
