import { useState, useEffect } from "react"
import axiosInstance from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { HiTrash } from "react-icons/hi2"
import "./Features.css"

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return "just now"
    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`
}

const TweetsPage = () => {
    const { user } = useAuth()
    const [tweets, setTweets] = useState([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        const fetchTweets = async () => {
            try {
                const res = await axiosInstance.get(`/tweets/user/${user._id}`)
                setTweets(res.data.data || [])
            } catch (error) {
                console.error("Error fetching tweets:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTweets()
    }, [user])

    const handleCreateTweet = async (e) => {
        e.preventDefault()
        if (!content.trim()) return
        try {
            const res = await axiosInstance.post("/tweets", { content })
            setTweets((prev) => [
                { ...res.data.data, owner: { _id: user._id, fullName: user.fullName, username: user.username, avatar: user.avatar } },
                ...prev,
            ])
            setContent("")
        } catch (error) {
            console.error("Error creating tweet:", error)
        }
    }

    const handleDeleteTweet = async (tweetId) => {
        try {
            await axiosInstance.delete(`/tweets/${tweetId}`)
            setTweets((prev) => prev.filter((t) => t._id !== tweetId))
        } catch (error) {
            console.error("Error deleting tweet:", error)
        }
    }

    return (
        <div className="tweets-page">
            <h2>Community Posts</h2>

            {user && (
                <form className="tweet-form" onSubmit={handleCreateTweet}>
                    <img src={user.avatar} alt={user.username} />
                    <div className="tweet-form-input">
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button type="submit" disabled={!content.trim()}>
                            Post
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: "80px", marginBottom: "12px", borderRadius: "10px" }} />
                ))
            ) : tweets.length > 0 ? (
                tweets.map((tweet) => (
                    <div key={tweet._id} className="tweet-card">
                        <img src={tweet.owner?.avatar || "/default-avatar.png"} alt="" />
                        <div className="tweet-body">
                            <div className="tweet-header">
                                <span className="tweet-author">@{tweet.owner?.username}</span>
                                <span className="tweet-time">{timeAgo(tweet.createdAt)}</span>
                            </div>
                            <p className="tweet-content">{tweet.content}</p>
                            {user && user._id === tweet.owner?._id && (
                                <div className="tweet-actions">
                                    <button className="danger" onClick={() => handleDeleteTweet(tweet._id)}>
                                        <HiTrash /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: "40px" }}>
                    No community posts yet. Share your thoughts!
                </p>
            )}
        </div>
    )
}

export default TweetsPage
