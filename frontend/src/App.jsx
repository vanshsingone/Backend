import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Layout from "./components/Layout"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import VideoPage from "./pages/VideoPage"
import ChannelPage from "./pages/ChannelPage"
import DashboardPage from "./pages/DashboardPage"
import UploadPage from "./pages/UploadPage"
import LikedVideosPage from "./pages/LikedVideosPage"
import HistoryPage from "./pages/HistoryPage"
import TweetsPage from "./pages/TweetsPage"
import PlaylistsPage from "./pages/PlaylistsPage"
import "./index.css"

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Auth routes (no sidebar/navbar) */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Main app routes (with navbar + sidebar) */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="video/:videoId" element={<VideoPage />} />
                        <Route path="channel/:username" element={<ChannelPage />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="upload" element={<UploadPage />} />
                        <Route path="liked-videos" element={<LikedVideosPage />} />
                        <Route path="history" element={<HistoryPage />} />
                        <Route path="tweets" element={<TweetsPage />} />
                        <Route path="playlists" element={<PlaylistsPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
