import "dotenv/config";
import express, { json } from "express";
import { connectDB } from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";

import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import zoneRoutes from "./routes/ZoneRoutes.js";
import LostFound from "./routes/lostFoundRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import crowdRoutes from "./routes/crowdRoutes.js";
import TicketRoute from "./routes/ticketRoutes.js";
import cors from "cors";
import path from "path";
import seed from "./models/seed.js";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001; // Hardcoded port

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration - FIX 1: Specify exact origins
app.use(
  cors({
    origin: [
      "https://divyayatra-devsprint.onrender.com", // Backend itself
      "https://divya-yatra-devsprint.vercel.app/",
      "https://divya-yatra-devsprint-ten.vercel.app",
      "https://divya-yatra-devsprint-17xh.vercel.app/",
      "https://divya-yatra-devsprint-17xh.vercel.app",
      "https://divya-yatra-devsprint.vercel.app",// Hypothetical frontend
      "http://localhost:5173",
      "http://localhost:3000",
    ], // Add your frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

// Middleware - FIX 2: Correct order
app.use(json());
app.use(express.urlencoded({ extended: true })); // Move this up before routes
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);

// Static file serving - FIX 4: Better path resolution
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add a test route to check if files exist
app.get("/test-upload/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: "File not found", path: filePath });
    }
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/zone", zoneRoutes);
app.use("/api/v1/lost", LostFound);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/crowd", crowdRoutes);
app.use("/api/v1/ticket", TicketRoute);

// Error handling middleware (should be last)
app.use(errorHandler);

// Clean server startup
const startServer = async () => {
  try {
    console.log("🔄 Starting server...");

    // Connect to database
    await connectDB();
    //await seed();

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
      console.log(
        `📁 Static files served from: ${path.join(__dirname, "uploads")}`
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
