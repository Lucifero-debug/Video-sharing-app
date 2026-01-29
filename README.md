# Video Sharing App

A comprehensive full-stack video hosting and sharing platform built with the MERN stack (MongoDB, Express, React, Node.js). This application enables users to upload videos, interact through likes and comments, manage playlists, and subscribe to channels, similar to modern video streaming platforms.

## 🚀 Tech Stack

### Frontend (`mega-frontend`)
- **Framework**: React.js (Vite)
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM
- **Authentication**: Firebase (Google Auth support)
- **UI/Styling**: Styled Components, MUI (Material UI)
- **HTTP Client**: Axios

### Backend (`mega-project`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **File Storage**: Cloudinary (for images/videos), Multer (middleware)
- **Utilities**: Cookie Parser, CORS, Dotenv

## ✨ Key Features
- **User Authentication**: Secure Login/Register with JWT and Google Auth (Firebase).
- **Video Management**: Upload, publish, edit, and delete videos.
- **Interactions**: Like, dislike, and comment on videos.
- **Subscriptions**: Subscribe to channels to see their content.
- **Playlists**: Create and manage video playlists.
- **Dashboard**: Creator dashboard to view channel statistics.
- **Tweets**: Community posts/tweets feature.
- **Responsive Design**: Optimized for various screen sizes.

## 🛠️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `mega-project` directory.

Create a `.env` file in `mega-project/`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
CORS_ORIGIN=*

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 💻 Installation & Setup

Clone the repository:
```bash
git clone <repository_url>
cd <project_directory>
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd mega-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd mega-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the ISC License.
