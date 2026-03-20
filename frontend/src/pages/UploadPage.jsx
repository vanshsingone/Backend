import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../api/axios"
import { HiCloudArrowUp } from "react-icons/hi2"
import "./Channel.css"

const UploadPage = () => {
    const [formData, setFormData] = useState({ title: "", description: "" })
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!videoFile || !thumbnail) {
            setError("Please select both a video file and a thumbnail.")
            return
        }
        setError("")
        setUploading(true)

        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("videoFile", videoFile)
            data.append("thumbnail", thumbnail)

            const res = await axiosInstance.post("/videos", data, {
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total)
                    setProgress(percent)
                },
            })

            navigate(`/video/${res.data.data._id}`)
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="upload-page">
            <h2>Upload Video</h2>

            <form className="upload-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}

                <div className="upload-dropzone" onClick={() => document.getElementById("video-input").click()}>
                    <HiCloudArrowUp />
                    <p>Click to select a video file</p>
                    {videoFile && <p className="selected-file">{videoFile.name}</p>}
                    <input
                        id="video-input"
                        type="file"
                        accept="video/*"
                        style={{ display: "none" }}
                        onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                </div>

                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Enter video title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Tell viewers about your video"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        style={{
                            width: "100%",
                            padding: "10px 14px",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            resize: "vertical",
                        }}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Thumbnail</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        required
                    />
                </div>

                {uploading && (
                    <div className="upload-progress">
                        <div className="upload-progress-bar">
                            <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="upload-progress-text">Uploading... {progress}%</p>
                    </div>
                )}

                <button className="auth-btn" type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Publish Video"}
                </button>
            </form>
        </div>
    )
}

export default UploadPage
