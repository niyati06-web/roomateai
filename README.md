# 🏠 RoommateAI

> **Find your perfect roommate with AI** — Match with compatible flatmates based on your vibe, budget, and lifestyle.

🌐 **Live Demo:** [roommateai-frontend.vercel.app](https://roommateai-frontend.vercel.app)

---

## ✨ Features

- 🔍 **AI-Powered Matching** — Groq AI finds your most compatible roommates
- 💬 **Real-time Chat** — Chat with potential roommates instantly (Socket.io)
- 🎭 **Vibe Quiz** — Discover your roommate personality type
- 🔥 **Smart Filters** — Filter by budget, location, gender preference
- 🔎 **Search** — Search by city, area, or college
- ❤️ **Wishlist** — Save your favorite listings
- ✏️ **Profile Edit** — Customize your roommate DNA
- 🔐 **Auth System** — Login & Signup with JWT (coming soon with MongoDB)
- 📱 **Mobile Friendly** — Fully responsive design

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** — React framework
- **TypeScript** — Type safety
- **Socket.io Client** — Real-time communication

### Backend
- **Node.js + Express** — REST API
- **Socket.io** — Real-time chat
- **Groq AI (LLaMA 3.1)** — AI-powered chat responses
- **MongoDB + Mongoose** — Database (coming soon)
- **JWT** — Authentication (coming soon)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

1. **Clone the repo**
```bash
git clone https://github.com/niyati06-web/roomateai.git
cd roomateai
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Create `.env` file in backend/**
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```

4. **Start Backend**
```bash
node server.js
```

5. **Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

6. **Open Browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
RoommateAI/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   └── .env
└── frontend/
    └── app/
        ├── page.tsx
        ├── layout.tsx
        └── globals.css
```

---

## 🔮 Roadmap

- [ ] MongoDB integration
- [ ] Real user authentication
- [ ] Backend deployment (Render/Railway)
- [ ] Photo upload
- [ ] Push notifications
- [ ] Mobile app (React Native)

---

## 👩‍💻 Made by

**Niyati Motwani** — CSE · 3rd Year · Pune

[![GitHub](https://img.shields.io/badge/GitHub-niyati06--web-black?logo=github)](https://github.com/niyati06-web)

---

⭐ **Star this repo if you like it!**
