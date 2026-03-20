import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layout = () => {
    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="page-content">
                <Outlet />
            </main>
        </>
    )
}

export default Layout
