const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize, testConnection } = require('./config/db');
const fetchAndStoreUsers = require('./services/userService');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

setInterval(async () => {
  try {
    const result = await fetchAndStoreUsers();
    if (result.success) {
      io.emit('users:updated', {
        message: 'New users added',
        newUsers: result.newUsers,
        totalUsers: result.totalUsers,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('Failed to fetch users:', result.error);
    }
  } catch (error) {
    console.error('Error in fetch interval:', error);
  }
}, 20000);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync();
    console.log('✅ Database synchronized');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup aborted due to database error:', error);
  }
};

startServer();
