# ▶️ VidTube – Full-Stack Video Sharing Application

![VidTube Banner](https://img.shields.io/badge/Status-Completed-success)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Nodejs](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-brightgreen)

VidTube is a highly scalable, full-stack video-sharing application designed to replicate the core functionalities of YouTube. The project handles heavy media uploading, complex relational database structures, secure HTTP-only cookie authentication, and delivers a sleek, responsive UI.

---

## 🚀 Features

- **Robust Authentication**: Secure registration and login using JWT (Access & Refresh tokens) and bcrypt password hashing. Tokens are securely stored in HTTP-Only cookies.
- **Video Uploading & Streaming**: Upload massive video files safely. Files are parsed via Multer and uploaded to Cloudinary using advanced chunked streams (`upload_large`) to prevent server crashes.
- **Engagement Mechanics**: Users can "Like" or "Dislike" videos and tweets, "Subscribe" to channels, and leave comments.
- **Complex Aggregations**: Uses advanced Mongoose Aggregation pipelines (`$lookup`, `$addFields`, `$unwind`) to dynamically calculate sub-counts, check if a user is subscribed, and fetch owner profiles in a highly performant way.
- **Watch History & Liked Videos**: Keeps track of what logged-in users have watched and provides specialized feeds for history and liked content.
- **Community Tweets**: A dedicated community tab where users can post, like, and delete text-based channel updates.
- **Custom UI**: A dark-theme, responsive video grid design fully implemented without relying on heavy UI component libraries.

---

## 💻 Tech Stack

### Frontend
- **React.js** (Bootstrapped with Vite for HMR and fast builds)
- **React Router v6** (For seamless SPA routing)
- **Axios** (API requests with credentials/interceptors)
- **Vanilla CSS** (Custom CSS variables matching YouTube's dark schema)
- **React-Icons** (Scalable UI iconography)

### Backend
- **Node.js & Express.js** (REST API development)
- **MongoDB Atlas & Mongoose** (NoSQL Database and ODM)
- **Cloudinary** (Cloud media storage for videos, thumbnails, and avatars)
- **Multer** (Local temp file handling before cloud ingestion)
- **JWT & Bcrypt** (Security and session management)

---

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have Node.js and MongoDB installed or have a MongoDB URI from Atlas. You also need a Cloudinary account.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/vidtube.git
cd vidtube
```

### 2. Backend Setup
```bash
# In the root 'Backend' directory
npm install

# Create a .env file and add the following variables:
# PORT=8000
# MONGODB_URI=your_mongodb_connection_string
# CORS_ORIGIN=http://localhost:5173
# ACCESS_TOKEN_SECRET=your_secret
# ACCESS_TOKEN_EXPIRY=1d
# REFRESH_TOKEN_SECRET=your_refresh_secret
# REFRESH_TOKEN_EXPIRY=10d
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Start the dev server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend folder
cd frontend
npm install

# Start the Vite React app
npm run dev
```

### 4. Open in Browser
Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Project Structure

* **`src/models/`**: Mongoose Schema definitions (User, Video, Tweet, Like, Subscription, Playlist, Comment).
* **`src/controllers/`**: Core logic for manipulating database objects.
* **`src/routes/`**: Express routes mapping endpoints perfectly to controller functions.
* **`src/middlewares/`**: JWT Token verifications, robust `asyncHandler` wrappers, and Multer file validators.
* **`frontend/src/pages/`**: Primary page views (Home, VideoPlayer, User Dashboard, Tweets, etc.).

---

## 🤝 Contribution
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
