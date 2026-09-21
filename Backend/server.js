import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import notFoundHandler from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import pillarRoutes from "./routes/pillarRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

import DataInitializationService from "./services/DataInitializeService.js";

dotenv.config();

const app = express();

// Connect to Database and initialize default Admin User
connectDB().then(async () => {
  try {
    const dataInit = new DataInitializationService();
    await dataInit.initializeAdminUser();
  } catch (error) {
    console.error("⚠️ Data initialization error:", error.message);
  }
});

// CORS Configuration — Normalize origins to ignore trailing slashes
const rawOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://new-folder-2-tejova.onrender.com",
  "https://tejova-admin-dashboard.onrender.com",
].filter(Boolean);

const allowedOrigins = rawOrigins.map((url) => url.replace(/\/+$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS policy violation: Origin ${origin} not allowed`)
    );
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root Endpoint
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to TEJOVA API",
  });
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "TEJOVA API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/pillars", pillarRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingsRoutes);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TEJOVA Backend Server running on port ${PORT}`);
});

export default app;
