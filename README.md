# 🚀 JobZee Remastered – AI Integrated

An AI-powered full-stack job portal built using the MERN stack that connects job seekers and employers with an intelligent recruitment experience.

## 🌐 Live Demo

- **Frontend:** https://jobzee-remastered.vercel.app
- **Backend API:** https://jobzee-remastered.onrender.com

---

# 📖 Overview

JobZee Remastered is a modern recruitment platform where employers can post jobs, manage applications, and hire candidates, while job seekers can discover jobs, apply online, and manage their applications.

The platform also integrates AI-powered features to enhance the recruitment experience.

---

# ✨ Features

## 👨‍💼 Job Seeker

- User Authentication (JWT)
- Register & Login
- Google Authentication
- Search Jobs
- Apply for Jobs
- Upload Resume
- View Applied Jobs
- Update Profile
- AI Assistance

---

## 🏢 Employer

- Employer Authentication
- Post New Jobs
- Edit/Delete Jobs
- View Applicants
- Manage Job Listings
- Employer Dashboard

---

## 🤖 AI Features

- AI-powered Job Assistance
- Resume Analysis
- Smart Career Guidance
- AI Chat Support
- Intelligent Recommendations

---

# 🛠 Tech Stack

### Frontend

- React.js
- Vite
- Redux Toolkit
- Axios
- React Router
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Express File Upload

### AI

- OpenAI API / Gemini API (Configurable)

### Deployment

- Vercel
- Render
- MongoDB Atlas

---

# 📂 Project Structure

```
JobZee-Remastered/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/jobzee-remastered.git
```

```
cd jobzee-remastered
```

---

## Backend Setup

```
cd backend
npm install
```

Create `.env`

```env
PORT=4000

MONGO_URI=your_mongodb_uri

JWT_SECRET_KEY=your_secret

JWT_EXPIRE=7d

COOKIE_EXPIRE=7

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

OPENAI_API_KEY=
```

Run backend

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:4000

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend

```
npm run dev
```

---

# 🚀 Production Deployment

### Frontend

Deploy on

- Vercel

### Backend

Deploy on

- Render

### Database

- MongoDB Atlas

---

# 🔒 Authentication

- JWT Authentication
- HTTP Only Cookies
- Protected Routes
- Google OAuth Login

---

# Future Improvements

- Resume Parsing
- Interview Preparation
- Job Recommendation Engine
- Resume Builder
- Email Notifications
- Chat between Employer & Candidate
- Admin Dashboard

---

# 🤝 Contributing

Contributions are welcome.

1. Fork Repository
2. Create Branch

```
git checkout -b feature-name
```

3. Commit

```
git commit -m "Added new feature"
```

4. Push

```
git push origin feature-name
```

5. Create Pull Request

---

# 👨‍💻 Author

**Ashutosh Mohanty**

AWS Cloud Engineer | MERN Developer | AI Enthusiast

GitHub:
[(https://github.com/ashutosh-mohanty05)]

LinkedIn:
[(https://www.linkedin.com/in/ashutosh-mohanty-674392217/)]

---

# ⭐ Support

If you like this project,

⭐ Star the repository

🍴 Fork it

📢 Share it with others

---

# 📄 License

This project is licensed under the MIT License.
