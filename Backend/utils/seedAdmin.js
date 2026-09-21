import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

// Configure Google Public DNS for MongoDB Atlas SRV resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

/**
 * Seed script to create initial Admin user securely in development mode.
 * Usage: node utils/seedAdmin.js
 */
const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@tejova.com";
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Admin123456";
    const adminName = process.env.ADMIN_SEED_NAME || "TEJOVA Admin";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`ℹ️ Admin user already exists: ${adminEmail} (Role: ${existingAdmin.role})`);
      process.exit(0);
    }

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    });

    console.log(`✅ Admin user created successfully: ${adminUser.email} (ID: ${adminUser._id})`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed Admin user:", error.message);
    process.exit(1);
  }
};

seedAdmin();
