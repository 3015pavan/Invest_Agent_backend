// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import aiRoutes from "./routes/ai.js";
import priceRoutes from "./routes/price.js";
import rebalanceRoutes from "./routes/rebalance.js";
import alertRoutes from "./routes/alert.js";
import dashboardRoutes from "./routes/dashboard.js";

// Scheduler
import { startScheduler } from "./jobs/scheduler.js";

dotenv.config();
connectDB();

const app = express();

// ✅ UPDATED: CORS set to allow your frontend (use CLIENT_URL env to customise)
app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.CLIENT_URL || "https://invest-agent-client.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// ✅ ADDED: simple health check route (useful on Render)
app.get("/health", (req, res) => res.json({ status: "ok" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/rebalance", rebalanceRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Create server & socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL || "https://invest-agent-client.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  // ✅ UPDATED: include polling + websocket for better compatibility on hosts like Render
  transports: ["websocket", "polling"]
});

// Socket.io Events
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);
  socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
});

// Make io available everywhere
app.set("io", io);

// ✅ UPDATED: Use process.env.PORT or fallback to 10000
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== "test") {
    startScheduler(); // Run cron jobs every 5 mins (scheduler will run only when not testing)
  }
});
