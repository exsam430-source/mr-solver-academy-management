import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Config
dotenv.config();

// Routes Import
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Debug env loading
console.log("🔍 ENV CHECK:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "✅ set" : "❌ MISSING",
  JWT_SECRET: process.env.JWT_SECRET ? "✅ set" : "❌ MISSING",
  FRONTEND_URL: process.env.FRONTEND_URL,
});

// ✅ Validate critical env vars
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`❌ Missing required env vars: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Connect Database
connectDB();

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 5000;
const isProduction = process.env.NODE_ENV === "production";

// ✅ Trust proxy (required for Hostinger)
app.set("trust proxy", 1);

// =============================================
// ✅ CORS - Configured for office subdomain
// =============================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://office.mrsolverlearninghub.com",
  "https://mrsolverlearninghub.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests
      if (!origin) return callback(null, true);

      // Allow listed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any Hostinger preview subdomain
      if (origin.endsWith(".hostingersite.com")) {
        return callback(null, true);
      }

      console.warn(`⚠️ CORS blocked: ${origin}`);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-branch-id"],
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static Folder for Photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: PORT,
    message: "Mr Solver Management System Backend Running ✅",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/branches", branchRoutes);

// =============================================
// ✅ SERVE REACT FRONTEND (PRODUCTION ONLY)
// Express 5 compatible - uses middleware
// =============================================
if (isProduction) {
  const frontendDistPath = path.join(__dirname, "dist");

  // Serve static files
  app.use(express.static(frontendDistPath));

  // Catch-all middleware (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) {
        console.error("Error serving index.html:", err.message);
        next(err);
      }
    });
  });

  console.log("📦 Serving frontend from:", frontendDistPath);
}

// 404 Handler (for unmatched API routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found ❌" });
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// =============================================
// START SERVER
// =============================================
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;