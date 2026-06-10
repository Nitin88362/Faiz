const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const translationRoutes = require('./routes/translation');
const adminRoutes = require('./routes/admin');
const { auth } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io for real-time chat translation
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('./models/User');
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error'));
    }
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.username);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('chat-message', async (data) => {
    try {
      const { message, sourceLanguage, targetLanguage, roomId } = data;

      // Translate message
      const { translate } = require('./utils/translator');
      const result = await translate(message, { from: sourceLanguage, to: targetLanguage });

      // Save to history
      const TranslationHistory = require('./models/TranslationHistory');
      const history = new TranslationHistory({
        user: socket.user._id,
        type: 'chat',
        sourceLanguage,
        targetLanguage,
        originalText: message,
        translatedText: result.text
      });
      await history.save();

      // Emit translated message to room
      io.to(roomId).emit('translated-message', {
        originalMessage: message,
        translatedMessage: result.text,
        user: socket.user.username,
        timestamp: new Date()
      });
    } catch (error) {
      socket.emit('error', { message: 'Translation failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.username);
  });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).send('Not Found');
    }
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('API running'));
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));