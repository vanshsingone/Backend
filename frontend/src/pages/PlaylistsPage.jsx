import { useState, useEffect } from "react"
import axiosInstance from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { HiRectangleStack } from "react-icons/hi2"
import "./Features.css"

const PlaylistsPage = () => {
    const { user } = useAuth()
    const [playlists, setPlaylists] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        const fetchPlaylists = async () => {
            try {
                const res = await axiosInstance.get(`/playlists/user/${user._id}`)
                setPlaylists(res.data.data || [])
            } catch (error) {
                console.error("Error fetching playlists:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPlaylists()
    }, [user])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        try {
            const res = await axiosInstance.post("/playlists", { name, description })
            setPlaylists((prev) => [res.data.data, ...prev])
            setName("")
            setDescription("")
        } catch (error) {
            console.error("Error creating playlist:", error)
        }
    }

    return (
        <div className="playlists-page">
            <h2>Your Playlists</h2>

            <form className="playlist-create-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Playlist name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>

            {loading ? (
                <div className="playlist-grid">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: "200px", borderRadius: "10px" }} />
                    ))}
                </div>
            ) : playlists.length > 0 ? (
                <div className="playlist-grid">
                    {playlists.map((playlist) => (
                        <div key={playlist._id} className="playlist-card">
                            <div className="playlist-card-thumbnail">
                                <HiRectangleStack />
                                <span className="playlist-card-count">
                                    {playlist.videos?.length || 0} videos
                                </span>
                            </div>
                            <div className="playlist-card-info">
                                <p className="playlist-card-title">{playlist.name}</p>
                                <p className="playlist-card-desc">
                                    {playlist.description || "No description"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <HiRectangleStack />
                    <h3>No playlists</h3>
                    <p>Create a playlist to organize your favorite videos.</p>
                </div>
            )}
        </div>
    )
}

export default PlaylistsPage
