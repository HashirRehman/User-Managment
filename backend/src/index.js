const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/db");
const fetchAndStoreUsers = require("./services/userService");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Fetch users every 20 seconds
setInterval(async () => {
  try {
    const result = await fetchAndStoreUsers();
    if (result.success) {
      io.emit("users:updated", {
        message: "New users added",
        newUsers: result.newUsers,
        totalUsers: result.totalUsers,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error("Failed to fetch users:", result.error);
    }
  } catch (error) {
    console.error("Error in fetch interval:", error);
  }
}, 20000);

// Initialize database and start server
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database synchronization error:", error);
  });
