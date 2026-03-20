import { Link } from "react-router-dom"

const formatDuration = (seconds) => {
    if (!seconds) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

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
    if (months < 12) return `${months}mo ago`
    return `${Math.floor(months / 12)}y ago`
}

const formatViews = (views) => {
    if (!views) return "0 views"
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
    return `${views} views`
}

const VideoCard = ({ video }) => {
    return (
        <Link to={`/video/${video._id}`} className="video-card">
            <div className="video-card-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <span className="video-card-duration">
                    {formatDuration(video.duration)}
                </span>
            </div>
            <div className="video-card-info">
                {video.owner?.avatar && (
                    <img
                        src={video.owner.avatar}
                        alt={video.owner.username}
                        className="video-card-avatar"
                    />
                )}
                <div className="video-card-details">
                    <h3 className="video-card-title">{video.title}</h3>
                    {video.owner && (
                        <p className="video-card-channel">
                            {video.owner.fullName || video.owner.username}
                        </p>
                    )}
                    <div className="video-card-meta">
                        <span>{formatViews(video.views)}</span>
                        <span>{timeAgo(video.createdAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default VideoCard
