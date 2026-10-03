import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";

dotenv.config();

/**
 * Migration script to normalize all existing legacy http://res.cloudinary.com URLs in MongoDB to https://res.cloudinary.com
 */
export const migrateCloudinaryHttps = async () => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const collections = ["products", "journals", "media", "pages", "pillars", "settings", "contents"];
    let totalUpdated = 0;

    for (const colName of collections) {
      const docs = await db.collection(colName).find({}).toArray();
      let colUpdated = 0;

      for (const doc of docs) {
        const originalStr = JSON.stringify(doc);
        if (originalStr.includes("http://res.cloudinary.com")) {
          const fixedStr = originalStr.replace(/http:\/\/res\.cloudinary\.com/g, "https://res.cloudinary.com");
          const fixedDoc = JSON.parse(fixedStr);
          delete fixedDoc._id; // Preserve original MongoDB ObjectId

          await db.collection(colName).replaceOne({ _id: doc._id }, fixedDoc);
          colUpdated++;
          totalUpdated++;
        }
      }

      if (colUpdated > 0) {
        console.log(`✅ [Migration] Collection '${colName}': ${colUpdated} documents updated to HTTPS.`);
      }
    }

    console.log(`✨ [Migration Completed] Total ${totalUpdated} legacy Cloudinary URLs migrated to HTTPS.`);
    return totalUpdated;
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  }
};

if (process.argv[1] && process.argv[1].includes("migrateCloudinaryHttps")) {
  migrateCloudinaryHttps().then(() => process.exit(0)).catch(() => process.exit(1));
}
