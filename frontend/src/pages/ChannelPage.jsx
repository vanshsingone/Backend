import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axiosInstance from "../api/axios"
import { useAuth } from "../context/AuthContext"
import VideoCard from "../components/VideoCard"
import { HiVideoCamera } from "react-icons/hi2"
import "./Channel.css"

const ChannelPage = () => {
    const { username } = useParams()
    const { user } = useAuth()
    const [channel, setChannel] = useState(null)
    const [videos, setVideos] = useState([])
    const [activeTab, setActiveTab] = useState("videos")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChannel = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get(`/users/c/${username}`)
                setChannel(res.data.data)
                setIsSubscribed(res.data.data.isSubscribed || false)
            } catch (error) {
                console.error("Error fetching channel:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchChannel()
    }, [username])

    useEffect(() => {
        if (!channel?._id) return
        const fetchVideos = async () => {
            try {
                const res = await axiosInstance.get("/videos", {
                    params: { userId: channel._id, sortBy: "createdAt", sortType: "desc" },
                })
                setVideos(res.data.data.docs || [])
            } catch (error) {
                console.error("Error fetching channel videos:", error)
            }
        }
        fetchVideos()
    }, [channel])

    const handleSubscribe = async () => {
        if (!user || !channel?._id) return
        try {
            const res = await axiosInstance.post(`/subscriptions/c/${channel._id}`)
            setIsSubscribed(res.data.data.isSubscribed)
            setChannel((prev) => ({
                ...prev,
                subscribersCount: res.data.data.isSubscribed
                    ? prev.subscribersCount + 1
                    : prev.subscribersCount - 1,
            }))
        } catch (error) {
            console.error("Error toggling subscription:", error)
        }
    }

    if (loading) {
        return (
            <div className="channel-page">
                <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "10px" }} />
            </div>
        )
    }

    if (!channel) {
        return <div className="channel-page"><p>Channel not found</p></div>
    }

    return (
        <div className="channel-page">
            <div className="channel-banner">
                {channel.coverImage && (
                    <img src={channel.coverImage} alt="cover" />
                )}
            </div>

            <div className="channel-header">
                <img src={channel.avatar} alt={channel.username} className="channel-avatar" />
                <div className="channel-info">
                    <h1 className="channel-name">{channel.fullName}</h1>
                    <p className="channel-handle">@{channel.username}</p>
                    <div className="channel-stats">
                        <span>{channel.subscribersCount || 0} subscribers</span>
                        <span>{channel.channelsSubscribedToCount || 0} subscriptions</span>
                    </div>
                </div>

                {user && user._id !== channel._id && (
                    <button
                        className={`subscribe-btn ${isSubscribed ? "subscribed" : "not-subscribed"}`}
                        onClick={handleSubscribe}
                    >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                )}
            </div>

            <div className="channel-tabs">
                <button
                    className={`channel-tab ${activeTab === "videos" ? "active" : ""}`}
                    onClick={() => setActiveTab("videos")}
                >
                    Videos
                </button>
            </div>

            {activeTab === "videos" && (
                videos.length > 0 ? (
                    <div className="video-grid">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <HiVideoCamera />
                        <h3>No videos yet</h3>
                        <p>This channel hasn't uploaded any videos.</p>
                    </div>
                )
            )}
        </div>
    )
}

export default ChannelPage
