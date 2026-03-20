import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axiosInstance from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { HiHandThumbUp, HiOutlineHandThumbUp, HiTrash, HiPencil } from "react-icons/hi2"
import "./Video.css"

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return "just now"
    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`
}

const VideoPage = () => {
    const { videoId } = useParams()
    const { user } = useAuth()
    const [video, setVideo] = useState(null)
    const [comments, setComments] = useState([])
    const [suggestedVideos, setSuggestedVideos] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get(`/videos/${videoId}`)
                setVideo(res.data.data)
            } catch (error) {
                console.error("Error fetching video:", error)
            } finally {
                setLoading(false)
            }
        }

        const fetchComments = async () => {
            try {
                const res = await axiosInstance.get(`/comments/${videoId}`)
                setComments(res.data.data.docs || [])
            } catch (error) {
                console.error("Error fetching comments:", error)
            }
        }

        const fetchSuggested = async () => {
            try {
                const res = await axiosInstance.get("/videos", { params: { limit: 8 } })
                const allVideos = res.data.data.docs || []
                setSuggestedVideos(allVideos.filter((v) => v._id !== videoId))
            } catch (error) {
                console.error("Error fetching suggested:", error)
            }
        }

        fetchVideo()
        fetchComments()
        fetchSuggested()
    }, [videoId])

    // Fetch channel info (subscriber count + subscription status)
    useEffect(() => {
        if (!video?.owner?._id) return

        const fetchChannelInfo = async () => {
            try {
                const res = await axiosInstance.get(`/subscriptions/c/${video.owner._id}`)
                const subscribers = res.data.data || []
                setSubscriberCount(subscribers.length)
                if (user) {
                    setIsSubscribed(
                        subscribers.some((s) => s.subscriber?._id === user._id)
                    )
                }
            } catch (error) {
                console.error("Error fetching channel info:", error)
            }
        }

        fetchChannelInfo()
    }, [video, user])

    const handleLike = async () => {
        if (!user) return
        try {
            const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`)
            setIsLiked(res.data.data.isLiked)
        } catch (error) {
            console.error("Error toggling like:", error)
        }
    }

    const handleSubscribe = async () => {
        if (!user || !video?.owner?._id) return
        try {
            const res = await axiosInstance.post(`/subscriptions/c/${video.owner._id}`)
            setIsSubscribed(res.data.data.isSubscribed)
            setSubscriberCount((prev) =>
                res.data.data.isSubscribed ? prev + 1 : prev - 1
            )
        } catch (error) {
            console.error("Error toggling subscription:", error)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim() || !user) return
        try {
            const res = await axiosInstance.post(`/comments/${videoId}`, {
                content: commentText,
            })
            setComments((prev) => [
                { ...res.data.data, owner: { _id: user._id, fullName: user.fullName, username: user.username, avatar: user.avatar } },
                ...prev,
            ])
            setCommentText("")
        } catch (error) {
            console.error("Error adding comment:", error)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await axiosInstance.delete(`/comments/c/${commentId}`)
            setComments((prev) => prev.filter((c) => c._id !== commentId))
        } catch (error) {
            console.error("Error deleting comment:", error)
        }
    }

    if (loading) {
        return (
            <div className="video-page">
                <div>
                    <div className="skeleton" style={{ width: "100%", aspectRatio: "16/9", borderRadius: "10px" }} />
                    <div className="skeleton" style={{ width: "80%", height: "20px", marginTop: "16px", borderRadius: "6px" }} />
                    <div className="skeleton" style={{ width: "40%", height: "16px", marginTop: "10px", borderRadius: "6px" }} />
                </div>
            </div>
        )
    }

    if (!video) {
        return <div className="video-page"><p>Video not found</p></div>
    }

    return (
        <div className="video-page">
            <div className="video-player-wrapper">
                {/* Video Player */}
                <div className="video-player">
                    <video controls autoPlay src={video.videoFile}>
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Video Info */}
                <div className="video-info">
                    <h1 className="video-info-title">{video.title}</h1>

                    <div className="video-info-actions">
                        <div className="video-info-channel">
                            {video.owner?.avatar && (
                                <Link to={`/channel/${video.owner.username}`}>
                                    <img src={video.owner.avatar} alt={video.owner.username} />
                                </Link>
                            )}
                            <div className="video-channel-details">
                                <Link to={`/channel/${video.owner?.username}`}>
                                    <h4>{video.owner?.fullName || video.owner?.username}</h4>
                                </Link>
                                <p>{subscriberCount} subscribers</p>
                            </div>

                            {user && user._id !== video.owner?._id && (
                                <button
                                    className={`subscribe-btn ${isSubscribed ? "subscribed" : "not-subscribed"}`}
                                    onClick={handleSubscribe}
                                >
                                    {isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                            )}
                        </div>

                        <div className="video-info-buttons">
                            <button
                                className={`like-btn ${isLiked ? "liked" : ""}`}
                                onClick={handleLike}
                            >
                                {isLiked ? <HiHandThumbUp /> : <HiOutlineHandThumbUp />}
                                {isLiked ? "Liked" : "Like"}
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="video-description">
                        <div className="video-description-meta">
                            <span>{video.views} views</span>
                            <span>{timeAgo(video.createdAt)}</span>
                        </div>
                        <p className="video-description-text">{video.description}</p>
                    </div>
                </div>

                {/* Comments */}
                <div className="comments-section">
                    <h3 className="comments-header">{comments.length} Comments</h3>

                    {user && (
                        <form className="comment-form" onSubmit={handleAddComment}>
                            <img src={user.avatar} alt={user.username} />
                            <div className="comment-form-input">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                {commentText && (
                                    <div className="comment-form-actions">
                                        <button
                                            type="button"
                                            className="comment-cancel-btn"
                                            onClick={() => setCommentText("")}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="comment-submit-btn"
                                            disabled={!commentText.trim()}
                                        >
                                            Comment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    )}

                    {comments.map((comment) => (
                        <div key={comment._id} className="comment-card">
                            <img
                                src={comment.owner?.avatar || "/default-avatar.png"}
                                alt={comment.owner?.username}
                            />
                            <div className="comment-body">
                                <div className="comment-header">
                                    <span className="comment-author">
                                        @{comment.owner?.username}
                                    </span>
                                    <span className="comment-time">
                                        {timeAgo(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="comment-content">{comment.content}</p>
                                <div className="comment-actions">
                                    {user && user._id === comment.owner?._id && (
                                        <button
                                            className="danger"
                                            onClick={() => handleDeleteComment(comment._id)}
                                        >
                                            <HiTrash /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Videos */}
            <div className="suggested-videos">
                <h3>Up next</h3>
                {suggestedVideos.map((v) => (
                    <Link to={`/video/${v._id}`} key={v._id} className="suggested-card">
                        <div className="suggested-card-thumbnail">
                            <img src={v.thumbnail} alt={v.title} />
                        </div>
                        <div className="suggested-card-info">
                            <p className="suggested-card-title">{v.title}</p>
                            <p className="suggested-card-channel">
                                {v.owner?.fullName || v.owner?.username}
                            </p>
                            <p className="suggested-card-meta">{v.views} views</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default VideoPage
