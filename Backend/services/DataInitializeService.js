import User from "../models/User.js";

class DataInitializationService {
  async initializeAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    try {
      if (!adminEmail || !adminPassword) {
        console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD is not configured.");
        return;
      }

      const adminExists = await User.findOne({
        email: adminEmail.toLowerCase().trim(),
      });

      if (adminExists) {
        console.log("✅ TEJOVA admin user already exists.");
        return;
      }

      const adminUser = new User({
        name: "TEJOVA Admin",
        email: adminEmail.toLowerCase().trim(),
        password: adminPassword,
        role: "ADMIN",
        isActive: true,
      });

      await adminUser.save();

      console.log("✅ TEJOVA admin user created successfully.");
    } catch (error) {
      console.error("❌ Error during admin initialization:", error.message);
    }
  }
}

export default DataInitializationService;
