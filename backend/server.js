const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// MongoDB Connect (hotspot pe comment rakho)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
 .catch(err => console.log('❌ MongoDB Error:', err));
// Routes
app.use('/api/auth', require('./routes/auth'));
// Test route
app.get('/', (req, res) => {
  res.json({ message: "RoommateAI Backend Live! 🏠" });
});
// Voice Analysis
app.post('/api/analyze-voice', async (req, res) => {
  const { transcript } = req.body;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Analyze this person\'s personality based on what they said. Return ONLY a JSON object with these fields: type (one of: The Night Owl, The Clean Freak, The Social Butterfly, The Hermit, The Study Machine, The Chaos Goblin), emoji, color (hex), desc (short tagline), analysis (2 sentence analysis). No markdown, just pure JSON.' },
          { role: 'user', content: transcript }
        ],
        max_tokens: 200
      })
    });
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    res.json(result);
  } catch (err) {
    res.json({ type: 'The Night Owl', emoji: '🦉', color: '#8B5CF6', desc: 'Sleeps at 3AM, vibes at midnight', analysis: 'You seem like a chill person who loves late nights!' });
  }
});
// Cloudinary Setup
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image Upload Route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'roommateai' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.log('Upload error:', err);
    res.status(500).json({ error: 'Upload failed!' });
  }
});
// Groq AI Chat
app.post('/api/chat', async (req, res) => {
  const { message, name } = req.body;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
       model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: `You are ${name}, a college student looking for a roommate in Pune. Reply in a friendly, casual Gen-Z style. Keep replies short (1-2 sentences). Use emojis sometimes.` },
          { role: 'user', content: message }
        ],
        max_tokens: 100
      })
    });
   const data = await response.json();
console.log('Groq Response:', JSON.stringify(data));
if (data.choices && data.choices[0]) {
  res.json({ reply: data.choices[0].message.content });
} else {
  res.json({ reply: "Heyyy! 😊" });
}
 } catch (err) {
    console.log('Groq Error:', err);
    res.status(500).json({ reply: "Hey! I'll reply soon 😊" });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join_room', (room) => socket.join(room));
  socket.on('send_message', (data) => io.to(data.room).emit('receive_message', data));
  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 RoommateAI Server running on port ${PORT}`);
});
